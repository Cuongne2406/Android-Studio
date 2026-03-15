import React, { useState, useContext } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  Alert, StyleSheet, Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/Theme';
import GlassCard from '../components/GlassCard';
import PremiumInput from '../components/PremiumInput';
import PremiumButton from '../components/PremiumButton';

const { width } = Dimensions.get('window');

const SettingsScreen = () => {
  const { isDarkMode, toggleDarkMode, setStudentsData, logoutApp, profileData } = useContext(AppContext);
  const [isFiltering, setIsFiltering] = useState(false);

  const theme = isDarkMode ? Colors.dark : Colors.light;

  const handleLogout = () => {
      Alert.alert(
          "Đăng xuất",
          "Bạn có chắc chắn muốn thoát khỏi hệ thống?",
          [
              { text: "Hủy", style: "cancel" },
              { text: "Đăng xuất", onPress: logoutApp, style: "destructive" }
          ]
      );
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Header */}
        <View style={[styles.header, {backgroundColor: theme.card}]}>
            <Text style={[styles.headerTitle, {color: theme.text}]}>Cấu Hình</Text>
            <View style={styles.userInfo}>
                <Ionicons name="settings-outline" size={24} color={Colors.primary} />
            </View>
        </View>

        <View style={styles.container}>
            {/* Appearance Section */}
            <Text style={[styles.sectionTitle, {color: theme.subText}]}>GIAO DIỆN</Text>
            <GlassCard isDarkMode={isDarkMode} style={styles.settingCard}>
                <TouchableOpacity style={styles.settingRow} onPress={() => toggleDarkMode(false)}>
                    <View style={styles.rowLeft}>
                        <View style={[styles.iconBox, {backgroundColor: '#FFBE76'}]}><Ionicons name="sunny" size={20} color="#FFF" /></View>
                        <Text style={[styles.rowText, {color: theme.text}]}>Chế độ sáng</Text>
                    </View>
                    <Ionicons name={!isDarkMode ? "radio-button-on" : "radio-button-off"} size={22} color={Colors.primary} />
                </TouchableOpacity>
                <View style={[styles.divider, {backgroundColor: theme.border}]} />
                <TouchableOpacity style={styles.settingRow} onPress={() => toggleDarkMode(true)}>
                    <View style={styles.rowLeft}>
                        <View style={[styles.iconBox, {backgroundColor: '#30336B'}]}><Ionicons name="moon" size={20} color="#FFF" /></View>
                        <Text style={[styles.rowText, {color: theme.text}]}>Chế độ tối</Text>
                    </View>
                    <Ionicons name={isDarkMode ? "radio-button-on" : "radio-button-off"} size={22} color={Colors.primary} />
                </TouchableOpacity>
            </GlassCard>


            {/* Account Section */}
            <Text style={[styles.sectionTitle, {color: theme.subText, marginTop: 30}]}>HỆ THỐNG</Text>
            <GlassCard isDarkMode={isDarkMode} style={styles.settingCard}>
                <TouchableOpacity style={styles.settingRow}>
                    <View style={styles.rowLeft}>
                        <View style={[styles.iconBox, {backgroundColor: '#686DE0'}]}><Ionicons name="shield-checkmark" size={20} color="#FFF" /></View>
                        <Text style={[styles.rowText, {color: theme.text}]}>Bảo mật tài khoản</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.subText} />
                </TouchableOpacity>
                <View style={[styles.divider, {backgroundColor: theme.border}]} />
                <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
                    <View style={styles.rowLeft}>
                        <View style={[styles.iconBox, {backgroundColor: Colors.danger}]}><Ionicons name="log-out" size={20} color="#FFF" /></View>
                        <Text style={[styles.rowText, {color: Colors.danger, fontWeight: 'bold'}]}>Đăng xuất</Text>
                    </View>
                </TouchableOpacity>
            </GlassCard>
            
            <Text style={styles.version}>Phiên bản Pro 2.0.0 • Made with ❤️ for LHU</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    header: { padding: 25, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 4 },
    headerTitle: { fontSize: 26, fontWeight: '900' },
    sectionTitle: { fontSize: 12, fontWeight: '900', marginLeft: 10, marginBottom: 15, letterSpacing: 1.5 },
    settingCard: { padding: 10, elevation: 8 },
    settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 },
    rowLeft: { flexDirection: 'row', alignItems: 'center' },
    iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    rowText: { fontSize: 16, fontWeight: '500' },
    divider: { height: 1, marginVertical: 4 },
    version: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 12 },
});

export default SettingsScreen;
