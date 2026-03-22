import React, { useState, useContext } from 'react';
import { 
  View, Text, Image, ScrollView, TouchableOpacity, 
  TextInput, Modal, Pressable, Platform, 
  ActivityIndicator, KeyboardAvoidingView, StyleSheet, Alert, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
           <LinearGradient 
             colors={isDarkMode ? ['#1E293B', '#0F172A'] : [Colors.primary, Colors.accent]} 
             style={styles.heroBg} 
             start={{ x: 0, y: 0 }}
             end={{ x: 1, y: 1 }}
           />
           <Animated.View entering={ZoomIn.duration(800)} style={{zIndex: 10, width: '100%', alignItems: 'center'}}>
             <GlassCard intensity={40} isDarkMode={isDarkMode} style={styles.profileCard}>
                 <View style={styles.avatarWrapper}>
                     <View style={[styles.avatarGlow, {backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.4)'}]}>
                        <Image source={{ uri: profileAvatar }} style={styles.avatar} />
                     </View>
                     <TouchableOpacity style={styles.cameraCircle}><Ionicons name="camera" size={18} color="#FFF" /></TouchableOpacity>
                 </View>
                 <Text style={[styles.profileName, {color: theme.text}]}>{profileData.name}</Text>
                 <Text style={[styles.profileId, {color: theme.subText}]}>MSSV: {profileData.id}</Text>
                 <TouchableOpacity style={[styles.editLink, {backgroundColor: Colors.primary + '20'}]} onPress={() => setEditModalVisible(true)}>
                     <Text style={{color: isDarkMode ? '#818CF8' : Colors.primary, fontWeight: 'bold', fontSize: 13}}>Chỉnh sửa hồ sơ</Text>
                 </TouchableOpacity>
             </GlassCard>
           </Animated.View>
        </View>

        {/* Academic Info */}
        <Animated.View entering={FadeInRight.delay(200).duration(800)} style={styles.section}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>Thông Tin Học Tập</Text>
            <GlassCard intensity={15} isDarkMode={isDarkMode} style={styles.academicInfoGlass}>
                <InfoRow icon="school" label="Trường" value={profileData.school} color={Colors.primary} theme={theme} isDark={isDarkMode} />
                <View style={[styles.miniDivider, {backgroundColor: theme.border}]} />
                <InfoRow icon="business" label="Khoa" value={profileData.major} color={Colors.accent} theme={theme} isDark={isDarkMode} />
                <View style={[styles.miniDivider, {backgroundColor: theme.border}]} />
                <InfoRow icon="person" label="Cố vấn" value={profileData.teacher} color={Colors.warning} theme={theme} isDark={isDarkMode} />
                <View style={[styles.miniDivider, {backgroundColor: theme.border}]} />
                <InfoRow icon="calendar" label="Khóa học" value={profileData.year} color={Colors.success} theme={theme} isDark={isDarkMode} />
            </GlassCard>
        </Animated.View>

        {/* Faculties Grid */}
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>Khám Phá Các Khoa</Text>
            <View style={styles.grid}>
                {gridData.map((item, idx) => (
                    <Animated.View key={item.id} entering={FadeInDown.delay(300 + idx * 80)} style={{width: '48%'}}>
                        <TouchableOpacity onPress={() => navigateToFacultyRanking(item.title)} activeOpacity={0.7}>
                            <GlassCard 
                                intensity={10}
                                isDarkMode={isDarkMode} 
                                style={styles.gridItemGlass}
                            >
                                <LinearGradient
                                    colors={[item.color + '30', item.color + '10']}
                                    style={styles.gridIcon}
                                >
                                    <MaterialCommunityIcons name={item.icon} size={26} color={item.color} />
                                </LinearGradient>
                                <Text style={[styles.gridLabel, {color: theme.text}]} numberOfLines={1}>{item.title}</Text>
                            </GlassCard>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </View>

        <PremiumButton 
            title="Xem Bảng Điểm Chi Tiết" 
            onPress={() => setModalVisible(true)} 
            icon={<Ionicons name="stats-chart" size={20} color="#FFF" style={{marginRight: 10}} />}
            style={{marginHorizontal: 20, marginTop: 10, height: 55, borderRadius: 18}}
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
    heroSection: { height: 320, alignItems: 'center', marginBottom: 20 },
    heroBg: { position: 'absolute', top: 0, width: '100%', height: 200, borderBottomLeftRadius: 60, borderBottomRightRadius: 60 },
    profileCard: { width: width * 0.9, marginTop: 60, alignItems: 'center', paddingVertical: 30 },
    avatarWrapper: { position: 'relative', marginTop: -15, marginBottom: 15 },
    avatarGlow: { padding: 4, borderRadius: 55, elevation: 10, shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 15 },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#FFF' },
    cameraCircle: { position: 'absolute', bottom: 5, right: 5, backgroundColor: Colors.primary, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
    profileName: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
    profileId: { fontSize: 13, marginTop: 4, fontWeight: '600', opacity: 0.7 },
    editLink: { marginTop: 20, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 14 },
    section: { paddingHorizontal: 20, marginBottom: 30 },
    sectionTitle: { fontSize: 18, fontWeight: '900', marginBottom: 15, marginLeft: 5, letterSpacing: -0.5 },
    academicInfoGlass: { padding: 5, borderRadius: 24 },
    infoRow: { flexDirection: 'row', alignItems: 'center', padding: 15 },
    infoIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    infoLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
    infoValue: { fontSize: 15 },
    miniDivider: { height: 1.5, marginHorizontal: 20, opacity: 0.5 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    gridItemGlass: { width: '100%', borderRadius: 24, padding: 20, alignItems: 'center', marginBottom: 15 },
    gridIcon: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    gridLabel: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.8)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '85%', alignItems: 'center', padding: 30 },
    modalTitle: { fontSize: 22, fontWeight: '900', marginBottom: 30 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
    sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    sheetContent: { borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingBottom: 40, elevation: 20 },
    sheetHeader: { alignItems: 'center', paddingVertical: 20 },
    sheetDrag: { width: 45, height: 5, backgroundColor: '#CBD5E1', borderRadius: 3, marginBottom: 15 },
    sheetTitle: { fontSize: 20, fontWeight: '900' },
    sheetFooter: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 35 },
    suggestionList: { position: 'absolute', top: 90, width: '100%', borderRadius: 16, borderWidth: 1, elevation: 15, padding: 5, zIndex: 2000 },
    sugItem: { padding: 15, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.05)' },
});

export default ProfileScreen;
