import React, { useState, useContext } from 'react';
import { 
  View, Text, Image, ScrollView, TouchableOpacity, 
  TextInput, Modal, Pressable, Platform, 
  ActivityIndicator, KeyboardAvoidingView, StyleSheet, Alert, Dimensions
} from 'react-native';
import Animated, { FadeInDown, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/Theme';
import GlassCard from '../components/GlassCard';
import PremiumButton from '../components/PremiumButton';
import PremiumInput from '../components/PremiumInput';
import ScreenHeader from '../components/ScreenHeader';
import Toast from '../components/Toast';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const { 
    profileAvatar, profileData, updateProfileData, 
    isDarkMode, setFacultyFilter, triggerHaptic 
  } = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const toastRef = React.useRef(null);
  
  const [editName, setEditName] = useState(profileData.name);
  const [editId, setEditId] = useState(profileData.id);
  const [editMajor, setEditMajor] = useState(profileData.major);

  const gridData = [
     { id: '1', title: 'Công Nghệ Thông Tin', icon: 'laptop', color: '#4A90E2' },
     { id: '2', title: 'Khoa Cơ Điện', icon: 'cog', color: '#E67E22' },
     { id: '3', title: 'Khoa Dược', icon: 'flask', color: '#2ECC71' },
     { id: '4', title: 'Ngôn Ngữ Anh', icon: 'alphabetical', color: '#9B59B6' },
     { id: '5', title: 'Quản Trị Kinh Doanh', icon: 'chart-pie', color: '#F1C40F' },
     { id: '6', title: 'Luật Kinh Tế', icon: 'scale-balance', color: '#E74C3C' }
  ];

  const [filteredMajors, setFilteredMajors] = useState([]);
  const [showMajorSuggestions, setShowMajorSuggestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleMajorChange = (text) => {
      setEditMajor(text);
      if (text.length > 0) {
          const filtered = gridData.filter(item => item.title.toLowerCase().includes(text.toLowerCase()));
          setFilteredMajors(filtered);
          setShowMajorSuggestions(filtered.length > 0);
      } else {
          setShowMajorSuggestions(false);
      }
  };

  const theme = isDarkMode ? Colors.dark : Colors.light;

  const saveProfile = () => {
    // Deep Validation: Blank check
    if(!editName.trim() || !editId.trim() || !editMajor.trim()){ 
      triggerHaptic('error');
      Alert.alert("Lỗi", "Vui lòng không bỏ trống thông tin!"); 
      return; 
    }

    // Deep Validation: Student ID format (9 digits)
    const idRegex = /^\d{9}$/;
    if (!idRegex.test(editId)) {
        triggerHaptic('warning');
        Alert.alert("Sai định dạng", "MSSV phải bao gồm đúng 9 chữ số!");
        return;
    }

    triggerHaptic('selection');
    setIsSaving(true);
    setTimeout(() => {
        updateProfileData({ ...profileData, name: editName, id: editId, major: editMajor });
        setIsSaving(false);
        setEditModalVisible(false);
        triggerHaptic('success');
        toastRef.current?.show("Cập nhật hồ sơ thành công!");
    }, 1500);
  };

  const navigateToFacultyRanking = (major) => {
    triggerHaptic();
    setFacultyFilter(major);
    navigation.navigate('Ranking');
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      <ScreenHeader 
        title="Hồ Sơ" 
        subtitle="Thông tin sinh viên LHU" 
        theme={theme} 
        isDarkMode={isDarkMode}
      />
      <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 40, paddingTop: 10}} showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <View style={styles.heroSection}>
           <View style={[styles.heroBg, {backgroundColor: '#5DA3FA'}]} />
           <Animated.View entering={ZoomIn.duration(800)} style={{zIndex: 10}}>
             <GlassCard isDarkMode={isDarkMode} style={styles.profileCard}>
                 <View style={styles.avatarWrapper}>
                     <Image source={{ uri: profileAvatar }} style={styles.avatar} />
                     <TouchableOpacity style={styles.cameraCircle}><Ionicons name="camera" size={18} color="#FFF" /></TouchableOpacity>
                 </View>
                 <Text style={[styles.profileName, {color: theme.text}]}>{profileData.name}</Text>
                 <Text style={[styles.profileId, {color: theme.subText}]}>ID: {profileData.id}</Text>
                 <TouchableOpacity style={[styles.editLink, {backgroundColor: Colors.primary + '15'}]} onPress={() => setEditModalVisible(true)}>
                     <Text style={{color: Colors.primary, fontWeight: 'bold', fontSize: 13}}>Chỉnh sửa hồ sơ</Text>
                 </TouchableOpacity>
             </GlassCard>
           </Animated.View>
        </View>

        {/* Academic Info */}
        <Animated.View entering={FadeInRight.delay(200)} style={styles.section}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>Thông Tin Học Tập</Text>
                <View style={[styles.academicInfo, {backgroundColor: theme.card}]}>
                    <InfoRow icon="school-outline" label="Trường" value={profileData.school} color="#4A90E2" theme={theme} isDark={isDarkMode} />
                    <InfoRow icon="people-outline" label="Khoa" value={profileData.major} color="#9B59B6" theme={theme} isDark={isDarkMode} />
                    <InfoRow icon="person-outline" label="Cố vấn" value={profileData.teacher} color="#E67E22" theme={theme} isDark={isDarkMode} />
                    <InfoRow icon="calendar-outline" label="Khóa học" value={profileData.year} color="#27AE60" theme={theme} isDark={isDarkMode} />
                    <InfoRow icon="location-outline" label="Cơ sở" value={profileData.address} color="#E74C3C" theme={theme} isDark={isDarkMode} />
                </View>
        </Animated.View>

        {/* Faculties Grid */}
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>Khám Phá Các Khoa</Text>
            <View style={styles.grid}>
                {gridData.map((item, idx) => (
                    <Animated.View key={item.id} entering={FadeInDown.delay(300 + idx * 100)} style={{width: '48%'}}>
                        <TouchableOpacity 
                            style={[
                                styles.gridItem, 
                                {
                                    backgroundColor: theme.card, 
                                    width: '100%',
                                    elevation: isDarkMode ? 2 : 5,
                                    shadowOpacity: isDarkMode ? 0.2 : 0.1,
                                    borderWidth: isDarkMode ? 0 : 1,
                                    borderColor: 'rgba(0,0,0,0.03)'
                                }
                            ]}
                            onPress={() => navigateToFacultyRanking(item.title)}
                        >
                            <View style={[styles.gridIcon, {backgroundColor: item.color + '15'}]}>
                                <MaterialCommunityIcons name={item.icon} size={28} color={item.color} />
                            </View>
                            <Text style={[styles.gridLabel, {color: theme.text, fontWeight: '700'}]} numberOfLines={1}>{item.title}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </View>

        <PremiumButton 
            title="Xem Bảng Điểm Chi Tiết" 
            onPress={() => setModalVisible(true)} 
            icon={<Ionicons name="stats-chart" size={20} color="#FFF" style={{marginRight: 10}} />}
            style={{marginHorizontal: 20, marginTop: 10}}
        />

        {/* Score Modal */}
        <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
                <GlassCard isDarkMode={isDarkMode} style={styles.modalContent}>
                    <Text style={[styles.modalTitle, {color: theme.text}]}>Kết Quả Học Tập</Text>
                    <DetailRow label="Điểm Trung Bình" value={profileData.avgPoint} color={Colors.success} />
                    <DetailRow label="Điểm Rèn Luyện" value={profileData.trainingPoint} color={Colors.primary} />
                    <DetailRow label="Xếp Loại" value={profileData.rank} color={Colors.warning} />
                    <PremiumButton title="Đóng" onPress={() => setModalVisible(false)} color={Colors.secondary} style={{marginTop: 10, width: '100%'}} />
                </GlassCard>
            </View>
        </Modal>

        {/* Edit Modal (Bottom Sheet) */}
        <Modal animationType="slide" transparent={true} visible={editModalVisible} onRequestClose={() => setEditModalVisible(false)}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.sheetOverlay}>
                <View style={[styles.sheetContent, {backgroundColor: theme.card}]}>
                    <View style={styles.sheetHeader}><View style={styles.sheetDrag} /><Text style={[styles.sheetTitle, {color: theme.text}]}>Thông Tin Cá Nhân</Text></View>
                    
                    <View style={{paddingHorizontal: 20}}>
                        <PremiumInput label="Họ và Tên" value={editName} onChangeText={setEditName} isDarkMode={isDarkMode} />
                        <PremiumInput label="MSSV" value={editId} onChangeText={setEditId} isDarkMode={isDarkMode} />
                        <View style={{zIndex: 1000}}>
                            <PremiumInput label="Khoa / Ngành" value={editMajor} onChangeText={handleMajorChange} isDarkMode={isDarkMode} />
                            {showMajorSuggestions && (
                                <View style={[styles.suggestionList, {backgroundColor: theme.card, borderColor: theme.border}]}>
                                    {filteredMajors.map((m, idx) => (
                                        <TouchableOpacity key={idx} style={styles.sugItem} onPress={() => { setEditMajor(m.title); setShowMajorSuggestions(false); }}>
                                            <Text style={{color: theme.text}}>{m.title}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={styles.sheetFooter}>
                        <PremiumButton title="Hủy" onPress={() => setEditModalVisible(false)} color="#EEE" style={{width: '45%'}} />
                        <PremiumButton title="Lưu" onPress={saveProfile} loading={isSaving} color={Colors.success} style={{width: '45%'}} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>

        <Toast ref={toastRef} />
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ icon, label, value, color, theme, isDark }) => (
    <View style={styles.infoRow}>
        <View style={[styles.infoIcon, {backgroundColor: color + '15'}]}>
            <Ionicons name={icon} size={22} color={color} />
        </View>
        <View style={{flex: 1}}>
            <Text style={[styles.infoLabel, {color: isDark ? theme.subText : '#64748B', fontWeight: '800'}]}>{label}</Text>
            <Text style={[styles.infoValue, {color: theme.text, fontWeight: '900'}]}>{value}</Text>
        </View>
    </View>
);

const DetailRow = ({ label, value, color }) => (
    <View style={styles.detailRow}>
        <Text style={{color: '#999', fontSize: 15}}>{label}</Text>
        <Text style={{color: color, fontSize: 18, fontWeight: 'bold'}}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    heroSection: { height: 280, alignItems: 'center', marginBottom: 20 },
    heroBg: { position: 'absolute', top: 0, width: '100%', height: 180, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
    profileCard: { width: width * 0.85, marginTop: 50, alignItems: 'center', elevation: 20 },
    avatarWrapper: { position: 'relative', marginTop: -10, marginBottom: 15 },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#FFF' },
    cameraCircle: { position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.primary, width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
    profileName: { fontSize: 20, fontWeight: 'bold' },
    profileId: { fontSize: 13, marginTop: 4 },
    editLink: { marginTop: 15, paddingHorizontal: 15, paddingVertical: 6, borderRadius: 12 },
    section: { paddingHorizontal: 20, marginBottom: 25 },
    sectionTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 15, marginLeft: 5 },
    infoCard: { borderRadius: 20, padding: 10, elevation: 4 },
    infoRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    rowIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    rowLabel: { fontSize: 12, color: '#999' },
    rowValue: { fontSize: 15, fontWeight: '600', marginTop: 2 },
    divider: { height: 1, marginHorizontal: 12 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    gridItem: { width: '48%', borderRadius: 18, padding: 15, alignItems: 'center', marginBottom: 15, elevation: 3 },
    gridIcon: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    gridLabel: { fontSize: 13, fontWeight: '500' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '85%', alignItems: 'center' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 25 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
    sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    sheetContent: { borderTopLeftRadius: 35, borderTopRightRadius: 35, paddingBottom: 40 },
    sheetHeader: { alignItems: 'center', paddingVertical: 15 },
    sheetDrag: { width: 40, height: 4, backgroundColor: '#DDD', borderRadius: 2, marginBottom: 15 },
    sheetTitle: { fontSize: 18, fontWeight: 'bold' },
    sheetFooter: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30 },
    suggestionList: { position: 'absolute', top: 85, width: '100%', borderRadius: 12, borderWidth: 1, elevation: 5, padding: 5, zIndex: 2000 },
    sugItem: { padding: 15, borderBottomWidth: 0.5, borderBottomColor: '#EEE' },
});

export default ProfileScreen;
