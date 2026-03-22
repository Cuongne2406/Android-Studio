import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/Theme';
import GlassCard from './GlassCard';

const { width } = Dimensions.get('window');

const CustomDrawerContent = (props) => {
  const { profileData, profileAvatar, isDarkMode, logoutApp, triggerHaptic } = useContext(AppContext);
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const handleLogout = () => {
    triggerHaptic('warning');
    logoutApp();
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#0F172A' : '#F1F5F9' }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        {/* Header Section with Gradient */}
        <LinearGradient
            colors={isDarkMode ? ['#1E293B', '#0F172A'] : [Colors.primary, '#8B5CF6']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
          <Animated.View entering={FadeInLeft.duration(600)} style={styles.headerContent}>
            <View style={styles.avatarGlow}>
                <Image source={{ uri: profileAvatar }} style={styles.avatar} />
            </View>
            <View style={styles.headerInfo}>
                <Text style={styles.name}>{profileData.name}</Text>
                <Text style={styles.mssv}>{profileData.id} • {profileData.major}</Text>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Navigation Items */}
        <View style={styles.itemContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Footer / Logout with Glass effect */}
      <GlassCard intensity={30} isDarkMode={isDarkMode} style={styles.footerCard}>
        <TouchableOpacity 
            style={styles.logoutBtn} 
            onPress={handleLogout}
        >
            <LinearGradient
                colors={['#EF4444', '#B91C1C']}
                style={styles.logoutIconBox}
            >
                <Ionicons name="log-out-outline" size={20} color="#FFF" />
            </LinearGradient>
            <Text style={[styles.logoutText, { color: isDarkMode ? '#F8FAFC' : '#1E293B' }]}>Đăng xuất</Text>
        </TouchableOpacity>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 25,
    borderBottomRightRadius: 40,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarGlow: {
    padding: 3,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  headerInfo: {
    marginLeft: 18,
    flex: 1,
  },
  name: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  mssv: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  itemContainer: {
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  footerCard: {
    margin: 15,
    marginBottom: 30,
    padding: 5,
    borderRadius: 20,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  logoutIconBox: {
    width: 40, height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '800',
  },
});

export default CustomDrawerContent;
