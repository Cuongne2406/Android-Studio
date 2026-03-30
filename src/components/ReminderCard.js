import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Clock, Trash2 } from 'lucide-react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { SIZES, SHADOWS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function ReminderCard({ item, onPress, onDelete, index = 0 }) {
  const { colors, isDarkMode } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const swipeableRef = useRef(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  const dateObj = new Date(item.timestamp);
  const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getPriorityColor = (p) => {
    if (p === 'high') return colors.error;
    if (p === 'medium') return colors.warning;
    return colors.success; // Default or low
  };
  const pColor = getPriorityColor(item.priority || 'low');

  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity 
        style={[styles.deleteAction, { backgroundColor: colors.error }]} 
        onPress={() => {
          swipeableRef.current?.close();
          if (onDelete) onDelete(item.id);
        }}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Trash2 color="white" size={28} />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        isDarkMode ? SHADOWS.softDark : SHADOWS.softLight,
        { 
          opacity: fadeAnim, 
          transform: [{ translateY: slideAnim }] 
        }
      ]}
    >
      <Swipeable 
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}
        containerStyle={styles.swipeableContainer}
        childrenContainerStyle={{ flex: 1, width: '100%', height: '100%' }}
      >
        <TouchableOpacity 
          style={[styles.touchable, { backgroundColor: colors.surface }]} 
          activeOpacity={0.8}
          onPress={onPress}
        >
          <View style={[styles.blurContainer, { backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.95)' }]}>
            <View style={styles.header}>
              <Clock size={20} color={colors.primary} strokeWidth={2.5} />
              <Text style={[styles.time, { color: colors.primary }]}>{timeString}</Text>
            </View>
            <View style={styles.titleRow}>
              <View style={[styles.priorityIndicator, { backgroundColor: pColor }]} />
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: SIZES.sm,
    height: 120,
    borderRadius: SIZES.radius,
  },
  touchable: {
    flex: 1,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  blurContainer: {
    flex: 1,
    padding: SIZES.md,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SIZES.xs,
    paddingRight: SIZES.sm,
  },
  priorityIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  swipeableContainer: {
    flex: 1,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
});
