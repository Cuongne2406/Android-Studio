import React, { useState, useContext, useMemo } from 'react';
import { 
  View, Text, SectionList, StyleSheet, Image, 
  TouchableOpacity, TextInput, Platform, StatusBar, Dimensions,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, ZoomIn, Layout } from 'react-native-reanimated';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStudents } from '../store/slices/studentSlice';
import { setFacultyFocus } from '../store/slices/uiSlice';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/Theme';
import ScreenHeader from '../components/ScreenHeader';
import GlassCard from '../components/GlassCard';
// Removed static import for real API integration

const { width } = Dimensions.get('window');

const RankingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { studentByPoint, studentByTraining, loading } = useSelector(state => state.students);
  const { isDarkMode, facultyFocus } = useSelector(state => state.ui);
  const { addSearchHistory, triggerHaptic } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    if (studentByPoint.length === 0) {
      dispatch(fetchStudents());
    }
  }, []);
  
  const theme = isDarkMode ? Colors.dark : Colors.light;

  // Restore faculty filtering logic
  const displayData = useMemo(() => {
    if (!studentByPoint || !studentByTraining) return [];
    
    const filterFn = s => {
        const lowerSearch = searchQuery.toLowerCase();
        const matchesSearch = s.name.toLowerCase().includes(lowerSearch) || 
                             (s.mssv && s.mssv.toString().includes(searchQuery)) ||
                             (s.id && s.id.toString().includes(searchQuery));
        
        if (!facultyFocus) return matchesSearch;
        
        const studentKhoa = s.khoa || (s.type === 'point' ? 'Khoa Công nghệ Thông tin' : 'Khoa Quản trị Kinh doanh');
        return matchesSearch && studentKhoa.toLowerCase().includes(facultyFocus.toLowerCase());
    };

    return [
      { title: 'Bảng Vàng Học Tập', icon: 'school', iconColor: Colors.primary, data: studentByPoint.filter(filterFn), type: 'point' },
      { title: 'Ngôi Sao Rèn Luyện', icon: 'star-circle', iconColor: Colors.secondary, data: studentByTraining.filter(filterFn), type: 'training' }
    ];
  }, [searchQuery, facultyFocus, studentByPoint, studentByTraining]);

  const handleStudentPress = (student, index, type) => {
    triggerHaptic('selection');
    if (searchQuery) {
        addSearchHistory(searchQuery);
    }
    navigation.navigate('RankingDetail', { 
        student: { ...student, rank: index + 1, type },
        isDarkMode 
    });
  };

  const renderPodium = (data, type) => {
    if (!data || data.length < 3) return null;
    const top3 = data.slice(0, 3);
    const ordered = [top3[1], top3[0], top3[2]];

    return (
      <View style={styles.podiumContainer}>
        {ordered.map((student, idx) => {
          const rank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
          const isWinner = rank === 1;
          const delay = rank === 1 ? 200 : rank === 2 ? 400 : 600;
          const avatarSize = isWinner ? 90 : 70;
          
          return (
            <Animated.View key={idx} entering={ZoomIn.delay(delay).duration(800)} style={[styles.podiumItem, isWinner && { marginBottom: 25 }]}>
                <TouchableOpacity onPress={() => handleStudentPress(student, rank - 1, type)} style={{alignItems: 'center'}}>
                    <View style={styles.podiumAvatarBox}>
                        {isWinner && (
                            <Animated.View entering={FadeInDown.delay(delay + 400)} style={styles.crown}>
                                <MaterialCommunityIcons name="crown" size={26} color="#F59E0B" />
                            </Animated.View>
                        )}
                        <View style={[styles.avatarGlow, { borderColor: isWinner ? '#F59E0B' : 'rgba(255,255,255,0.2)' }]}>
                            <Image 
                                source={{ uri: `https://ui-avatars.com/api/?name=${student.name}&background=random` }} 
                                style={[styles.podiumAvatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize/2 }]} 
                            />
                        </View>
                        <LinearGradient 
                            colors={isWinner ? ['#F59E0B', '#B45309'] : ['#6366F1', '#4338CA']} 
                            style={styles.rankBadge}
                        >
                            <Text style={styles.rankBadgeText}>{rank}</Text>
                        </LinearGradient>
                    </View>
                    <Text style={[styles.podiumName, { color: theme.text }]} numberOfLines={1}>{student.name.split(' ').pop()}</Text>
                    <GlassCard intensity={30} isDarkMode={isDarkMode} style={styles.podiumScoreCard}>
                        <Text style={styles.podiumScore}>{student.avgPoint || student.avgTrainingPoint}</Text>
                    </GlassCard>
                </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScreenHeader title="Xếp Hạng" subtitle="Kỳ 1 - Năm học 2024" theme={theme} isDarkMode={isDarkMode} />
      
      <View style={styles.filterSection}>
          <GlassCard intensity={25} isDarkMode={isDarkMode} style={styles.searchBar}>
              <Ionicons name="search" size={20} color={theme.subText} style={{ marginRight: 10 }} />
              <TextInput 
                  placeholder="Tìm tên hoặc MSSV..."
                  placeholderTextColor={theme.subText}
                  style={[styles.searchInput, { color: theme.text }]}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <Ionicons name="close-circle" size={20} color={theme.subText} />
                  </TouchableOpacity>
              ) : null}
          </GlassCard>
      </View>

      <SectionList
        sections={displayData}
        keyExtractor={(item, index) => (item._id || item.id || item.mssv || index).toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section }) => (
          <View>
            <Animated.View entering={FadeInRight.duration(800)} style={styles.sectionHeader}>
              <LinearGradient colors={[section.iconColor, section.iconColor + '90']} style={styles.sectionIcon}>
                  <MaterialCommunityIcons name={section.icon} size={20} color="#FFF" />
              </LinearGradient>
              <Text style={[styles.sectionTitle, {color: theme.text}]}>{section.title}</Text>
            </Animated.View>
            {!searchQuery && renderPodium(section.data, section.type)}
          </View>
        )}
        renderItem={({ item, index, section }) => {
          if (!searchQuery && index < 3) return null;
          return (
            <Animated.View entering={FadeInDown.delay(index * 50).duration(600)}>
                <TouchableOpacity onPress={() => handleStudentPress(item, index, section.type)} activeOpacity={0.7}>
                    <GlassCard intensity={10} isDarkMode={isDarkMode} style={styles.itemCard}>
                        <View style={styles.itemRankBox}>
                            <Text style={styles.itemRankText}>{index + 1}</Text>
                        </View>
                        <Image source={{ uri: `https://ui-avatars.com/api/?name=${item.name}&background=random` }} style={styles.itemAvatar} />
                        <View style={styles.itemInfo}>
                            <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
                            <Text style={[styles.itemId, { color: theme.subText }]}>{item.mssv || item.id || 'N/A'}</Text>
                        </View>
                        <View style={styles.itemScoreBox}>
                            <Text style={[styles.itemScore, { color: section.type === 'point' ? Colors.primary : Colors.secondary }]}>
                                {item.avgPoint || item.avgTrainingPoint}
                            </Text>
                            <Text style={styles.itemScoreLabel}>{section.type === 'point' ? 'GPA' : 'ĐRL'}</Text>
                        </View>
                    </GlassCard>
                </TouchableOpacity>
            </Animated.View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    filterSection: { padding: 20 },
    searchBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 20 },
    searchInput: { flex: 1, fontSize: 15, fontWeight: '600' },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, marginTop: 25, marginBottom: 15 },
    sectionIcon: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    sectionTitle: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
    podiumContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', height: 240, marginBottom: 20 },
    podiumItem: { alignItems: 'center', width: '30%' },
    podiumAvatarBox: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
    avatarGlow: { padding: 4, borderRadius: 100, borderWidth: 2 },
    podiumAvatar: { borderWidth: 3, borderColor: '#FFF' },
    crown: { position: 'absolute', top: -30, zIndex: 10 },
    rankBadge: { position: 'absolute', bottom: -5, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF', zIndex: 20 },
    rankBadgeText: { color: '#FFF', fontSize: 14, fontWeight: '900' },
    podiumName: { marginTop: 15, fontSize: 14, fontWeight: '800', textAlign: 'center' },
    podiumScoreCard: { marginTop: 8, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 10 },
    podiumScore: { color: Colors.primary, fontWeight: '900', fontSize: 14 },
    itemCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 10, padding: 12 },
    itemRankBox: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(99, 102, 241, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    itemRankText: { color: Colors.primary, fontWeight: '900', fontSize: 14 },
    itemAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 15 },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 16, fontWeight: '800' },
    itemId: { fontSize: 11, fontWeight: '600', marginTop: 2, opacity: 0.7 },
    itemScoreBox: { alignItems: 'flex-end' },
    itemScore: { fontSize: 18, fontWeight: '900' },
    itemScoreLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '800' },
});

export default RankingScreen;
