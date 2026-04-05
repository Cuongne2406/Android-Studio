import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, 
  TouchableOpacity, KeyboardAvoidingView, Platform, 
  ActivityIndicator, Image 
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Colors } from '../theme/Theme';
import apiClient from '../api/client';
import GlassCard from '../components/GlassCard';
import ScreenHeader from '../components/ScreenHeader';

const AIScreen = () => {
    const [messages, setMessages] = useState([
        { id: '1', text: 'Chào bạn! Mình là LHU AI, trợ lý hỗ trợ học tập của bạn. Bạn cần giúp gì không?', isAI: true }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const { isDarkMode } = useSelector(state => state.ui);
    const { profileData } = useSelector(state => state.auth);
    const { tasks } = useSelector(state => state.tasks);
    
    const theme = isDarkMode ? Colors.dark : Colors.light;
    const flatListRef = useRef(null);

    const handleSend = async () => {
        if (!inputText.trim()) return;
        
        const userMsg = { id: Date.now().toString(), text: inputText, isAI: false };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            const context = {
                studentName: profileData.name,
                major: profileData.major,
                avgPoint: profileData.avgPoint,
                recentTasks: tasks.slice(0, 3)
            };

            const { data } = await apiClient.post('/ai/chat', { 
                message: inputText, 
                context 
            });

            const aiMsg = { id: (Date.now() + 1).toString(), text: data.reply, isAI: true };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg = { id: (Date.now() + 1).toString(), text: "Xin lỗi, mình đang gặp chút trục trặc kỹ thuật. Thử lại sau nhé!", isAI: true };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    useEffect(() => {
        if (flatListRef.current) {
            setTimeout(() => flatListRef.current.scrollToEnd({ animated: true }), 100);
        }
    }, [messages, isTyping]);

    const renderMessage = ({ item }) => (
        <Animated.View entering={item.isAI ? FadeInDown : FadeInDown.delay(100)} style={[
            styles.messageWrapper, 
            item.isAI ? styles.aiWrapper : styles.userWrapper
        ]}>
            <View style={[
                styles.messageBubble, 
                item.isAI ? [styles.aiBubble, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' }] : [styles.userBubble, { backgroundColor: Colors.primary }]
            ]}>
                <Text style={[styles.messageText, { color: item.isAI ? theme.text : '#FFF' }]}>{item.text}</Text>
            </View>
        </Animated.View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <ScreenHeader title="Trợ Lý AI" subtitle="Hỗ trợ 24/7" theme={theme} isDarkMode={isDarkMode} />
            
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.listContent}
                ListFooterComponent={() => isTyping && (
                    <View style={styles.typingContainer}>
                        <ActivityIndicator size="small" color={Colors.primary} />
                        <Text style={[styles.typingText, { color: theme.subText }]}>AI đang suy nghĩ...</Text>
                    </View>
                )}
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
                <GlassCard intensity={30} isDarkMode={isDarkMode} style={styles.inputArea}>
                    <TextInput 
                        style={[styles.input, { color: theme.text }]}
                        placeholder="Hỏi AI về bài tập, điểm số..."
                        placeholderTextColor={theme.subText}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                        <Ionicons name="send" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                </GlassCard>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    listContent: { padding: 20, paddingBottom: 40 },
    messageWrapper: { marginBottom: 15, maxWidth: '85%' },
    aiWrapper: { alignSelf: 'flex-start' },
    userWrapper: { alignSelf: 'flex-end' },
    messageBubble: { padding: 15, borderRadius: 20 },
    aiBubble: { borderBottomLeftRadius: 5 },
    userBubble: { borderBottomRightRadius: 5 },
    messageText: { fontSize: 16, lineHeight: 22, fontWeight: '500' },
    inputArea: { flexDirection: 'row', alignItems: 'center', margin: 20, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 25 },
    input: { flex: 1, fontSize: 16, maxHeight: 100 },
    sendBtn: { marginLeft: 15, padding: 5 },
    typingContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginBottom: 20 },
    typingText: { marginLeft: 10, fontSize: 13, fontWeight: '600' }
});

export default AIScreen;
