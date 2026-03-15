import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/Theme';

const PremiumInput = ({ label, icon, value, onChangeText, placeholder, secureTextEntry, isDarkMode, containerStyle }) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: theme.subText }]}>{label}</Text>}
      <View style={[styles.inputWrapper, { backgroundColor: theme.input, borderColor: theme.border }]}>
        {icon && <Ionicons name={icon} size={20} color={theme.subText} style={styles.icon} />}
        <TextInput
          style={[styles.input, { color: theme.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.subText}
          secureTextEntry={secureTextEntry}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', marginBottom: 15 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginLeft: 4, letterSpacing: 0.5 },
  inputWrapper: {
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16 },
});

export default PremiumInput;
