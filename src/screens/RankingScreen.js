import React, { useState, useContext } from 'react';
import { 
  View, Text, SectionList, RefreshControl, 
  Modal, Pressable, StyleSheet, StatusBar, Dimensions,
  ActivityIndicator, Alert, TouchableOpacity, Image
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  Layout, 
  ZoomIn 
} from 'react-native-reanimated';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/Theme';
import ScreenHeader from '../components/ScreenHeader';
import PremiumInput from '../components/PremiumInput';
import { top100StudentsByAvgPoint, top10StudentsByAvgTrainingPoint } from '../../studentStatistics';

const { width } = Dimensions.get('window');

const RankingScreen = ({ navigation }) => {
  const { 
    studentsData, setStudentsData, isDarkMode, 
    facultyFilter, setFacultyFilter, triggerHaptic 
  } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false); 
  const [searchText, setSearchText] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  // Cross-screen integration effect
  React.useEffect(() => {
    if (facultyFilter) {
      setSearchText(facultyFilter);
      // Trigger filtering logic automatically
      const lowerSearch = facultyFilter.toLowerCase();
      const filteredPoints = top100StudentsByAvgPoint.filter(s => s.name.toLowerCase().includes(lowerSearch));
      const filteredTraining = top10StudentsByAvgTrainingPoint.filter(s => s.name.toLowerCase().includes(lowerSearch));
      setStudentsData({ point: filteredPoints, training: filteredTraining });
      
      // Clear filter after applying
      setFacultyFilter(null);
    }
  }, [facultyFilter]);

  const handleStudentPress = (student, index, type) => {
    navigation.navigate('RankingDetail', { 
        student: { ...student, rank: index + 1, type },
        isDarkMode 
    });
  };

  const filterStudents = () => {
    triggerHaptic('selection');
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
        triggerHaptic('success');
    }, 800);
  };

  const theme = isDarkMode ? Colors.dark : Colors.light;

  const renderPodium = (data, type) => {
    if (!data || data.length < 3) return null;
    const top3 = data.slice(0, 3);
    // [2nd, 1st, 3rd] layout for podium
    const ordered = [top3[1], top3[0], top3[2]];

    return (
      <View style={styles.podiumContainer}>
        {ordered.map((student, idx) => {
          const isWinner = idx === 1;
          const rank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
          const colors = rank === 1 ? ['#FFD700', '#FFA500'] : rank === 2 ? ['#C0C0C0', '#808080'] : ['#CD7F32', '#8B4513'];
          
          return (
            <Animated.View 
              key={student.id || student.mssv} 
              entering={ZoomIn.delay(idx * 200)}
              style={[styles.podiumItem, isWinner && styles.winnerItem]}
            >
              <TouchableOpacity onPress={() => handleStudentPress(student, rank - 1, type)}>
                <View style={styles.avatarContainer}>
                  <LinearGradient colors={colors} style={styles.crown}>
                    <MaterialCommunityIcons name={rank === 1 ? "crown" : "medal"} size={16} color="#FFF" />
                  </LinearGradient>
                  <Image source={{ uri: `https://ui-avatars.com/api/?name=${student.name}&background=random` }} style={[styles.podiumAvatar, isWinner && styles.winnerAvatar, { borderColor: colors[0] }]} />
                </View>
                <Text style={[styles.podiumName, { color: theme.text, fontWeight: '800' }]} numberOfLines={1}>{student.name.split(' ').pop()}</Text>
                <Text style={[styles.podiumScore, { color: rank === 1 ? (isDarkMode ? '#FFD700' : '#D4AF37') : (isDarkMode ? '#AAA' : '#444') }]}>
                  {student.avgPoint || student.avgTrainingPoint}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    );
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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader 
        title="Xếp Hạng" 
        subtitle="Học Kỳ 1 - 2024" 
        theme={theme} 
        isDarkMode={isDarkMode}
        rightElement={
            <TouchableOpacity 
                style={[styles.filterToggle, {backgroundColor: Colors.primary + '15'}]}
                onPress={() => { triggerHaptic(); setSearchText(''); setStudentsData({ point: top100StudentsByAvgPoint, training: top10StudentsByAvgTrainingPoint }); }}
            >
                <Ionicons name="refresh-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
        }
      />

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
        renderSectionHeader={({ section }) => (
          <View>
            <Animated.View entering={FadeInRight} style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, {backgroundColor: section.iconColor}]}>
                  <MaterialCommunityIcons name={section.icon} size={18} color="#FFF" />
              </View>
              <Text style={[styles.sectionTitle, {color: theme.text}]}>{section.title}</Text>
            </Animated.View>
            {!searchText && (
                <View style={[styles.podiumWrapper, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderColor: theme.border }]}>
                    {renderPodium(section.data, section.type)}
                </View>
            )}
          </View>
        )}
        renderItem={({ item, index, section }) => {
          // Hide top 3 from regular list if podium is shown
          if (!searchText && index < 3) return null;
          return (
            <StudentItem 
              isDark={isDarkMode} 
              index={index} 
              student={item} 
              type={section.type} 
              onPress={() => handleStudentPress(item, index, section.type)} 
              theme={theme} 
            /> 
          );
        }}
        ListFooterComponent={<View style={{ height: 40 }} />}
      />
    </View>
  );
}

