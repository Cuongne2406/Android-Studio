import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import apiClient from '../api/client';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState('https://cdn-icons-png.flaticon.com/512/3135/3135715.png');
  const [profileData, setProfileData] = useState({
    name: "Sinh viên LHU", id: "---", major: "CNTT",
    school: "Đại học Lạc Hồng", teacher: "Nguyễn Khắc Hoàng", year: "2023 - 2027",
    address: "Biên Hòa, Đồng Nai", avgPoint: 0, trainingPoint: 0, rank: "---"
  });

  const [studentsData, setStudentsData] = useState({ point: [], training: [] });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [facultyFilter, setFacultyFilter] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const triggerHaptic = (type = 'selection') => {
    if (Platform.OS === 'web') return;
    try {
        if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        else if (type === 'error') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        else if (type === 'warning') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
  };

  const fetchTasks = async () => {
    try {
        const { data } = await apiClient.get('/tasks');
        setTasks(data);
    } catch (error) {
        console.error("Fetch tasks error:", error);
    }
  };

  const fetchStudents = async () => {
    try {
        const { data } = await apiClient.get('/students');
        // Split data into point and training for old UI compatibility
        const pointData = [...data].sort((a,b) => b.avgPoint - a.avgPoint);
        const trainingData = [...data].sort((a,b) => b.trainingPoint - a.trainingPoint).slice(0, 10);
        setStudentsData({ point: pointData, training: trainingData });
    } catch (error) {
        console.error("Fetch students error:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('isDarkMode');
        const token = await AsyncStorage.getItem('userToken');
        const userName = await AsyncStorage.getItem('userName');
        const userMssv = await AsyncStorage.getItem('userMssv');
        const savedHistory = await AsyncStorage.getItem('searchHistory');
        const savedFavorites = await AsyncStorage.getItem('favorites');
        
        if (savedTheme !== null) setIsDarkMode(JSON.parse(savedTheme));
        if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
        
        if (token) {
            setUserToken(token);
            setIsLoggedIn(true);
            if (userName && userMssv) {
                setProfileData(prev => ({ ...prev, name: userName, id: userMssv }));
            }
            await fetchTasks();
        }
        await fetchStudents();
      } catch (error) { 
        console.log("Error loading persistent data:", error); 
      } finally { 
        setIsReady(true); 
      }
    };
    loadData();
  }, []);

  const loginApp = async (mssv, password) => { 
    try {
        const { data } = await apiClient.post('/auth/login', { mssv, password });
        setIsLoggedIn(true); 
        setUserToken(data.token);
        setProfileData(prev => ({ ...prev, name: data.name, id: data.mssv }));
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userName', data.name);
        await AsyncStorage.setItem('userMssv', data.mssv);
        await fetchTasks();
        triggerHaptic('success');
        return true;
    } catch (error) {
        Alert.alert("Lỗi đăng nhập", error.response?.data?.message || "Sai MSSV hoặc mật khẩu");
        triggerHaptic('error');
        return false;
    }
  };
  
  const logoutApp = async () => { 
    setIsLoggedIn(false); 
    setUserToken(null);
    setTasks([]);
    setProfileData(prev => ({ ...prev, name: "Sinh viên LHU", id: "---" }));
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.removeItem('userMssv');
    triggerHaptic('warning');
  };

  const addTask = async (task) => {
    try {
        const { data } = await apiClient.post('/tasks', task);
        setTasks([...tasks, data]);
        triggerHaptic('success');
    } catch (error) {
        console.error("Add task error:", error);
    }
  };

  const updateTask = async (updatedTask) => {
    try {
        const { data } = await apiClient.put(`/tasks/${updatedTask.id || updatedTask._id}`, updatedTask);
        setTasks(tasks.map(t => (t.id || t._id) === (data.id || data._id) ? data : t));
        triggerHaptic('success');
    } catch (error) {
        console.error("Update task error:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
        await apiClient.delete(`/tasks/${id}`);
        setTasks(tasks.filter(t => (t.id || t._id) !== id));
        triggerHaptic('warning');
    } catch (error) {
        console.error("Delete task error:", error);
    }
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
    const isFav = favorites.some(f => (f.id || f.mssv || f._id) === (student.id || student.mssv || student._id));
    let newFavs;
    if (isFav) {
      newFavs = favorites.filter(f => (f.id || f.mssv || f._id) !== (student.id || student.mssv || student._id));
    } else {
      newFavs = [...favorites, student];
    }
    setFavorites(newFavs);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
  };

  if (!isReady) return null;

  return (
    <AppContext.Provider value={{
      profileAvatar, setProfileAvatar, profileData, setProfileData,
      isDarkMode, setIsDarkMode, toggleDarkMode: (v) => setIsDarkMode(v),
      isLoggedIn, userToken, loginApp, logoutApp, logout: logoutApp,
      facultyFilter, setFacultyFilter, triggerHaptic,
      tasks, addTask, updateTask, deleteTask, fetchTasks,
      searchHistory, addSearchHistory, clearHistory,
      favorites, toggleFavorite, studentsData, fetchStudents
    }}>
      {children}
    </AppContext.Provider>
  );
};
