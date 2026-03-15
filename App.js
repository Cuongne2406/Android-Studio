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
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { isDarkMode } = useContext(AppContext);
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <Tab.Navigator 
      initialRouteName="ProfileTab"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'RankingTab') iconName = focused ? 'trophy' : 'trophy-outline';
          else if (route.name === 'SettingsTab') iconName = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: theme.card, 
          borderTopColor: theme.border,
          height: 60,
          paddingBottom: 8
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: theme.subText,
      })}
    >
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: "Hồ Sơ" }} />
      <Tab.Screen name="RankingTab" component={RankingScreen} options={{ title: "Xếp Hạng" }} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} options={{ title: "Cài Đặt" }} />
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