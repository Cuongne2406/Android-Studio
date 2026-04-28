import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '../theme/Theme';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WebLayout = ({ children, navigation, activeRoute }) => {
  const dispatch = useDispatch();
  if (Platform.OS !== 'web') return children;

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    dispatch(logout());
  };

  const navItems = [
    { name: 'Command Center', icon: 'apps', route: 'Command Center' },
    { name: 'Nodes', icon: 'hardware-chip-outline', route: 'Neural Hub' },
    { name: 'Assets', icon: 'cube-outline', route: 'Market' },
    { name: 'Lumina', icon: 'sparkles-outline', route: 'Lumina AI' },
    { name: 'Operator', icon: 'person-outline', route: 'Operator' },
  ];

  return (
    <View style={styles.container}>
      {/* Persistent Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.logoContainer}>
          <Ionicons name="flash" size={32} color={Colors.primary} />
          <Text style={styles.logoText}>ZENITH</Text>
        </View>

        <View style={styles.navItems}>
          {navItems.map((item) => (
            <TouchableOpacity 
              key={item.route}
              style={[styles.navItem, activeRoute === item.route && styles.navItemActive]}
              onPress={() => navigation.navigate(item.route)}
            >
              <Ionicons 
                name={item.icon} 
                size={24} 
                color={activeRoute === item.route ? Colors.primary : '#888'} 
              />
              <Text style={[styles.navText, activeRoute === item.route && styles.navTextActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={Colors.danger} />
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#050508' },
  sidebar: {
    width: 85,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    justifyContent: 'space-between',
  },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoText: { color: Colors.primary, fontSize: 10, fontWeight: '900', marginTop: 5 },
  navItems: { gap: 30, flex: 1, justifyContent: 'center' },
  navItem: { alignItems: 'center', opacity: 0.6 },
  navItemActive: { opacity: 1 },
  navText: { color: '#888', fontSize: 10, marginTop: 5 },
  navTextActive: { color: Colors.primary, fontWeight: 'bold' },
  logoutBtn: { marginBottom: Spacing.m },
  mainContent: { flex: 1, backgroundColor: '#050508' },
});

export default WebLayout;
