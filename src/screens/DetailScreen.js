import React from 'react';
import { View, Text, StyleSheet, Share, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Share as ShareIcon, Trash2, ArrowLeft, CalendarClock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { deleteReminder } from '../utils/storage';
import { SIZES, SHADOWS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function DetailScreen({ route, navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();
  const { reminder } = route.params;

  const dateObj = new Date(reminder.timestamp);
  const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = dateObj.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const onShare = async () => {
    try {
      const message = `${t('detail.sharePrefix')} ${reminder.title}\n${t('detail.shareTime')} ${timeString}\n${t('detail.shareDate')} ${dateString}\n\n${t('detail.shareSuffix')}`;
      await Share.share({
        message,
        title: 'Zen Life Reminder',
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const onDelete = async () => {
    await deleteReminder(reminder.id);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient 
        colors={[colors.primaryLight, colors.background]} 
        style={styles.headerGradient}
      >
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        
        <View style={[styles.iconWrapper, isDarkMode ? SHADOWS.softDark : SHADOWS.softLight, { backgroundColor: colors.cardBackground }]}>
          <CalendarClock size={48} color={colors.primary} strokeWidth={1.5} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{reminder.title}</Text>
        
        <View style={[styles.infoBox, isDarkMode ? SHADOWS.softDark : SHADOWS.softLight, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{t('detail.time')}</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{timeString}</Text>
          </View>
          <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{t('detail.date')}</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{dateString}</Text>
          </View>
        </View>

      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.cardBackground, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Trash2 color={colors.error} size={20} />
          <Text style={[styles.deleteText, { color: colors.error }]}>{t('detail.delete')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.shareBtn, { backgroundColor: colors.primary }]} onPress={onShare}>
          <ShareIcon color="white" size={20} />
          <Text style={styles.shareText}>{t('detail.share')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: SIZES.xl,
    paddingHorizontal: SIZES.lg,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: SIZES.lg,
    padding: SIZES.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.md,
  },
  content: {
    padding: SIZES.lg,
    paddingTop: SIZES.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SIZES.xl,
  },
  infoBox: {
    borderRadius: SIZES.radius,
    padding: SIZES.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoDivider: {
    height: 1,
    marginVertical: SIZES.sm, // fixed 'myRowMargin' typo here to marginVertical
  },
  footer: {
    flexDirection: 'row',
    padding: SIZES.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : SIZES.lg,
    gap: SIZES.md,
    borderTopWidth: 1,
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.sm,
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    backgroundColor: '#FEE2E2', // Light red usually looks ok in both modes or we can dim it
  },
  deleteText: {
    fontWeight: '700',
    fontSize: 16,
  },
  shareBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.sm,
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    ...SHADOWS.softLight,
  },
  shareText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
