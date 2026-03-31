import React, { useContext } from 'react';
import { 
  View, Text, StyleSheet, Image, ScrollView, 
  TouchableOpacity, Dimensions, Platform, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/Theme';
import GlassCard from '../components/GlassCard';

const { width } = Dimensions.get('window');

const StudentDetailScreen = ({ route, navigation }) => {
  const { student } = route.params;
  const { isDarkMode, favorites, toggleFavorite, triggerHaptic } = useContext(AppContext);
  const theme = isDarkMode ? Colors.dark : Colors.light;
  
  const isFavorite = favorites.some(f => f.id === student.id || f.mssv === student.mssv);

  const InfoRow = ({ icon, label, value, delay = 0 }) => (
    <Animated.View entering={FadeInDown.delay(delay).duration(600)}>
      <View style={styles.infoCard}>
        <View style={[styles.iconBox, { backgroundColor: Colors.primary + '15' }]}>
            <Ionicons name={icon} size={20} color={Colors.primary} />
        </View>
        <View style={styles.textContainer}>
            <Text style={[styles.label, { color: theme.subText }]}>{label}</Text>
            <Text style={[styles.value, { color: theme.text }]}>{value || 'N/A'}</Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar barStyle="light-content" />
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <LinearGradient 
                    colors={[Colors.primary, Colors.accent]} 
                    style={styles.headerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                
                <View style={styles.navBar}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={28} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => { triggerHaptic(); toggleFavorite(student); }}
                        style={styles.favBtn}
                    >
                        <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color={isFavorite ? Colors.error : "#FFF"} />
                    </TouchableOpacity>
                </View>

                <Animated.View entering={ZoomIn.duration(800)} style={styles.avatarWrapper}>
                    <View style={styles.avatarGlow} />
                    <Image 
                        source={{ uri: `https://ui-avatars.com/api/?name=${student.name}&size=200&background=random` }} 
                        style={styles.avatar} 
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300)} style={styles.titleInfo}>
                    <Text style={styles.name}>{student.name}</Text>
                    <Text style={styles.dept}>{student.khoa || 'Khoa Công nghệ Thông tin'}</Text>
                </Animated.View>
            </View>

            <View style={styles.content}>
                <GlassCard intensity={30} isDarkMode={isDarkMode} style={styles.dashboardCard}>
                    <InfoRow icon="id-card-outline" label="Mã Số Sinh Viên" value={student.mssv || student.id} delay={400} />
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <InfoRow icon="school-outline" label="Lớp" value={student.lop || '21DTHA1'} delay={500} />
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <InfoRow icon="calendar-outline" label="Ngày sinh" value={student.ngaySinh || '24/06/2003'} delay={600} />
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <InfoRow icon="trophy-outline" label="Điểm trung bình" value={student.gpa || '3.85'} delay={700} />
                </GlassCard>
                
                <Animated.View entering={FadeInDown.delay(800)} style={styles.actionRow}>
                    <TouchableOpacity style={[styles.mainAction, { backgroundColor: Colors.primary }]}>
                        <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFF" />
                        <Text style={styles.actionText}>Liên hệ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.mainAction, { backgroundColor: Colors.secondary }]}>
                        <Ionicons name="document-text-outline" size={20} color="#FFF" />
                        <Text style={styles.actionText}>Học bạ</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { height: 300, alignItems: 'center', justifyContent: 'center' },
  headerGradient: { ...StyleSheet.absoluteFillObject, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
  navBar: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  favBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  avatarWrapper: { marginTop: 40, position: 'relative' },
  avatarGlow: { position: 'absolute', width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.3)', transform: [{ scale: 1.15 }] },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#FFF' },
  titleInfo: { alignItems: 'center', marginTop: 15 },
  name: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  dept: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginTop: 5 },
  content: { padding: 25, marginTop: -30 },
  dashboardCard: { padding: 20, borderRadius: 24, marginBottom: 15, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10 },
  divider: { height: 1, marginHorizontal: 15, opacity: 0.5 },
  infoCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  textContainer: { flex: 1 },
  label: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  value: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  mainAction: { flex: 0.48, height: 56, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  actionText: { color: '#FFF', fontWeight: '800', marginLeft: 10, fontSize: 15 }
});

export default StudentDetailScreen;