const StudentItem = ({ index, student, type, onPress, theme, isDark }) => {
  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 50).springify()}
      layout={Layout.springify()}
    >
      <Pressable 
        style={({ pressed }) => [ 
            styles.card, 
            { 
                backgroundColor: theme.card, 
                transform: [{scale: pressed ? 0.98 : 1}],
                elevation: isDark ? 2 : 5,
                shadowOpacity: isDark ? 0.2 : 0.15,
                borderWidth: isDark ? 0 : 1,
                borderColor: 'rgba(0,0,0,0.03)' // Subtle hair-line border for clarity
            }
        ]} 
        onPress={() => onPress(student)}
      >
        <View style={[styles.rankBox, { backgroundColor: isDark ? '#4A4A4A' : '#F1F5F9' }]}>
          <Text style={[styles.rankText, { color: isDark ? '#FFF' : '#475569', fontWeight: 'bold' }]}>{index + 1}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, {color: theme.text}]}>{student.name}</Text>
          <Text style={[styles.id, { color: isDark ? theme.subText : '#64748B' }]}>ID: {student.mssv || student.id}</Text>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: type === 'point' ? Colors.primary + (isDark ? '30' : '15') : Colors.secondary + (isDark ? '30' : '15') }]}>
           <Text style={[styles.score, {color: type === 'point' ? Colors.primary : Colors.secondary}]}>{student.avgPoint || student.avgTrainingPoint}</Text>
           <Text style={[styles.scoreType, { color: type === 'point' ? Colors.primary : Colors.secondary }]}>{type === 'point' ? 'GPA' : 'ĐRL'}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    sectionIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    sectionTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.5 },
    podiumWrapper: { paddingVertical: 10, borderRadius: 25, borderWidth: 1, marginBottom: 20 },
    podiumContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', paddingBottom: 20 },
    podiumItem: { alignItems: 'center', width: '30%' },
    winnerItem: { marginBottom: 20 },
    avatarContainer: { position: 'relative' },
    podiumAvatar: { width: 63, height: 63, borderRadius: 31.5, borderWidth: 3 },
    winnerAvatar: { width: 88, height: 88, borderRadius: 44 },
    crown: { position: 'absolute', top: -15, right: -5, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', zIndex: 10, borderWidth: 2, borderColor: '#FFF' },
    podiumName: { fontSize: 13, fontWeight: '800', marginTop: 10, textAlign: 'center' },
    podiumScore: { fontSize: 18, fontWeight: '900', marginTop: 2, textAlign: 'center' },
    card: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 15, 
        borderRadius: 22, 
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
    },
    rankBox: { width: 34, height: 34, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    rankText: { fontSize: 13 },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: '700' },
    id: { fontSize: 12, marginTop: 2 },
    scoreBadge: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12, alignItems: 'center', minWidth: 65 },
    score: { fontSize: 18, fontWeight: '900' },
    scoreType: { fontSize: 10, fontWeight: '800', marginTop: 1 },
});

export default RankingScreen;
