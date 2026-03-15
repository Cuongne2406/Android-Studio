import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Colors } from '../theme/Theme';

const GlassCard = ({ children, style, isDarkMode }) => {
  return (
    <View style={[
      styles.card, 
      { 
        backgroundColor: isDarkMode ? 'rgba(45, 52, 54, 0.8)' : 'rgba(255, 255, 255, 0.85)',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      },
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
      }
    }),
  },
});

export default GlassCard;
