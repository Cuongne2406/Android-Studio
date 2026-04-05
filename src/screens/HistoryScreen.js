import React, { useContext, useMemo } from 'react';
import { 
  View, Text, FlatList, StyleSheet, Image, 
  TouchableOpacity, Dimensions, Platform, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/Theme';
import ScreenHeader from '../components/ScreenHeader';
import GlassCard from '../components/GlassCard';

const { width } = Dimensions.get('window');

const HistoryScreen = () => {
  const { searchHistory } = useSelector(state => state.history);
  const { isDarkMode, triggerHaptic } = useContext(AppContext);
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const renderItem = ({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(600)}>
      <GlassCard intensity={15} isDarkMode={isDarkMode} style={styles.historyItem}>
        <View style={[styles.iconBox, { backgroundColor: Colors.primary + '15' }]}>
            <Ionicons name="search" size={20} color={Colors.primary} />
        </View>
        <View style={styles.content}>
            <Text style={[styles.query, { color: theme.text }]}>{item.query}</Text>
            <Text style={[styles.time, { color: theme.subText }]}>{item.time}</Text>
        </View>
        <TouchableOpacity onPress={() => triggerHaptic()} style={styles.moreBtn}>
            <Ionicons name="chevron-forward" size={20} color={theme.subText} />
        </TouchableOpacity>
      </GlassCard>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScreenHeader title="Lịch Sử" subtitle="Hoạt động gần đây" theme={theme} isDarkMode={isDarkMode} />
      
      {searchHistory.length === 0 ? (
        <Animated.View entering={ZoomIn.delay(300)} style={styles.emptyContainer}>
            <GlassCard intensity={15} isDarkMode={isDarkMode} style={styles.emptyCard}>
                <Ionicons name="time-outline" size={80} color={theme.subText + '40'} />
                <Text style={[styles.emptyText, { color: theme.subText }]}>Chưa có lịch sử tìm kiếm nào.</Text>
            </GlassCard>
        </Animated.View>
      ) : (
        <FlatList
          data={searchHistory}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 15, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, padding: 15 },
  iconBox: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary + '15', marginRight: 15 },
  content: { flex: 1 },
  action: { fontSize: 15, fontWeight: '600' },
  time: { fontSize: 13, marginTop: 4 }
});

export default HistoryScreen;
