import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import WebDashboard from './src/screens/WebDashboard';

// Redux Integration
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './src/store';
import { setToken, logout } from './src/store/slices/authSlice';
import axios from 'axios';
import { fetchPlants } from './src/store/slices/plantSlice';
import { fetchGarden } from './src/store/slices/gardenSlice';
import socketService from './src/services/socketService';

// Existing modular components
import { AppProvider } from './src/context/AppContext';
import { CartProvider } from './src/context/CartContext';
import { NetworkProvider, NetworkContext } from './src/context/NetworkContext';
import { Colors } from './src/theme/Theme';
import { setupNotifications } from './src/services/NotificationService';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AIScreen from './src/screens/AIScreen';
import StoreScreen from './src/screens/StoreScreen';
import PlantDetailScreen from './src/screens/PlantDetailScreen';
import GardenScreen from './src/screens/GardenScreen';
import AddEditPlantScreen from './src/screens/AddEditPlantScreen';
import CartScreen from './src/screens/CartScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';
import CustomDrawerContent from './src/components/CustomDrawerContent';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const StoreStack = createNativeStackNavigator();
const GardenStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const StoreStackScreen = () => (
    <StoreStack.Navigator screenOptions={{ headerShown: false }}>
        <StoreStack.Screen name="StoreMain" component={StoreScreen} />
        <StoreStack.Screen name="PlantDetail" component={PlantDetailScreen} />
        <StoreStack.Screen name="Cart" component={CartScreen} />
    </StoreStack.Navigator>
);

const GardenStackScreen = () => (
    <GardenStack.Navigator screenOptions={{ headerShown: false }}>
        <GardenStack.Screen name="GardenMain" component={GardenScreen} />
        <GardenStack.Screen name="AddEditPlant" component={AddEditPlantScreen} />
    </GardenStack.Navigator>
);

const ProfileStackScreen = () => (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
        <ProfileStack.Screen name="Settings" component={SettingsScreen} />
        <ProfileStack.Screen name="OrderHistory" component={OrderHistoryScreen} />
    </ProfileStack.Navigator>
);

const MainTabs = () => {
  const { isDarkMode } = useSelector(state => state.ui);
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Market') iconName = focused ? 'cube' : 'cube-outline';
          else if (route.name === 'Neural Hub') iconName = focused ? 'hardware-chip' : 'hardware-chip-outline';
          else if (route.name === 'Lumina AI') iconName = focused ? 'sparkles' : 'sparkles-outline';
          else if (route.name === 'Operator') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: theme.card, 
          borderTopColor: theme.border,
          height: 70, 
          paddingBottom: 15,
          paddingTop: 10,
          elevation: 10
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: theme.subText,
      })}
    >
      <Tab.Screen name="Market" component={StoreStackScreen} />
      <Tab.Screen name="Neural Hub" component={GardenStackScreen} />
      <Tab.Screen name="Lumina AI" component={AIScreen} />
      <Tab.Screen name="Operator" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
}

const DrawerNavigator = () => {
    const { isDarkMode } = useSelector(state => state.ui);
    const theme = isDarkMode ? Colors.dark : Colors.light;
  
    return (
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: Colors.primary,
          drawerInactiveTintColor: theme.subText,
          drawerStyle: { backgroundColor: theme.card, width: 280 },
          drawerLabelStyle: { fontWeight: 'bold', marginLeft: -10 }
        }}
      >
        {/* Command Center available on all platforms with responsive design */}
        <Drawer.Screen 
          name="Command Center" 
          component={WebDashboard} 
          options={{ 
            drawerIcon: ({ color }) => <Ionicons name="apps-outline" size={22} color={color} />
          }} 
        />
        
        <Drawer.Screen 
          name="HomeTabs" 
          component={MainTabs} 
          options={{ 
            drawerLabel: Platform.OS === 'web' ? 'System Overview' : 'Dashboard',
            drawerIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
            // Hide the drawer entry on mobile if we want, but keeping it simple for now
          }} 
        />

        {/* Adding direct access to these screens for Web navigation handlers */}
        <Drawer.Screen name="Market" component={StoreStackScreen} options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="Neural Hub" component={GardenStackScreen} options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="Lumina AI" component={AIScreen} options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="Operator" component={ProfileStackScreen} options={{ drawerItemStyle: { display: 'none' } }} />
      </Drawer.Navigator>
    );
};

const NetworkBanner = () => {
    const { isConnected } = useContext(NetworkContext);
    if (isConnected) return null;
    return (
        <View style={styles.noInternetBanner}>
            <Ionicons name="wifi-outline" size={16} color="#fff" />
            <Text style={styles.noInternetText}>OFFLINE MODE</Text>
        </View>
    );
};

const AppContent = () => {
  const { isLoggedIn } = useSelector(state => state.auth);
  const { isDarkMode } = useSelector(state => state.ui);
  const dispatch = useDispatch();

  useEffect(() => {
    setupNotifications();
    
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Only logout if the error is 401 AND it's coming from our main backend
        const isBackendError = error.config && error.config.url && (error.config.url.includes('192.168.10.35') || error.config.url.includes('127.0.0.1'));
        
        if (error && error.response && error.response.status === 401 && isBackendError) {
          console.log('Backend 401 detected - Logging out...');
          await AsyncStorage.removeItem('userToken');
          dispatch(logout());
        }
        return Promise.reject(error);
      }
    );

    const checkStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          dispatch(setToken(token));
          dispatch(fetchPlants());
          dispatch(fetchGarden());
        }
        socketService.connect();
      } catch (e) {
        console.error("Initialization error:", e);
      }
    };
    checkStatus();

    return () => axios.interceptors.response.eject(interceptor);
  }, [dispatch, isLoggedIn]);

  return (
    <NavigationContainer>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NetworkBanner />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={DrawerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppProvider> 
        <CartProvider>
          <NetworkProvider>
            <AppContent />
          </NetworkProvider>
        </CartProvider>
      </AppProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
    noInternetBanner: {
        backgroundColor: '#EF4444',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 4,
        paddingTop: 45, // Account for status bar
    },
    noInternetText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 8,
    }
});