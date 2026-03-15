import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Colors } from '../theme/Theme';

const ScreenHeader = ({ title, subtitle, rightElement, theme, isDarkMode }) => {
  return (
    <View style={[
      styles.header, 
      { 
        backgroundColor: theme.card,
        elevation: isDarkMode ? 4 : 8,
        shadowOpacity: isDarkMode ? 0.2 : 0.15,
      }
    ]}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.text, fontWeight: '900' }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: isDarkMode ? theme.subText : '#2D3748', fontWeight: '700' }]}>
                {subtitle}
            </Text>
          )}
        </View>
        {rightElement && (
          <View style={styles.rightAction}>
            {rightElement}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight + 20,
    paddingBottom: 20,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 15,
    zIndex: 10,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  rightAction: {
    marginLeft: 15,
  },
});

export default ScreenHeader;
