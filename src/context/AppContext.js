import React, { createContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(true);

  const triggerHaptic = (type = 'selection') => {
    if (Platform.OS === 'web') return;
    try {
        if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        else if (type === 'error') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        else if (type === 'warning') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
  };

  return (
    <AppContext.Provider value={{
      triggerHaptic,
    }}>
      {children}
    </AppContext.Provider>
  );
};
