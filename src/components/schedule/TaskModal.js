import React, { useState, useEffect } from 'react';
import { 
  Modal, View, Text, StyleSheet, TextInput, 
  TouchableOpacity, Platform, Pressable, KeyboardAvoidingView 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/Theme';
import GlassCard from '../GlassCard';
import { BlurView } from 'expo-blur';

const TaskModal = ({ 
    visible, onClose, onSave, editingTask, 
    isDarkMode, initialDate 
}) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        if (visible) {
            if (editingTask) {
                setTitle(editingTask.title);
                // Correctly handle date/time string parsing if needed
                setDate(new Date(editingTask.date + ' ' + editingTask.time));
            } else {
                setTitle('');
                setDate(initialDate || new Date());
            }
        }
    }, [editingTask, visible, initialDate]);

    const handleSave = () => {
        if (!title.trim()) return;
        onSave({
            title,
            date: date.toDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            completed: editingTask ? editingTask.completed : false
        });
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const newDate = new Date(date);
            newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            setDate(newDate);
            if (Platform.OS === 'android') {
                setTimeout(() => setShowTimePicker(true), 500);
            }
        }
    };

    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const newDate = new Date(date);
            newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
            setDate(newDate);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.sheetContainer}
                >
                    <View style={[
                        styles.sheetBlur, 
                        { 
                            backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
                            borderTopLeftRadius: 32,
                            borderTopRightRadius: 32,
                            borderWidth: 1,
                            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                        }
                    ]}>
                        <View style={styles.header}>
                            <View style={styles.dragBar} />
                            <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#000' }]}>
                                {editingTask ? 'Cập nhật nhiệm vụ' : 'Thêm nhiệm vụ mới'}
                            </Text>
                        </View>

                        <View style={styles.content}>
                            <Text style={[styles.label, { color: isDarkMode ? '#CBD5E1' : '#64748B' }]}>Tên nhiệm vụ</Text>
                            <TextInput
                                style={[styles.input, { color: isDarkMode ? '#FFF' : '#000', backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
                                placeholder="Ví dụ: Nộp bài tập React Native"
                                placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
                                value={title}
                                onChangeText={setTitle}
                                autoFocus
                            />

                            <View style={styles.dateTimeRow}>
                                <TouchableOpacity 
                                    style={styles.pickerBtn}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text style={[styles.label, { marginBottom: 5 }]}>Ngày thực hiện</Text>
                                    <View style={[styles.pickerBox, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                                        <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
                                        <Text style={[styles.pickerText, { color: isDarkMode ? '#FFF' : '#000' }]}>
                                            {date.toLocaleDateString('vi-VN')}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={styles.pickerBtn}
                                    onPress={() => setShowTimePicker(true)}
                                >
                                    <Text style={[styles.label, { marginBottom: 5 }]}>Giờ thực hiện</Text>
                                    <View style={[styles.pickerBox, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                                        <Ionicons name="time-outline" size={20} color={Colors.secondary} />
                                        <Text style={[styles.pickerText, { color: isDarkMode ? '#FFF' : '#000' }]}>
                                            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity 
                                style={[styles.saveBtn, { backgroundColor: Colors.primary }]}
                                onPress={handleSave}
                            >
                                <Text style={styles.saveBtnText}>{editingTask ? 'Lưu thay đổi' : 'Tạo nhiệm vụ'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                                <Text style={[styles.cancelBtnText, { color: isDarkMode ? '#64748B' : '#94A3B8' }]}>Bỏ qua</Text>
                            </TouchableOpacity>
                        </View>

                        {(showDatePicker || showTimePicker) && (
                            <DateTimePicker
                                value={date}
                                mode={showDatePicker ? 'date' : 'time'}
                                is24Hour={true}
                                display="default"
                                onChange={showDatePicker ? onDateChange : onTimeChange}
                            />
                        )}
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    sheetContainer: { width: '100%', borderTopLeftRadius: 40, borderTopRightRadius: 40, overflow: 'hidden' },
    sheetBlur: { padding: 25, paddingBottom: Platform.OS === 'ios' ? 40 : 25 },
    header: { alignItems: 'center', marginBottom: 25 },
    dragBar: { width: 40, height: 4, backgroundColor: '#CBD5E1', borderRadius: 2, marginBottom: 15 },
    title: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
    content: { width: '100%' },
    label: { fontSize: 13, fontWeight: '800', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: { height: 56, borderRadius: 16, paddingHorizontal: 16, fontSize: 16, fontWeight: '600', marginBottom: 20 },
    dateTimeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    pickerBtn: { width: '48%' },
    pickerBox: { flexDirection: 'row', alignItems: 'center', height: 50, borderRadius: 14, paddingHorizontal: 12 },
    pickerText: { marginLeft: 10, fontSize: 14, fontWeight: '700' },
    saveBtn: { height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', elevation: 5 },
    saveBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
    cancelBtn: { marginTop: 15, paddingVertical: 10, alignItems: 'center' },
    cancelBtnText: { fontSize: 15, fontWeight: '700' }
});

export default TaskModal;
