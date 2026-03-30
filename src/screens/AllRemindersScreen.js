import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import ReminderCard from '../components/ReminderCard';
import AddReminderModal from '../components/AddReminderModal';
import HorizontalCalendar from '../components/HorizontalCalendar';
import { getReminders, addReminder, deleteReminder } from '../utils/storage';
import { SIZES, SHADOWS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function AllRemindersScreen({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  const [reminders, setReminders] = useState([]);
  const [filteredReminders, setFilteredReminders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const applyFilter = (allReminders, targetDate) => {
    if (!targetDate) {
      setFilteredReminders(allReminders.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp)));
      return;
    }
    const filtered = allReminders.filter((item) => {
      const itemDate = new Date(item.timestamp);
      return (
        itemDate.getDate() === targetDate.getDate() &&
        itemDate.getMonth() === targetDate.getMonth() &&
        itemDate.getFullYear() === targetDate.getFullYear()
      );
    });
    setFilteredReminders(filtered.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp)));
  };

  const loadReminders = useCallback(async () => {
    const data = await getReminders();
    setReminders(data);
    applyFilter(data, selectedDate);
    setLoading(false);
  }, [selectedDate]);

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

  useEffect(() => {
    applyFilter(reminders, selectedDate);
  }, [selectedDate, reminders]);

  const handleSaveReminder = async (newReminder) => {
    const updated = await addReminder(newReminder);
    setReminders(updated);
    setModalVisible(false);
  };

  const handleDeleteReminder = async (id) => {
    await deleteReminder(id);
    loadReminders();
  };

  const isPastDate = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    return target < today;
  };

  const existingTitles = [...new Set(reminders.map(r => r.title))];

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HorizontalCalendar 
        selectedDate={selectedDate} 
        onDateSelect={(date) => setSelectedDate(date)} 
      />
      
      <FlatList
        data={filteredReminders}
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
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>{t('home.empty')}</Text>
        }
      />

      {!isPastDate(selectedDate) && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Plus color="white" size={32} />
        </TouchableOpacity>
      )}

      <AddReminderModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveReminder}
        existingTitles={existingTitles}
        initialDate={selectedDate || new Date()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: SIZES.xxl,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: SIZES.xl,
    right: SIZES.lg,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
});
