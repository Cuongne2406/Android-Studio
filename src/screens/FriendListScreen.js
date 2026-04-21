import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, FlatList, StyleSheet, Image,
  TouchableOpacity, TextInput, ActivityIndicator,
  Alert, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  FadeOutUp, 
  Layout, 
  ZoomIn 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFriends, deleteFriend } from '../store/slices/friendSlice';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/Theme';
import ScreenHeader from '../components/ScreenHeader';
import GlassCard from '../components/GlassCard';

const FriendListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { friends, loading } = useSelector(state => state.friends);
  const { isDarkMode } = useSelector(state => state.ui);
  const { triggerHaptic } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchFriends());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchFriends());
    setRefreshing(false);
  };

  const theme = isDarkMode ? Colors.dark : Colors.light;

  const filteredFriends = friends.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id, name) => {
    Alert.alert(
      'Xóa bạn bè',
      `Bạn có chắc chắn muốn xóa ${name} khỏi danh sách?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: () => {
            triggerHaptic('notificationSuccess');
            dispatch(deleteFriend(id));
          }
        },
      ]
    );
  };

  const renderFriendItem = ({ item, index }) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).duration(500)}
      exiting={FadeOutUp}
      layout={Layout.springify()}
    >
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => navigation.navigate('AddFriend', { friend: item })}
      >
        <GlassCard intensity={10} isDarkMode={isDarkMode} style={styles.friendCard}>
          <Animated.View entering={ZoomIn.delay(index * 100 + 200)}>
            <Image 
              source={{ uri: item.avatar || `https://ui-avatars.com/api/?name=${item.name}&background=random` }} 
              style={styles.avatar} 
            />
          </Animated.View>
          
          <View style={styles.friendInfo}>
            <Text style={[styles.friendName, { color: theme.text }]}>{item.name}</Text>
            <Text style={[styles.friendEmail, { color: theme.subText }]}>{item.email}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('AddFriend', { friend: item })}
              style={styles.actionButton}
            >
              <Ionicons name="pencil" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleDelete(item._id, item.name)}
              style={styles.actionButton}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScreenHeader 
        title="Bạn Bè" 
        subtitle="Quản lý danh sách liên lạc" 
        theme={theme} 
        isDarkMode={isDarkMode} 
      />

      <View style={styles.searchSection}>
        <GlassCard intensity={25} isDarkMode={isDarkMode} style={styles.searchBar}>
          <Ionicons name="search" size={20} color={theme.subText} style={{ marginRight: 10 }} />
          <TextInput 
            placeholder="Tìm kiếm bạn bè..."
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

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredFriends}
          keyExtractor={(item) => item._id}
          renderItem={renderFriendItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={80} color={theme.subText} opacity={0.3} />
              <Text style={[styles.emptyText, { color: theme.subText }]}>Chưa có bạn bè nào</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => {
          triggerHaptic('impactHeavy');
          navigation.navigate('AddFriend');
        }}
      >
        <LinearGradient 
          colors={[Colors.primary, '#4338CA']} 
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={30} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: { padding: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 20 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '600' },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  friendCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, padding: 12 },
  avatar: { width: 55, height: 55, borderRadius: 27.5, marginRight: 15 },
  friendInfo: { flex: 1 },
  friendName: { fontSize: 17, fontWeight: '800' },
  friendEmail: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  actions: { flexDirection: 'row' },
  actionButton: { padding: 8, marginLeft: 5 },
  fab: { position: 'absolute', bottom: 30, right: 30, elevation: 8, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  fabGradient: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, fontWeight: '700', marginTop: 15 },
});

export default FriendListScreen;
