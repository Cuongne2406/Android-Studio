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
  const [userToken, setUserToken] = useState(null);
  const [facultyFilter, setFacultyFilter] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedAvatar = await AsyncStorage.getItem('profileAvatar');
        const savedProfile = await AsyncStorage.getItem('profileData');
        const savedTheme = await AsyncStorage.getItem('isDarkMode');
        const savedLogin = await AsyncStorage.getItem('isLoggedIn');
        const savedToken = await AsyncStorage.getItem('userToken');
        const savedTasks = await AsyncStorage.getItem('tasks');
        const savedHistory = await AsyncStorage.getItem('searchHistory');
        const savedFavorites = await AsyncStorage.getItem('favorites');
        
        if (savedAvatar) setProfileAvatar(savedAvatar);
        if (savedProfile) setProfileData(JSON.parse(savedProfile));
        if (savedTheme !== null) setIsDarkMode(JSON.parse(savedTheme));
        if (savedLogin !== null) setIsLoggedIn(JSON.parse(savedLogin));
        if (savedToken) setUserToken(savedToken);
        if (savedTasks) setTasks(JSON.parse(savedTasks));
        if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      } catch (error) { 
        console.log("Error loading persistent data:", error); 
      } finally { 
        setIsReady(true); 
      }
    };
    loadData();
  }, []);

  const triggerHaptic = (type = 'selection') => {
    if (Platform.OS === 'web') return;
    if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else if (type === 'error') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    else if (type === 'warning') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const addTask = async (task) => {
    const newTasks = [...tasks, { ...task, id: Date.now().toString() }];
    setTasks(newTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    triggerHaptic('success');
  };

  const updateTask = async (updatedTask) => {
    const newTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    setTasks(newTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    triggerHaptic('success');
  };

  const deleteTask = async (id) => {
    const newTasks = tasks.filter(t => t.id !== id);
    setTasks(newTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    triggerHaptic('warning');
  };

  const addSearchHistory = async (query) => {
    if (!query.trim()) return;
    const newHistory = [{ query, time: new Date().toLocaleTimeString() }, ...searchHistory.slice(0, 19)];
    setSearchHistory(newHistory);
    await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const clearHistory = async () => {
    setSearchHistory([]);
    await AsyncStorage.setItem('searchHistory', JSON.stringify([]));
  };

  const toggleFavorite = async (student) => {
    const isFav = favorites.some(f => (f.id || f.mssv) === (student.id || student.mssv));
    let newFavs;
    if (isFav) {
      newFavs = favorites.filter(f => (f.id || f.mssv) !== (student.id || student.mssv));
    } else {
      newFavs = [...favorites, student];
    }
    setFavorites(newFavs);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
  };

  const loginApp = async (mssv) => { 
    const mockToken = `jwt_token_${mssv}_${Date.now()}`;
    setIsLoggedIn(true); 
    setUserToken(mockToken);
    await AsyncStorage.setItem('isLoggedIn', 'true'); 
    await AsyncStorage.setItem('userToken', mockToken);
  };
  
  const logoutApp = async () => { 
    setIsLoggedIn(false); 
    setUserToken(null);
    await AsyncStorage.setItem('isLoggedIn', 'false'); 
    await AsyncStorage.setItem('userToken', '');
    await AsyncStorage.removeItem('userToken');
  };

  if (!isReady) return null;

  return (
    <AppContext.Provider value={{
      profileAvatar, setProfileAvatar, profileData, setProfileData,
      isDarkMode, setIsDarkMode, toggleDarkMode: (v) => setIsDarkMode(v), toggleTheme: () => setIsDarkMode(prev => !prev),
      isLoggedIn, userToken, loginApp, logoutApp, logout: logoutApp,
      facultyFilter, setFacultyFilter, triggerHaptic,
      tasks, addTask, updateTask, deleteTask,
      searchHistory, addSearchHistory, clearHistory,
      favorites, toggleFavorite
    }}>
      {children}
    </AppContext.Provider>
  );
};
