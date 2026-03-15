import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Animated, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../theme/Theme';

const { width } = Dimensions.get('window');

const Toast = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success'); // success, error, info
  
  const opacity = useState(new Animated.Value(0))[0];
  const translateY = useState(new Animated.Value(-50))[0];

  useImperativeHandle(ref, () => ({
    show: (msg, toastType = 'success') => {
      setMessage(msg);
      setType(toastType);
      setVisible(true);
      
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 50, duration: 300, useNativeDriver: true })
      ]).start();

      setTimeout(() => {
        hide();
      }, 3000);
    }
  }));

  const hide = () => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -50, duration: 300, useNativeDriver: true })
    ]).start(() => setVisible(false));
  };

  if (!visible) return null;

  const bgColor = type === 'success' ? Colors.success : type === 'error' ? Colors.danger : Colors.primary;

  return (
    <Animated.View style={[
        styles.container, 
        { backgroundColor: bgColor, opacity, transform: [{ translateY }] }
    ]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 10,
  },
  text: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center'
  }
});

export default Toast;
