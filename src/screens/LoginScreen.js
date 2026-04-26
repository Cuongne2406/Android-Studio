import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setToken } from '../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Typography, Spacing } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../config/api';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();

  const handleAuth = async () => {
    try {
      const endpoint = isLogin ? `${API_URL}/auth/login` : `${API_URL}/auth/register`;
      const payload = isLogin ? { email, password } : { name, email, password };
      const response = await axios.post(endpoint, payload);
      
      const { token } = response.data;
      await AsyncStorage.setItem('userToken', token);
      dispatch(setToken(token));
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={80} color={Colors.primary} />
            <Text style={styles.appName}>GreenSpace</Text>
            <Text style={styles.appSlogan}>Mang thiên nhiên vào ngôi nhà của bạn</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>{isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Tên của bạn"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleAuth}>
            <Text style={styles.buttonText}>{isLogin ? 'Bắt đầu ngay' : 'Đăng ký'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}>
            <Text style={styles.switchText}>
              {isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
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
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  appName: {
    ...Typography.header,
    fontSize: 32,
    color: Colors.primary,
    marginTop: 10,
  },
  appSlogan: {
    ...Typography.body,
    color: Colors.light.subText,
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: Spacing.xl,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  title: {
    ...Typography.title,
    fontSize: 24,
    marginBottom: Spacing.l,
    textAlign: 'center',
    color: Colors.light.text,
  },
  input: {
    backgroundColor: '#F9F6F0',
    borderRadius: 12,
    padding: 15,
    marginBottom: Spacing.m,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E8E4DB',
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Spacing.m,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: Spacing.l,
    alignItems: 'center',
  },
  switchText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '600'
  },
  errorText: {
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: Spacing.m,
  }
});
