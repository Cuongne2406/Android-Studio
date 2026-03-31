import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../theme/Theme';

const GlassCard = ({ children, style, isDarkMode, intensity = 20 }) => {
  const CardContainer = Platform.OS === 'ios' ? BlurView : View;
  
  return (
    <CardContainer 
      intensity={intensity}
      tint={isDarkMode ? 'dark' : 'light'}
      style={[
        styles.card, 
        { 
          backgroundColor: isDarkMode 
            ? 'rgba(15, 23, 42, 0.92)' // More solid navy for better Dark Mode contrast
            : Platform.select({ ios: 'rgba(255, 255, 255, 0.9)', android: '#FFFFFF', default: '#FFFFFF' }), // Solid white on Android/Web to kill white-bars
          borderColor: isDarkMode 
            ? 'rgba(255, 255, 255, 0.08)' 
            : 'rgba(0, 0, 0, 0.05)',
        },
        style
      ]}
    >
      {children}
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 5,
      },
      web: {
        backdropFilter: 'blur(20px)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      }
    }),
  },
});

export default GlassCard;
