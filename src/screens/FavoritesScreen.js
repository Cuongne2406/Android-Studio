import React, { useContext, useMemo } from 'react';
import { 
  View, Text, FlatList, StyleSheet, Image, 
  TouchableOpacity, Dimensions, Platform, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/Theme';
import ScreenHeader from '../components/ScreenHeader';
import GlassCard from '../components/GlassCard';

const { width } = Dimensions.get('window');

const FavoritesScreen = ({ navigation }) => {
  const { isDarkMode, favorites, toggleFavorite, triggerHaptic } = useContext(AppContext);
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const renderItem = ({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(600)}>
      <TouchableOpacity 
        onPress={() => { triggerHaptic(); navigation.navigate('Home', { screen: 'Ranking', params: { screen: 'RankingDetail', params: { student: item } } }); }}
        activeOpacity={0.7}
      >
        <GlassCard intensity={20} isDarkMode={isDarkMode} style={styles.favoriteItem}>
          <Image source={{ uri: `https://ui-avatars.com/api/?name=${item.name}&background=random` }} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
            <Text style={[styles.id, { color: item.mssv ? theme.subText : theme.subText + '80' }]}>{item.mssv || item.id}</Text>
          </View>
          <TouchableOpacity 
            onPress={(e) => { e.stopPropagation(); triggerHaptic(); toggleFavorite(item); }}
            style={styles.heartBtn}
          >
            <Ionicons name="heart" size={26} color={Colors.error} />
          </TouchableOpacity>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScreenHeader title="Yêu Thích" subtitle="Danh sách quan tâm" theme={theme} isDarkMode={isDarkMode} />
      
      {favorites.length === 0 ? (
        <Animated.View entering={ZoomIn.delay(300)} style={styles.emptyContainer}>
            <GlassCard intensity={15} isDarkMode={isDarkMode} style={styles.emptyCard}>
                <Ionicons name="heart-outline" size={80} color={theme.subText + '40'} />
                <Text style={[styles.emptyText, { color: theme.subText }]}>Chưa có sinh viên nào trong danh sách yêu thích.</Text>
                <TouchableOpacity 
                    style={[styles.discoverBtn, { backgroundColor: Colors.primary }]}
                    onPress={() => navigation.navigate('Home', { screen: 'Ranking' })}
                >
                    <Text style={styles.discoverBtnText}>Khám phá bảng xếp hạng</Text>
                </TouchableOpacity>
            </GlassCard>
        </Animated.View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={item => (item.id || item.mssv).toString()}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 15, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  favoriteItem: { flexDirection: 'row', alignItems: 'center', padding: 15, marginBottom: 15 },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 15, borderWidth: 2, borderColor: '#FFF' },
  info: { flex: 1 },
  name: { fontSize: 17, fontWeight: '800' },
  id: { fontSize: 12, fontWeight: '600', marginTop: 3, opacity: 0.7 },
  heartBtn: { padding: 5 },
  emptyContainer: { flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center' },
  emptyCard: { width: '100%', alignItems: 'center', padding: 40 },
  emptyText: { marginTop: 20, textAlign: 'center', fontSize: 16, fontWeight: '600' },
  discoverBtn: { marginTop: 30, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 15, elevation: 5 },
  discoverBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 }
});

export default FavoritesScreen;
