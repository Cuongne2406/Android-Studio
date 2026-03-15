import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../theme/Theme';
import GlassCard from '../components/GlassCard';
import PremiumButton from '../components/PremiumButton';

const { width } = Dimensions.get('window');

const StudentDetailScreen = ({ route, navigation }) => {
  const { student, isDarkMode } = route.params;
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Chi Tiết Sinh Viên</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
            <View style={[styles.heroBg, {backgroundColor: student.type === 'point' ? Colors.primary : Colors.secondary}]} />
            <GlassCard isDarkMode={isDarkMode} style={styles.profileCard}>
                <View style={styles.avatarWrapper}>
                    <Image 
                        source={{ uri: `https://ui-avatars.com/api/?name=${student.name}&background=random&size=128` }} 
                        style={styles.avatar} 
                    />
                    <View style={[styles.badgeIcon, {backgroundColor: student.type === 'point' ? Colors.primary : Colors.secondary}]}>
                        <MaterialCommunityIcons name="trophy" size={16} color="#FFF" />
                    </View>
                </View>
                <Text style={[styles.name, {color: theme.text}]}>{student.name}</Text>
                <Text style={styles.id}>MSSV: {student.mssv || student.id}</Text>
            </GlassCard>
        </View>

        <View style={styles.statsRow}>
            <GlassCard isDarkMode={isDarkMode} style={styles.statCard}>
                <Text style={styles.statLabel}>Hạng</Text>
                <Text style={[styles.statValue, {color: Colors.warning}]}>#{student.rank || 'N/A'}</Text>
            </GlassCard>
            <GlassCard isDarkMode={isDarkMode} style={styles.statCard}>
                <Text style={styles.statLabel}>{student.type === 'point' ? 'Điểm GPA' : 'Điểm ĐRL'}</Text>
                <Text style={[styles.statValue, {color: Colors.success}]}>{student.avgPoint || student.avgTrainingPoint}</Text>
            </GlassCard>
        </View>

        <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>Thành tích & Hoạt động</Text>
            <GlassCard isDarkMode={isDarkMode} style={styles.infoCard}>
                <ActivityRow icon="medal-outline" text="Sinh viên tiêu biểu học kỳ 1" color={Colors.warning} theme={theme} />
                <View style={[styles.divider, {backgroundColor: theme.border}]} />
                <ActivityRow icon="trophy-outline" text="Giải thưởng nghiên cứu khoa học" color={Colors.primary} theme={theme} />
                <View style={[styles.divider, {backgroundColor: theme.border}]} />
                <ActivityRow icon="star-outline" text="Đoàn viên tích cực" color={Colors.success} theme={theme} />
            </GlassCard>
        </View>

        <PremiumButton 
            title="Gửi lời chúc mừng" 
            onPress={() => alert('Đã gửi lời chúc mừng!')}
            style={{marginTop: 10}}
        />
      </ScrollView>
    </View>
  );
};

const ActivityRow = ({ icon, text, color, theme }) => (
    <View style={styles.activityRow}>
        <Ionicons name={icon} size={20} color={color} />
        <Text style={[styles.activityText, {color: theme.text}]}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 4 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, paddingBottom: 40 },
  heroSection: { height: 260, alignItems: 'center', marginBottom: 20 },
  heroBg: { position: 'absolute', top: 0, width: '110%', height: 160, borderBottomLeftRadius: 100, borderBottomRightRadius: 100 },
  profileCard: { width: '100%', marginTop: 40, alignItems: 'center', paddingVertical: 25 },
  avatarWrapper: { position: 'relative', marginBottom: 15 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#FFF' },
  badgeIcon: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  name: { fontSize: 22, fontWeight: 'bold' },
  id: { color: '#999', marginTop: 5 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { width: '47%', alignItems: 'center', paddingVertical: 20 },
  statLabel: { fontSize: 13, color: '#999', marginBottom: 5 },
  statValue: { fontSize: 28, fontWeight: '900' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginLeft: 5 },
  infoCard: { padding: 10 },
  activityRow: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  activityText: { marginLeft: 15, fontSize: 15, fontWeight: '500' },
  divider: { height: 1, marginHorizontal: 15 },
});

export default StudentDetailScreen;
