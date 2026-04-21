import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, TextInput, 
  TouchableOpacity, ScrollView, ActivityIndicator,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { addFriend, updateFriend } from '../store/slices/friendSlice';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/Theme';
import ScreenHeader from '../components/ScreenHeader';
import GlassCard from '../components/GlassCard';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

const AddFriendScreen = ({ navigation, route }) => {
  const friend = route.params?.friend;
  const isEdit = !!friend;
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.friends);
  const { isDarkMode } = useSelector(state => state.ui);
  const { triggerHaptic } = useContext(AppContext);
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [formData, setFormData] = useState({
    name: friend?.name || '',
    email: friend?.email || '',
    phone: friend?.phone || '',
    description: friend?.description || '',
    avatar: friend?.avatar || '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = 'Tên không được để trống';
    if (!formData.email) newErrors.email = 'Email không được để trống';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.phone) newErrors.phone = 'Số điện thoại không được để trống';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      triggerHaptic('notificationError');
      return;
    }

    triggerHaptic('impactMedium');
    try {
      if (isEdit) {
        await dispatch(updateFriend({ id: friend._id, friendData: formData })).unwrap();
      } else {
        await dispatch(addFriend(formData)).unwrap();
      }
      navigation.goBack();
    } catch (error) {
      triggerHaptic('notificationError');
    }
  };

  const renderInput = (label, value, key, icon, keyboardType = 'default') => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.subText }]}>{label}</Text>
      <GlassCard intensity={15} isDarkMode={isDarkMode} style={[styles.inputContainer, errors[key] && styles.inputError]}>
        <Ionicons name={icon} size={20} color={Colors.primary} style={{ marginRight: 10 }} />
        <TextInput
          value={value}
          onChangeText={(text) => {
            setFormData({ ...formData, [key]: text });
            if (errors[key]) setErrors({ ...errors, [key]: null });
          }}
          placeholder={`Nhập ${label.toLowerCase()}...`}
          placeholderTextColor={theme.subText + '80'}
          style={[styles.input, { color: theme.text }]}
          keyboardType={keyboardType}
        />
      </GlassCard>
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScreenHeader 
        title={isEdit ? 'Sửa Thông Tin' : 'Thêm Bạn Mới'} 
        subtitle={isEdit ? `Cập nhật thông tin cho ${friend.name}` : 'Nhập thông tin liên lạc'}
        theme={theme} 
        isDarkMode={isDarkMode} 
        showBack
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View entering={ZoomIn.duration(600)} style={styles.avatarPicker}>
            <View style={[styles.avatarCircle, { borderColor: Colors.primary }]}>
              <Ionicons name="person" size={50} color={Colors.primary} />
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={20} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            {renderInput('Họ và tên', formData.name, 'name', 'person-outline')}
            {renderInput('Email', formData.email, 'email', 'mail-outline', 'email-address')}
            {renderInput('Số điện thoại', formData.phone, 'phone', 'call-outline', 'phone-pad')}
            {renderInput('Mô tả', formData.description, 'description', 'information-circle-outline')}
          </Animated.View>

          <TouchableOpacity 
            style={styles.submitBtn} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient 
              colors={[Colors.primary, '#4338CA']} 
              style={styles.submitGradient}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons name={isEdit ? 'save-outline' : 'person-add-outline'} size={22} color="#FFF" />
                  <Text style={styles.submitText}>{isEdit ? 'Lưu Thay Đổi' : 'Thêm Bạn Bè'}</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: { padding: 25, paddingBottom: 50 },
  avatarPicker: { alignSelf: 'center', marginBottom: 30, position: 'relative' },
  avatarCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(99, 102, 241, 0.1)' },
  editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.primary, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8, marginLeft: 5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 15 },
  input: { flex: 1, fontSize: 16, fontWeight: '600' },
  inputError: { borderWidth: 1, borderColor: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: 12, fontWeight: '600', marginTop: 5, marginLeft: 5 },
  submitBtn: { marginTop: 10, borderRadius: 15, overflow: 'hidden', elevation: 5, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  submitGradient: { paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  submitText: { color: '#FFF', fontSize: 17, fontWeight: '800', marginLeft: 10 },
});

export default AddFriendScreen;
