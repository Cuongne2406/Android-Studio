import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { top100StudentsByAvgPoint, top10StudentsByAvgTrainingPoint } from '../../studentStatistics';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState('https://cdn-icons-png.flaticon.com/512/3135/3135715.png');
  const [profileData, setProfileData] = useState({
    name: "Nguyễn Trung Cường", id: "123000991", major: "Khoa Công Nghệ Thông Tin",
    school: "Đại học Lạc Hồng", teacher: "Nguyễn Khắc Hoàng", year: "2023 - 2027",
    address: "Cơ sở 1 - Biên Hòa", avgPoint: 10, trainingPoint: 10, rank: "Xuất sắc"
  });

  const [studentsData, setStudentsData] = useState({ 
    point: top100StudentsByAvgPoint, 
    training: top10StudentsByAvgTrainingPoint 
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [facultyFilter, setFacultyFilter] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedAvatar = await AsyncStorage.getItem('profileAvatar');
        const savedProfile = await AsyncStorage.getItem('profileData');
        const savedTheme = await AsyncStorage.getItem('isDarkMode');
        const savedLogin = await AsyncStorage.getItem('isLoggedIn');
        
        if (savedAvatar) setProfileAvatar(savedAvatar);
        if (savedProfile) setProfileData(JSON.parse(savedProfile));
        if (savedTheme !== null) setIsDarkMode(JSON.parse(savedTheme));
        if (savedLogin !== null) setIsLoggedIn(JSON.parse(savedLogin));
      } catch (error) { 
        console.log("Error loading persistent data:", error); 
      } finally { 
        setIsReady(true); 
      }
    };
    loadData();
  }, []);

  const updateAvatar = async (uri) => { 
    setProfileAvatar(uri); 
    await AsyncStorage.setItem('profileAvatar', uri); 
  };
  
  const updateProfileData = async (newData) => { 
    setProfileData(newData); 
    await AsyncStorage.setItem('profileData', JSON.stringify(newData)); 
  };
  
  const toggleDarkMode = async (value) => { 
    setIsDarkMode(value); 
    await AsyncStorage.setItem('isDarkMode', JSON.stringify(value)); 
  };
  
  const loginApp = async () => { 
    setIsLoggedIn(true); 
    await AsyncStorage.setItem('isLoggedIn', 'true'); 
  };
  
  const logoutApp = async () => { 
    setIsLoggedIn(false); 
    await AsyncStorage.setItem('isLoggedIn', 'false'); 
  };

  const triggerHaptic = (type = 'selection') => {
    if (Platform.OS === 'web') return;
    if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else if (type === 'error') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    else if (type === 'warning') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (!isReady) return null;

  return (
    <AppContext.Provider value={{
      profileAvatar, updateAvatar, profileData, updateProfileData,
      studentsData, setStudentsData, isDarkMode, toggleDarkMode,
      isLoggedIn, loginApp, logoutApp,
      facultyFilter, setFacultyFilter, triggerHaptic
    }}>
      {children}
    </AppContext.Provider>
  );
};
