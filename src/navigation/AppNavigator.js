import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

// Screens
import AllRemindersScreen from '../screens/AllRemindersScreen';
import TodayScreen from '../screens/TodayScreen';
import DetailScreen from '../screens/DetailScreen';
import SettingsScreen from '../screens/SettingsScreen'; // New Settings Screen

// Icons
import { List, Calendar, Settings as SettingsIcon } from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
        },
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'All') {
            return <List color={color} size={size} />;
          } else if (route.name === 'Today') {
            return <Calendar color={color} size={size} />;
          } else if (route.name === 'Settings') {
            return <SettingsIcon color={color} size={size} />;
          }
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      })}
    >
      <Tab.Screen 
        name="All" 
        component={AllRemindersScreen} 
        options={{ title: t('tabs.all') }}
      />
      <Tab.Screen 
        name="Today" 
        component={TodayScreen} 
        options={{ title: t('tabs.today') }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: t('tabs.settings') }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { colors, isDarkMode } = useTheme();

  const baseTheme = isDarkMode ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
      notification: colors.error,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator>
        <Stack.Screen 
          name="Tabs" 
          component={TabNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
          options={{
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            title: '' // Detail screen has its own title logic or uses custom
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
