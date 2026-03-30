import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
} from 'react-native';
import ReminderCard from '../components/ReminderCard';
import { getReminders, deleteReminder } from '../utils/storage';
import { SIZES } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function TodayScreen({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReminders = useCallback(async () => {
    const data = await getReminders();
    
    // Filter strictly for today
    const today = new Date();
    const todayData = data.filter(item => {
      const itemDate = new Date(item.timestamp);
      return (
        itemDate.getDate() === today.getDate() &&
        itemDate.getMonth() === today.getMonth() &&
        itemDate.getFullYear() === today.getFullYear()
      );
    });
    
    // Sort by chronological time today
    todayData.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    setReminders(todayData);
    setLoading(false);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadReminders();
    setRefreshing(false);
  }, [loadReminders]);

  useEffect(() => {
    loadReminders();
    const unsubscribe = navigation.addListener('focus', () => {
      loadReminders();
    });
    return unsubscribe;
  }, [navigation, loadReminders]);

  const handleDeleteReminder = async (id) => {
    await deleteReminder(id);
    loadReminders();
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        renderItem={({ item, index }) => (
          <ReminderCard
            item={item}
            index={index}
            onPress={() => navigation.navigate('Detail', { reminder: item })}
            onDelete={handleDeleteReminder}
          />
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            No reminders scheduled for today.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: SIZES.sm,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: SIZES.xxl,
    fontSize: 16,
  },
});
