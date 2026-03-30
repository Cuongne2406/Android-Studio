import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SIZES, SHADOWS } from '../constants/theme';
import * as Haptics from 'expo-haptics';

export default function HorizontalCalendar({ selectedDate, onDateSelect }) {
  const { colors, isDarkMode } = useTheme();
  const [dates, setDates] = useState([]);

  useEffect(() => {
    // Generate dates: 2 days ago to 14 days ahead
    const tempDates = [];
    const today = new Date();
    
    // Add "All" option at the beginning
    tempDates.push({ id: 'all', dayStr: 'All' });

    for (let i = -2; i <= 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      tempDates.push({
        id: d.toISOString().split('T')[0],
        dateObj: d,
        dayStr: d.getDate().toString(),
        weekday: d.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    setDates(tempDates);
  }, []);

  const handleSelect = (item) => {
    Haptics.selectionAsync();
    onDateSelect(item.id === 'all' ? null : item.dateObj);
  };

  const renderItem = ({ item }) => {
    // Check if selected
    let isSelected = false;
    if (item.id === 'all' && selectedDate === null) {
      isSelected = true;
    } else if (selectedDate && item.id !== 'all') {
      const selStr = selectedDate.toISOString().split('T')[0];
      if (selStr === item.id) isSelected = true;
    }

    // Check if today
    const todayStr = new Date().toISOString().split('T')[0];
    const isToday = item.id === todayStr;

    return (
      <TouchableOpacity
        style={[
          styles.dateCard,
          { backgroundColor: isSelected ? colors.primary : colors.cardBackground },
          isDarkMode ? SHADOWS.softDark : SHADOWS.softLight,
          !isSelected && { borderWidth: 1, borderColor: colors.border }
        ]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dayText, 
          { color: isSelected ? 'white' : colors.textMuted }
        ]}>
          {item.weekday || '🔥'}
        </Text>
        <Text style={[
          styles.dateText, 
          { color: isSelected ? 'white' : colors.text },
          isSelected && { fontWeight: '800' }
        ]}>
          {item.dayStr}
        </Text>
        {isToday && !isSelected && (
          <View style={[styles.todayIndicator, { backgroundColor: colors.primary }]} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dates}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    marginBottom: SIZES.sm,
  },
  listContent: {
    paddingHorizontal: SIZES.sm,
    alignItems: 'center',
    gap: SIZES.sm,
  },
  dateCard: {
    width: 60,
    height: 70,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '700',
  },
  todayIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    bottom: 6,
  }
});
