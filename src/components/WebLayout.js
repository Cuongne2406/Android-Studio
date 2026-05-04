import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '../theme/Theme';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Skeleton from './Skeleton';

const DashboardSkeleton = () => (
  <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: Spacing.xl }}>
    <View style={{ marginBottom: Spacing.xl }}>
      <Skeleton width={200} height={32} style={{ marginBottom: 10 }} />
      <Skeleton width={150} height={16} />
    </View>
    <View style={{ flexDirection: 'row', gap: Spacing.m, marginBottom: Spacing.xl, flexWrap: 'wrap' }}>
      <Skeleton width={220} height={100} borderRadius={16} />
      <Skeleton width={220} height={100} borderRadius={16} />
      <Skeleton width={220} height={100} borderRadius={16} />
    </View>
    <View style={{ flexDirection: 'row', gap: Spacing.xl }}>
      <View style={{ flex: 1.5 }}>
        <Skeleton width="100%" height={40} style={{ marginBottom: Spacing.m }} />
        <Skeleton width="100%" height={60} style={{ marginBottom: Spacing.m }} />
        <Skeleton width="100%" height={60} style={{ marginBottom: Spacing.m }} />
      </View>
      <View style={{ flex: 1 }}>
        <Skeleton width="100%" height={300} borderRadius={16} />
      </View>
    </View>
  </ScrollView>
);

const WebLayout = ({ children, navigation, activeRoute }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [activeRoute]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    dispatch(logout());
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleNavPress = (route) => {
    if (isMobile) {
      setIsSidebarOpen(false);
      // Small delay to let the sidebar start closing before navigation
      setTimeout(() => {
        navigation.navigate(route);
      }, 100);
    } else {
      navigation.navigate(route);
    }
  };

  const navItems = [
    { name: 'Command Center', icon: 'apps', route: 'Command Center' },
    { name: 'Nodes', icon: 'hardware-chip-outline', route: 'Neural Hub' },
    { name: 'Assets', icon: 'thermometer-outline', route: 'Assets' },
    { name: 'Lumina', icon: 'sparkles-outline', route: 'Lumina AI' },
    { name: 'Operator', icon: 'person-outline', route: 'Operator' },
  ];

  return (
    <View style={styles.container}>
      {/* Sidebar Overlay for Mobile */}
      {isMobile && isSidebarOpen && (
        <TouchableWithoutFeedback onPress={() => setIsSidebarOpen(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Persistent/Toggleable Sidebar */}
      {(isSidebarOpen || !isMobile) && (
        <View style={[
          styles.sidebar, 
          isMobile && styles.mobileSidebar,
          isMobile && !isSidebarOpen && { display: 'none' }
        ]}>
          <View style={styles.logoContainer}>
            <Ionicons name="flash" size={32} color={Colors.primary} />
            <Text style={styles.logoText}>ZENITH</Text>
          </View>

          <View style={styles.navItems}>
            {navItems.map((item) => (
              <TouchableOpacity 
                key={item.route}
                style={[styles.navItem, activeRoute === item.route && styles.navItemActive]}
                onPress={() => handleNavPress(item.route)}
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
      )}

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {isMobile && (
          <View style={[styles.mobileHeader, { paddingTop: Math.max(insets.top, 20), height: 70 + insets.top }]}>
            <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
              <Ionicons name="menu-outline" size={28} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.mobileTitle}>{activeRoute}</Text>
            <View style={{ width: 40 }} /> 
          </View>
        )}
        {isLoading ? <DashboardSkeleton /> : children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#050508' },
  sidebar: {
    width: 85,
    backgroundColor: 'rgba(5, 5, 8, 0.95)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    justifyContent: 'space-between',
  },
  mobileSidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: '#050508',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 999,
  },
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(5, 5, 8, 0.8)',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileTitle: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
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
