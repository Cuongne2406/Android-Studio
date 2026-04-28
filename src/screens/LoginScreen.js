import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setToken } from '../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Typography, Spacing } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../config/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const theme = Colors.dark; // Force dark theme for VIP login experience
  const isDarkMode = true;

  const handleAuth = async () => {
    try {
      const endpoint = isLogin ? `${API_URL}/auth/login` : `${API_URL}/auth/register`;
      const payload = isLogin ? { email, password } : { name, email, password };
      const response = await axios.post(endpoint, payload);
      
      const { token } = response.data;
      await AsyncStorage.setItem('userToken', token);
      dispatch(setToken(token));
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={[Colors.primary + '20', 'transparent']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
            <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                style={styles.logoIcon}
            >
                <Ionicons name="sparkles" size={40} color="#fff" />
            </LinearGradient>
            <Text style={[styles.appName, { color: theme.text }]}>Zenith AI Gateway</Text>
            <Text style={[styles.appSlogan, { color: theme.subText }]}>Neural Command Center Interface</Text>
        </View>

        <View style={[styles.formContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>{isLogin ? 'SYSTEM ACCESS' : 'NODE INITIALIZATION'}</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {!isLogin && (
            <TextInput
              style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
              placeholder="Commander Name"
              placeholderTextColor={theme.subText}
              value={name}
              onChangeText={setName}
            />
          )}
          
          <TextInput
            style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
            placeholder="Email Address"
            placeholderTextColor={theme.subText}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
            placeholder="Security Code"
            placeholderTextColor={theme.subText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity onPress={handleAuth}>
            <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text style={styles.buttonText}>{isLogin ? 'Authenticate' : 'Initialize'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}>
            <Text style={[styles.switchText, { color: Colors.primary }]}>
              {isLogin ? "Don't have an account? Sign up" : 'Already registered? Log in'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  appName: {
    ...Typography.header,
    fontSize: 36,
    letterSpacing: 1,
  },
  appSlogan: {
    ...Typography.body,
    marginTop: 5,
    opacity: 0.8,
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: Spacing.xl,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  title: {
    ...Typography.title,
    fontSize: 24,
    marginBottom: Spacing.l,
    textAlign: 'center',
  },
  input: {
    borderRadius: 16,
    padding: 15,
    marginBottom: Spacing.m,
    fontSize: 16,
    borderWidth: 1,
  },
  button: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: Spacing.m,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  switchButton: {
    marginTop: Spacing.l,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    fontWeight: '600'
  },
  errorText: {
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: Spacing.m,
  }
});
