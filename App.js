import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// Redux Integration
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './src/store';
import { setToken } from './src/store/slices/authSlice';
import { fetchPlants } from './src/store/slices/plantSlice';
import { fetchGarden } from './src/store/slices/gardenSlice';
import socketService from './src/services/socketService';

// Existing modular components
import { AppProvider } from './src/context/AppContext';
import { CartProvider } from './src/context/CartContext';
import { Colors } from './src/theme/Theme';

// GreenSpace Screens
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
          if (route.name === 'Cửa Hàng') iconName = focused ? 'leaf' : 'leaf-outline';
          else if (route.name === 'Khu Vườn') iconName = focused ? 'flower' : 'flower-outline';
          else if (route.name === 'Trợ Lý AI') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          else if (route.name === 'Hồ Sơ') iconName = focused ? 'person' : 'person-outline';
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
        tabBarInactiveTintColor: '#888',
      })}
    >
      <Tab.Screen name="Cửa Hàng" component={StoreStackScreen} />
      <Tab.Screen name="Khu Vườn" component={GardenStackScreen} />
      <Tab.Screen name="Trợ Lý AI" component={AIScreen} />
      <Tab.Screen name="Hồ Sơ" component={ProfileStackScreen} />
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
        <Drawer.Screen 
          name="HomeTabs" 
          component={MainTabs} 
          options={{ 
            drawerLabel: 'Trang chủ',
            drawerIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />
          }} 
        />
      </Drawer.Navigator>
    );
};

const AppContent = () => {
  const { isLoggedIn } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const axios = require('axios');
    const { logout } = require('./src/store/slices/authSlice');
    
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && error.response.status === 401) {
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
          <AppContent />
        </CartProvider>
      </AppProvider>
    </Provider>
  );
}