import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const setupNotifications = async () => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    
    return finalStatus === 'granted';
};

export const sendLocalNotification = async (title, body, data = {}) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data,
        },
        trigger: null, // send immediately
    });
};
