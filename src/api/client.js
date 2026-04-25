import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Sử dụng IP LAN thật của máy tính để điện thoại thật có thể kết nối được
const API_URL = 'http://192.168.100.241:5000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle token expiration/invalidation
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // Clear token from storage if unauthorized
            await AsyncStorage.removeItem('userToken');
            
            // On web, force reload to reset AppContext state
            if (Platform.OS === 'web') {
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
