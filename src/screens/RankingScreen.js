import React, { useState, useContext } from 'react';
import { 
  View, Text, SectionList, RefreshControl, 
  Modal, Pressable, StyleSheet, StatusBar, Dimensions,
  ActivityIndicator, Alert, TouchableOpacity
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/Theme';
import GlassCard from '../components/GlassCard';
import PremiumButton from '../components/PremiumButton';
import PremiumInput from '../components/PremiumInput';
import { top100StudentsByAvgPoint, top10StudentsByAvgTrainingPoint } from '../../studentStatistics';

const { width } = Dimensions.get('window');

const RankingScreen = () => {
  const { studentsData, setStudentsData, isDarkMode } = useContext(AppContext);
  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [refreshing, setRefreshing] = useState(false); 
  const [searchText, setSearchText] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  const filterStudents = () => {
    if(!searchText.trim()) {
        setStudentsData({ point: top100StudentsByAvgPoint, training: top10StudentsByAvgTrainingPoint });
        return;
    }
    setIsFiltering(true);
    setTimeout(() => {
        const lowerSearch = searchText.toLowerCase();
        const filteredPoints = top100StudentsByAvgPoint.filter(s => s.name.toLowerCase().includes(lowerSearch));
        const filteredTraining = top10StudentsByAvgTrainingPoint.filter(s => s.name.toLowerCase().includes(lowerSearch));
        setStudentsData({ point: filteredPoints, training: filteredTraining });
        setIsFiltering(false);
    }, 800);
  };

  const rankingData = [
    { title: 'Bảng Vàng Học Tập', icon: 'school', iconColor: '#4A90E2', data: studentsData.point, type: 'point' },
    { title: 'Ngôi Sao Rèn Luyện', icon: 'star-circle', iconColor: '#FF6B6B', data: studentsData.training, type: 'training' }
  ];

  const onRefresh = () => {
     setRefreshing(true);
     setTimeout(() => {
         setStudentsData({ point: top100StudentsByAvgPoint, training: top10StudentsByAvgTrainingPoint });
         setRefreshing(false);
     }, 1500);
  };

  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, {backgroundColor: theme.card}]}>
        <View style={{flex: 1}}>
            <Text style={[styles.headerTitle, {color: theme.text}]}>Xếp Hạng</Text>
            <Text style={[styles.headerSubtitle, {color: theme.subText}]}>Học Kỳ 1 - 2024</Text>
        </View>
        <TouchableOpacity 
            style={[styles.filterToggle, {backgroundColor: Colors.primary + '15'}]}
            onPress={() => setSearchText('')}
        >
            <Ionicons name="refresh-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
          <PremiumInput 
            placeholder="Tìm tên sinh viên..."
            icon="search-outline"
            value={searchText}
            onChangeText={setSearchText}
            isDarkMode={isDarkMode}
            containerStyle={{marginBottom: 0, flex: 1}}
          />
          <TouchableOpacity 
            style={[styles.searchBtn, {backgroundColor: Colors.primary}]} 
            onPress={filterStudents}
            disabled={isFiltering}
          >
            {isFiltering ? <ActivityIndicator color="#FFF" size="small" /> : <Ionicons name="filter" size={20} color="#FFF" />}
          </TouchableOpacity>
      </View>

      <SectionList
        sections={rankingData}
        keyExtractor={(item, index) => (item.id || item.mssv) + index}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} /> }
        renderSectionHeader={({ section: { title, icon, iconColor } }) => (
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, {backgroundColor: iconColor}]}>
                <MaterialCommunityIcons name={icon} size={18} color="#FFF" />
            </View>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>{title}</Text>
          </View>
        )}
        renderItem={({ item, index, section }) => ( 
          <StudentItem isDark={isDarkMode} index={index} student={item} type={section.type} onPress={setSelectedStudent} theme={theme} /> 
        )}
        ListFooterComponent={<View style={{ height: 40 }} />}
      />

      <Modal visible={selectedStudent !== null} animationType="fade" transparent={true}>
          <View style={styles.modalOverlay}>
              <GlassCard isDarkMode={isDarkMode} style={styles.modalCard}>
                 {selectedStudent && (
                     <>
                        <View style={[styles.modalHeader, {backgroundColor: selectedStudent.type === 'point' ? Colors.primary : Colors.secondary}]}>
                            <MaterialCommunityIcons name="trophy-variant" size={40} color="#FFF" />
                        </View>
                        <Text style={[styles.modalName, {color: theme.text}]}>{selectedStudent.name}</Text>
                        <Text style={styles.modalId}>MSSV: {selectedStudent.mssv || selectedStudent.id}</Text>
                        <View style={[styles.modalDivider, {backgroundColor: theme.border}]} />
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Hạng</Text>
                                <Text style={[styles.statVal, {color: Colors.warning}]}>#{rankingData.find(s => s.type === selectedStudent.type).data.indexOf(selectedStudent) + 1}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>{selectedStudent.type === 'point' ? 'Điểm TB' : 'ĐRL'}</Text>
                                <Text style={[styles.statVal, {color: Colors.success}]}>{selectedStudent.avgPoint || selectedStudent.avgTrainingPoint}</Text>
                            </View>
                        </View>
                        <PremiumButton title="Đóng" onPress={() => setSelectedStudent(null)} style={{width: '100%', marginTop: 20}} />
                     </>
                 )}
              </GlassCard>
          </View>
      </Modal>
    </View>
  );
}

