import AsyncStorage from '@react-native-async-storage/async-storage';

const REMINDERS_KEY = '@zen_life_reminders';

export const getReminders = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(REMINDERS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading reminders', e);
    return [];
  }
};

export const saveReminders = async (reminders) => {
  try {
    const jsonValue = JSON.stringify(reminders);
    await AsyncStorage.setItem(REMINDERS_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving reminders', e);
  }
};

export const addReminder = async (newReminder) => {
  try {
    const currentReminders = await getReminders();
    const updatedReminders = [...currentReminders, newReminder];
    await saveReminders(updatedReminders);
    return updatedReminders;
  } catch (e) {
    console.error('Error adding reminder', e);
    return [];
  }
};

export const deleteReminder = async (id) => {
  try {
    const currentReminders = await getReminders();
    const updatedReminders = currentReminders.filter((item) => item.id !== id);
    await saveReminders(updatedReminders);
    return updatedReminders;
  } catch (e) {
    console.error('Error deleting reminder', e);
    return [];
  }
};
