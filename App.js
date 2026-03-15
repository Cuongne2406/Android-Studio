import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Import modular components
import { AppProvider, AppContext } from './src/context/AppContext';
import { Colors } from './src/theme/Theme';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RankingScreen from './src/screens/RankingScreen';
import StudentDetailScreen from './src/screens/StudentDetailScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const RankingStack = createNativeStackNavigator();

const RankingStackScreen = () => (
    <RankingStack.Navigator screenOptions={{ headerShown: false }}>
        <RankingStack.Screen name="RankingMain" component={RankingScreen} />
        <RankingStack.Screen name="RankingDetail" component={StudentDetailScreen} />
    </RankingStack.Navigator>
);

const MainTabs = () => {
  const { isDarkMode } = useContext(AppContext);
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'Schedule') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Ranking') iconName = focused ? 'trophy' : 'trophy-outline';
          else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: theme.card, 
          borderTopColor: theme.border,
          height: 65, 
          paddingBottom: 10,
          elevation: 10
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#888',
      })}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Hồ Sơ' }} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} options={{ tabBarLabel: 'Lịch Học' }} />
      <Tab.Screen name="Ranking" component={RankingStackScreen} options={{ tabBarLabel: 'Xếp Hạng' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Cài Đặt' }} />
    </Tab.Navigator>
  );
}

const AppContent = () => {
  const { isLoggedIn } = useContext(AppContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}