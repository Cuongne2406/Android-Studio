import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Globe, Moon, Trash2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { SIZES, SHADOWS } from '../constants/theme';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme, colors } = useTheme();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(nextLang);
  };

  const clearAllData = () => {
    Alert.alert(
      t('settings.clearConfirmTitle'),
      t('settings.clearConfirmMsg'),
      [
        { text: t('settings.cancel'), style: 'cancel' },
        { 
          text: t('settings.delete'), 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.setItem('@zen_life_reminders', JSON.stringify([]));
            Alert.alert('Success', 'All reminders cleared.');
          }
        }
      ]
    );
  };

  // Dynamic styles based on theme
  const dynamicStyles = {
    container: { backgroundColor: colors.background },
    text: { color: colors.text },
    textMuted: { color: colors.textMuted },
    card: { backgroundColor: colors.cardBackground, borderBottomColor: colors.border },
    sectionTitle: { color: colors.primary }
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      
      <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('settings.appearance')}</Text>
      <View style={[styles.card, dynamicStyles.card]}>
        <View style={styles.row}>
          <View style={styles.iconText}>
            <Moon color={colors.text} size={24} />
            <Text style={[styles.label, dynamicStyles.text]}>{t('settings.darkMode')}</Text>
          </View>
          <Switch 
            value={isDarkMode} 
            onValueChange={toggleTheme} 
            trackColor={{ false: '#cbd5e1', true: colors.primaryLight }}
            thumbColor={isDarkMode ? colors.primary : '#f8fafc'}
          />
        </View>
      </View>

      <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('settings.language')}</Text>
      <View style={[styles.card, dynamicStyles.card]}>
        <View style={styles.row}>
          <View style={styles.iconText}>
            <Globe color={colors.text} size={24} />
            <Text style={[styles.label, dynamicStyles.text]}>{t('settings.language')}</Text>
          </View>
          <TouchableOpacity onPress={toggleLanguage} style={styles.langBtn}>
            <Text style={styles.langBtnText}>{i18n.language === 'en' ? 'English' : 'Tiếng Việt'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle, { color: colors.error, marginTop: SIZES.xl }]}>
        {t('settings.dangerZone')}
      </Text>
      <View style={[styles.card, dynamicStyles.card]}>
        <TouchableOpacity style={styles.row} onPress={clearAllData}>
          <View style={styles.iconText}>
            <Trash2 color={colors.error} size={24} />
            <Text style={[styles.label, { color: colors.error }]}>{t('settings.clearAll')}</Text>
          </View>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: SIZES.sm,
    marginTop: SIZES.lg,
    letterSpacing: 1,
  },
  card: {
    borderRadius: SIZES.radius,
    padding: SIZES.md,
    ...SHADOWS.softLight,
    shadowOpacity: 0.05,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  langBtn: {
    backgroundColor: '#6366F120', // primary with 20% opacity
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius,
  },
  langBtnText: {
    color: '#6366F1', // primary
    fontWeight: '700',
  }
});
