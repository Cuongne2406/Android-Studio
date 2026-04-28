import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Colors, Typography, Spacing } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../config/api';

import WebLayout from '../components/WebLayout';

export default function AIScreen({ navigation }) {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Greeting, Operator. I am Lumina AI. Neural pathways are stable. How can I assist with your command today?', isBot: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef();
  
  const theme = Colors.dark; 
  const isDarkMode = true;

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newUserMessage = { id: Date.now().toString(), text: inputText, isBot: false };
    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/ai/chat`, { message: newUserMessage.text });
      const botMessage = { id: (Date.now() + 1).toString(), text: response.data.reply, isBot: true };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { id: (Date.now() + 1).toString(), text: 'Xin lỗi, hiện tại mình không thể trả lời. Hãy thử lại sau nhé!', isBot: true };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubble, item.isBot ? [styles.botBubble, { backgroundColor: theme.card }] : [styles.userBubble, { backgroundColor: Colors.primary }]]}>
      <Text style={[styles.messageText, { color: item.isBot ? theme.text : '#fff' }]}>{item.text}</Text>
    </View>
  );

  const content = (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: theme.background }]} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <Ionicons name="sparkles-outline" size={24} color={Colors.primary} />
        <Text style={[styles.headerTitle, { color: theme.text }]}> Lumina AI Core</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={[styles.inputContainer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <TextInput
          style={[styles.input, { color: theme.text, backgroundColor: theme.input, borderColor: theme.border }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Enter system command..."
          placeholderTextColor={theme.subText}
          multiline
        />
        <TouchableOpacity style={[styles.sendButton, { backgroundColor: inputText.trim() ? Colors.primary : theme.subText }]} onPress={sendMessage} disabled={!inputText.trim() || loading}>
          {loading ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="send" size={20} color="#fff" />}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  return Platform.OS === 'web' ? (
    <WebLayout navigation={navigation} activeRoute="Lumina AI">
        {content}
    </WebLayout>
  ) : content;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingTop: 60, paddingBottom: 15,
    borderBottomWidth: 1,
  },
  headerTitle: { ...Typography.title, fontWeight: 'bold' },
  chatContainer: { padding: Spacing.m, paddingBottom: Spacing.xl },
  messageBubble: {
    maxWidth: '80%', padding: 15, borderRadius: 20, marginBottom: 10,
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05,
  },
  botBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 5 },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 5 },
  messageText: { ...Typography.body },
  inputContainer: {
    flexDirection: 'row', padding: 10, paddingBottom: 20,
    borderTopWidth: 1, alignItems: 'center',
  },
  input: {
    flex: 1, borderWidth: 1, borderRadius: 20,
    paddingHorizontal: 15, paddingTop: 10, paddingBottom: 10,
    maxHeight: 100, minHeight: 45,
  },
  sendButton: {
    width: 45, height: 45, borderRadius: 22.5,
    justifyContent: 'center', alignItems: 'center', marginLeft: 10,
  }
});
