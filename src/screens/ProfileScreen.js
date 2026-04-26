import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Typography, Spacing } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state) => state.ui);
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    dispatch(logout());
  };

  const { profileData, userToken } = useSelector((state) => state.auth);
  const { data: garden } = useSelector((state) => state.garden);
  const userName = profileData?.name || 'Người Yêu Cây';
  const userEmail = profileData?.email || 'user@greenspace.com';
  const gardenCount = garden?.length || 0;
  const [orderCount, setOrderCount] = React.useState(0);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const axios = require('axios');
        const { API_URL } = require('../config/api');
        const { data } = await axios.get(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        setOrderCount(data.length);
      } catch (e) {
        console.error(e);
      }
    };
    if (userToken) fetchOrders();
  }, [userToken]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: Colors.primary }]}>
        <Text style={styles.headerTitle}>Hồ Sơ Của Tôi</Text>
      </View>
      
      <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
            style={styles.avatar} 
          />
        </View>
        <Text style={[styles.name, { color: theme.text }]}>{userName}</Text>
        <Text style={[styles.email, { color: theme.subText }]}>{userEmail}</Text>

        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statBox} onPress={() => navigation.navigate('Khu Vườn')}>
            <Text style={[styles.statValue, { color: Colors.primary }]}>{gardenCount}</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Cây trong vườn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statBox} onPress={() => navigation.navigate('OrderHistory')}>
            <Text style={[styles.statValue, { color: Colors.secondary }]}>{orderCount}</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Đơn hàng</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.menuContainer, { backgroundColor: theme.card }]}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color={theme.text} />
          <Text style={[styles.menuText, { color: theme.text }]}>Cài đặt tài khoản</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Thông báo", "Tính năng nhắc tưới cây đã được kích hoạt!")}>
          <Ionicons name="notifications-outline" size={24} color={theme.text} />
          <Text style={[styles.menuText, { color: theme.text }]}>Thông báo nhắc tưới cây</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={Colors.danger} />
          <Text style={[styles.menuText, { color: Colors.danger }]}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    ...Typography.header,
    color: '#fff',
    marginTop: 20,
  },
  profileCard: {
    marginHorizontal: Spacing.l,
    marginTop: -40,
    borderRadius: 20,
    padding: Spacing.l,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatarContainer: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    marginTop: -50,
    elevation: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2,
  },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  name: { ...Typography.title, marginTop: Spacing.m },
  email: { ...Typography.body, marginTop: 4 },
  statsContainer: {
    flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: Spacing.l,
    paddingTop: Spacing.m, borderTopWidth: 1, borderTopColor: '#f0f0f0',
  },
  statBox: { alignItems: 'center' },
  statValue: { ...Typography.header, fontSize: 24 },
  statLabel: { ...Typography.caption },
  menuContainer: {
    marginHorizontal: Spacing.l, marginTop: Spacing.l, borderRadius: 20, padding: Spacing.m,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.m,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  menuText: { ...Typography.body, marginLeft: Spacing.m, fontWeight: '500' }
});
