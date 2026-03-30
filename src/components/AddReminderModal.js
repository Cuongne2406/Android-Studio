import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { Calendar, X, AlertCircle } from 'lucide-react-native';
import { SIZES, SHADOWS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function AddReminderModal({ visible, onClose, onSave, existingTitles, initialDate }) {
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [priority, setPriority] = useState('low'); // low, medium, high
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      const targetDate = initialDate ? new Date(initialDate) : new Date();
      const today = new Date();
      
      // If targetDate is a future day, initialize Date with targetDate + current hour/min so it feels native
      if (
        targetDate.getFullYear() > today.getFullYear() ||
        (targetDate.getFullYear() === today.getFullYear() && targetDate.getMonth() > today.getMonth()) ||
        (targetDate.getFullYear() === today.getFullYear() && targetDate.getMonth() === today.getMonth() && targetDate.getDate() > today.getDate())
      ) {
        targetDate.setHours(today.getHours());
        targetDate.setMinutes(today.getMinutes() + 5); 
        setDate(targetDate);
      } else {
        setDate(new Date());
      }

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim, initialDate]);

  const handleTitleChange = (text) => {
    setTitle(text);
    if (text.length > 0) {
      const filtered = existingTitles.filter(tItem => 
        tItem.toLowerCase().includes(text.toLowerCase()) && tItem !== text
      );
      setSuggestions([...new Set(filtered)]);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion) => {
    setTitle(suggestion);
    setSuggestions([]);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const newReminder = {
      id: Date.now().toString(),
      title: title.trim(),
      timestamp: date.toISOString(),
      priority,
    };
    onSave(newReminder);
    
    // Reset form
    setTitle('');
    setDate(new Date());
    setSuggestions([]);
    setPriority('low');
  };

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        mode: 'date',
        minimumDate: new Date(),
        onChange: (event, selectedDate) => {
          if (event.type === 'set' && selectedDate) {
            setDate(selectedDate);
            DateTimePickerAndroid.open({
              value: selectedDate,
              mode: 'time',
              is24Hour: true,
              onChange: (timeEvent, selectedTime) => {
                if (timeEvent.type === 'set' && selectedTime) {
                  const finalDate = new Date(selectedDate);
                  finalDate.setHours(selectedTime.getHours());
                  finalDate.setMinutes(selectedTime.getMinutes());
                  setDate(finalDate);
                }
              }
            });
          }
        },
      });
    } else {
      setShowPicker(true);
    }
  };

  const isPast = date < new Date();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <BlurView intensity={isDarkMode ? 40 : 20} tint={isDarkMode ? "dark" : "light"} style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.background }, isDarkMode ? SHADOWS.softDark : SHADOWS.softLight]}>
            <View style={styles.header}>
              <Text style={[styles.titleText, { color: colors.text }]}>{t('modal.title')}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X color={colors.textMuted} size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.textMuted }]}>{t('modal.what')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.text, borderColor: colors.border }]}
                placeholder={t('modal.placeholder')}
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={handleTitleChange}
              />
              
              {suggestions.length > 0 && (
                <View style={[styles.suggestionsContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                  {suggestions.map((item, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={[styles.suggestionItem, { borderBottomColor: colors.border }]}
                      onPress={() => selectSuggestion(item)}
                    >
                      <Text style={[styles.suggestionText, { color: colors.text }]}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.textMuted }]}>{t('modal.when')}</Text>
              <TouchableOpacity 
                style={[styles.dateSelector, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                onPress={openDatePicker}
              >
                <Calendar color={colors.primary} size={20} />
                <Text style={[styles.dateText, { color: colors.text }, isPast && { color: colors.error }]}>
                  {date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </Text>
              </TouchableOpacity>
              {isPast && (
                <Text style={[styles.errorText, { color: colors.error }]}>{t('modal.errorPast')}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.textMuted }]}>{t('priority.label')}</Text>
              <View style={styles.prioritySelector}>
                {['low', 'medium', 'high'].map((pLevel) => {
                  const isActive = priority === pLevel;
                  const getPriorityColor = () => {
                    if (pLevel === 'low') return colors.success;
                    if (pLevel === 'medium') return colors.warning;
                    return colors.error;
                  };
                  const pColor = getPriorityColor();
                  return (
                    <TouchableOpacity
                      key={pLevel}
                      style={[
                        styles.priorityBtn,
                        { borderColor: colors.border },
                        isActive && { backgroundColor: pColor + '20', borderColor: pColor }
                      ]}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setPriority(pLevel);
                      }}
                    >
                      <View style={[styles.priorityDot, { backgroundColor: pColor }]} />
                      <Text style={[styles.priorityText, { color: isActive ? pColor : colors.text }]}>
                        {t(`priority.${pLevel}`)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {Platform.OS === 'ios' && showPicker && (
              <DateTimePicker
                value={date}
                minimumDate={new Date()}
                mode="datetime"
                display="spinner"
                themeVariant={isDarkMode ? "dark" : "light"}
                onChange={(event, selectedDate) => {
                  setShowPicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}

            <TouchableOpacity 
              style={[styles.saveBtn, { backgroundColor: colors.primary }, (!title.trim() || isPast) && { backgroundColor: colors.primaryLight }]}
              onPress={handleSave}
              disabled={!title.trim() || isPast}
            >
              <Text style={styles.saveBtnText}>{t('modal.save')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  keyboardView: {
    width: '100%',
  },
  modalContent: {
    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: SIZES.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : SIZES.lg,
    ...SHADOWS.soft,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeBtn: {
    padding: SIZES.sm,
  },
  inputContainer: {
    marginBottom: SIZES.lg,
    zIndex: 1, // for suggestions overlay if needed
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SIZES.sm,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    fontSize: 16,
    borderWidth: 1,
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    borderRadius: SIZES.radius,
    marginTop: SIZES.xs,
    borderWidth: 1,
    maxHeight: 120,
  },
  suggestionItem: {
    padding: SIZES.md,
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 14,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    borderWidth: 1,
    gap: SIZES.sm,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveBtn: {
    borderRadius: SIZES.radius,
    padding: SIZES.md,
    alignItems: 'center',
    marginTop: SIZES.md,
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 12,
    marginTop: SIZES.xs,
    fontWeight: '500',
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  priorityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.sm,
    gap: SIZES.xs,
    borderWidth: 1,
    borderRadius: SIZES.radius,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