const StudentItem = ({ index, student, type, onPress, theme, isDark }) => {
  const getRankStyle = (idx) => {
    if (idx === 0) return { bg: '#FFD700', size: 34, font: 16 };
    if (idx === 1) return { bg: '#C0C0C0', size: 30, font: 14 };
    if (idx === 2) return { bg: '#CD7F32', size: 30, font: 14 };
    return { bg: isDark ? '#4A4A4A' : '#EEE', size: 28, font: 12 };
  };
  const rs = getRankStyle(index);

  return (
    <Pressable style={({ pressed }) => [ styles.card, { backgroundColor: theme.card, transform: [{scale: pressed ? 0.98 : 1}] }]} onPress={() => onPress(student)}>
      <View style={[styles.rankBox, { width: rs.size, height: rs.size, borderRadius: rs.size/2, backgroundColor: rs.bg }]}>
        <Text style={[styles.rankText, { fontSize: rs.font, color: index < 3 ? '#FFF' : theme.subText }]}>{index + 1}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, {color: theme.text}]}>{student.name}</Text>
        <Text style={styles.id}>ID: {student.mssv || student.id}</Text>
      </View>
      <View style={styles.scoreContainer}>
         <Text style={[styles.score, {color: type === 'point' ? Colors.primary : Colors.secondary}]}>{student.avgPoint || student.avgTrainingPoint}</Text>
         <Text style={styles.scoreType}>{type === 'point' ? 'GPA' : 'ĐRL'}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 25, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 4 },
    headerTitle: { fontSize: 26, fontWeight: '900', letterSpacing: 0.5 },
    headerSubtitle: { fontSize: 13, marginTop: 2, fontWeight: '500' },
    filterToggle: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    filterContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 15, gap: 10 },
    searchBtn: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', elevation: 2 },
    badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    listContainer: { paddingHorizontal: 20, paddingTop: 0 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 15, marginLeft: 5 },
    sectionIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    sectionTitle: { fontSize: 17, fontWeight: 'bold' },
    card: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 20, marginBottom: 12, elevation: 2 },
    rankBox: { justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    rankText: { fontWeight: 'bold' },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: 'bold' },
    id: { fontSize: 12, color: '#999', marginTop: 2 },
    scoreContainer: { alignItems: 'flex-end' },
    score: { fontSize: 18, fontWeight: '900' },
    scoreType: { fontSize: 10, color: '#999', fontWeight: 'bold' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    modalCard: { width: '85%', alignItems: 'center', paddingTop: 40 },
    modalHeader: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: -35, elevation: 5 },
    modalName: { fontSize: 22, fontWeight: 'bold' },
    modalId: { color: '#999', marginTop: 5 },
    modalDivider: { height: 1, width: '100%', marginVertical: 25 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
    statItem: { alignItems: 'center' },
    statLabel: { color: '#999', fontSize: 13, marginBottom: 5 },
    statVal: { fontSize: 24, fontWeight: '900' },
});

export default RankingScreen;
