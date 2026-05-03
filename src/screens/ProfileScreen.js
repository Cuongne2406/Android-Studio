import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, Switch, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { toggleDarkMode } from '../store/slices/uiSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Typography, Spacing } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import WebLayout from '../components/WebLayout';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state) => state.ui);
  const theme = isDarkMode ? Colors.dark : Colors.light;
  
  const handleLogout = async () => {
    if (Platform.OS === 'web') {
        await AsyncStorage.removeItem('userToken');
        dispatch(logout());
        return;
    }
    Alert.alert("Logout", "Are you sure you want to exit Zenith?", [
        { text: "Stay", style: "cancel" },
        { text: "Exit", style: "destructive", onPress: async () => {
            await AsyncStorage.removeItem('userToken');
            dispatch(logout());
        }}
    ]);
  };

  const { profileData, userToken } = useSelector((state) => state.auth);
  const { data: garden } = useSelector((state) => state.garden);
  const userName = profileData?.name || 'Commander Zero';
  const userEmail = profileData?.email || 'zero@zenith-ai.com';
  const moduleCount = garden?.length || 0;

  const content = (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Profile Hub</Text>
      </LinearGradient>
      
      <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
        <View style={[styles.avatarContainer, { backgroundColor: theme.card, borderColor: Colors.primary }]}>
          <Image 
            source={{ uri: 'https://img.freepik.com/premium-vector/astronaut-character-wearing-space-suit-portrait_24911-30917.jpg' }} 
            style={styles.avatar} 
          />
        </View>
        <Text style={[styles.name, { color: theme.text }]}>{userName}</Text>
        <Text style={[styles.rank, { color: Colors.primary }]}>Senior Commander</Text>
        <Text style={[styles.email, { color: theme.subText }]}>{userEmail}</Text>

        <View style={[styles.statsContainer, { borderTopColor: theme.border }]}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: Colors.primary }]}>{moduleCount}</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Modules</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: Colors.secondary }]}>98%</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Sync Rate</Text>
          </View>
        </View>
      </View>

      <View style={[styles.menuContainer, { backgroundColor: theme.card }]}>
        <View style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="moon-outline" size={24} color={Colors.secondary} />
            <Text style={[styles.menuText, { color: theme.text }]}>Dark Mode</Text>
          </View>
          <Switch 
            value={isDarkMode} 
            onValueChange={() => dispatch(toggleDarkMode())} 
            trackColor={{ false: '#767577', true: Colors.primary + '80' }}
            thumbColor={isDarkMode ? Colors.primary : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
          <View style={styles.menuLeft}>
            <Ionicons name="finger-print-outline" size={24} color={Colors.primary} />
            <Text style={[styles.menuText, { color: theme.text }]}>Security Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.subText} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Telemetry", "System notifications are active.")}>
          <View style={styles.menuLeft}>
            <Ionicons name="notifications-outline" size={24} color={Colors.warning} />
            <Text style={[styles.menuText, { color: theme.text }]}>Hub Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.subText} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
          <View style={styles.menuLeft}>
            <Ionicons name="power-outline" size={24} color={Colors.danger} />
            <Text style={[styles.menuText, { color: Colors.danger }]}>Deactivate Session</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  return (
    <WebLayout navigation={navigation} activeRoute="Operator">
        {content}
    </WebLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTitle: {
    ...Typography.header,
    color: '#fff',
    marginTop: 20,
    letterSpacing: 2,
  },
  profileCard: {
    marginHorizontal: Spacing.l,
    marginTop: -50,
    borderRadius: 24,
    padding: Spacing.l,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  avatarContainer: {
    width: 110, height: 110, borderRadius: 55,
    borderWidth: 4,
    justifyContent: 'center', alignItems: 'center',
    marginTop: -60,
    overflow: 'hidden',
  },
  avatar: { width: '100%', height: '100%' },
  name: { ...Typography.title, marginTop: Spacing.m, fontSize: 24 },
  rank: { fontSize: 14, fontWeight: 'bold', marginTop: 4, letterSpacing: 1 },
  email: { ...Typography.body, marginTop: 4, opacity: 0.7 },
  statsContainer: {
    flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: Spacing.l,
    paddingTop: Spacing.m, borderTopWidth: 1,
  },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { ...Typography.header, fontSize: 28 },
  statLabel: { ...Typography.caption, textTransform: 'uppercase', letterSpacing: 1 },
  statDivider: { width: 1, height: '80%', alignSelf: 'center' },
  menuContainer: {
    marginHorizontal: Spacing.l, marginTop: Spacing.l, borderRadius: 24, padding: Spacing.m,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.m,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuText: { ...Typography.body, marginLeft: Spacing.m, fontWeight: '600' }
});
