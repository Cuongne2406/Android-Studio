import React, { useContext } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, 
  TouchableOpacity, Switch, Alert, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { toggleDarkMode } from '../store/slices/uiSlice';
import { clearHistory } from '../store/slices/historySlice';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/Theme';
import ScreenHeader from '../components/ScreenHeader';
import GlassCard from '../components/GlassCard';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector(state => state.ui);
  const { searchHistory } = useSelector(state => state.history);
  const { triggerHaptic } = useContext(AppContext);
  
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const handleClearHistory = () => {
    triggerHaptic('warning');
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn xóa tất cả lịch sử tìm kiếm?",
      [
        { text: "Bỏ qua", style: "cancel" },
        { text: "Xóa hết", onPress: () => { triggerHaptic('success'); dispatch(clearHistory()); }, style: "destructive" }
      ]
    );
  };

  const SettingItem = ({ icon, label, rightElement, onPress, color = Colors.primary, delay = 0 }) => (
    <Animated.View entering={FadeInDown.delay(delay).duration(600)}>
      <TouchableOpacity 
        onPress={onPress} 
        disabled={!onPress}
        activeOpacity={0.7}
      >
        <GlassCard intensity={15} isDarkMode={isDarkMode} style={styles.settingItem}>
          <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
            <Ionicons name={icon} size={22} color={color} />
          </View>
          <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
          {rightElement || <Ionicons name="chevron-forward" size={18} color={theme.subText} />}
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScreenHeader title="Cài Đặt" subtitle="Quản lý ứng dụng" theme={theme} isDarkMode={isDarkMode} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: theme.subText }]}>GIAO DIỆN & CẢM GIÁC</Text>
        <SettingItem 
          icon={isDarkMode ? "moon" : "sunny"} 
          label="Chế độ tối (Dark Mode)" 
          rightElement={
            <Switch 
                value={isDarkMode} 
                onValueChange={() => { triggerHaptic(); dispatch(toggleDarkMode()); }}
                trackColor={{ false: '#CBD5E1', true: Colors.primary + '80' }}
                thumbColor={isDarkMode ? Colors.primary : '#F1F5F9'}
            />
          }
          color={Colors.primary}
          delay={100}
        />

        <Text style={[styles.sectionTitle, { color: theme.subText, marginTop: 30 }]}>DỮ LIỆU CÁ NHÂN</Text>
        <SettingItem 
          icon="time-outline" 
          label="Xóa lịch sử tìm kiếm" 
          onPress={handleClearHistory}
          rightElement={
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{searchHistory.length}</Text>
            </View>
          }
          color={Colors.secondary}
          delay={200}
        />
        <SettingItem 
          icon="notifications-outline" 
          label="Thông báo" 
          delay={300}
        />

        <Text style={[styles.sectionTitle, { color: theme.subText, marginTop: 30 }]}>TÀI KHOẢN</Text>
        <SettingItem 
          icon="log-out-outline" 
          label="Đăng xuất" 
          onPress={() => { triggerHaptic('warning'); dispatch(logout()); }}
          color={Colors.error}
          delay={400}
        />

        <View style={styles.footer}>
            <Text style={[styles.version, { color: theme.subText }]}>Phiên bản 3.0.0 Premium</Text>
            <Text style={[styles.copyright, { color: theme.subText + '60' }]}>© 2026 Student Pro App UI/UX Design</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginBottom: 15, marginLeft: 5 },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 15, marginBottom: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  label: { flex: 1, fontSize: 16, fontWeight: '700' },
  badge: { backgroundColor: Colors.primary + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: Colors.primary, fontSize: 12, fontWeight: '800' },
  footer: { alignItems: 'center', marginTop: 50 },
  version: { fontSize: 14, fontWeight: '700' },
  copyright: { fontSize: 12, marginTop: 5, fontWeight: '600' }
});

export default SettingsScreen;
