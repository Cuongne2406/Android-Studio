import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import GlassCard from '../GlassCard';
import PremiumInput from '../PremiumInput';
import PremiumButton from '../PremiumButton';
import { Colors } from '../../theme/Theme';

const TaskModal = ({ 
  visible, onClose, onSave, 
  taskTitle, setTaskTitle, 
  date, setDate,
  isDarkMode, theme, editingTask,
  showDatePicker, setShowDatePicker,
  showTimePicker, setShowTimePicker
}) => {
  
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) setDate(selectedTime);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
            <GlassCard isDarkMode={isDarkMode} style={styles.modalContent}>
                <View style={styles.sheetHeader}>
                    <View style={styles.sheetDrag} />
                    <Text style={[styles.modalTitle, { color: theme.text }]}>
                        {editingTask ? "Sửa Công Việc" : "Thêm Công Việc Mới"}
                    </Text>
                </View>
                
                <View style={styles.formContainer}>
                    <PremiumInput 
                        label="Tên công việc"
                        placeholder="Ví dụ: Học React Native..."
                        value={taskTitle}
                        onChangeText={setTaskTitle}
                        isDarkMode={isDarkMode}
                    />

                    <View style={styles.pickerRow}>
                        <TouchableOpacity 
                            style={[styles.pickerBtn, { backgroundColor: theme.border + '30' }]} 
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Ionicons name="calendar" size={20} color={Colors.primary} />
                            <Text style={[styles.pickerBtnText, { color: theme.text }]}>
                                {date.toLocaleDateString('vi-VN')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.pickerBtn, { backgroundColor: theme.border + '30' }]} 
                            onPress={() => setShowTimePicker(true)}
                        >
                            <Ionicons name="time" size={20} color={Colors.secondary} />
                            <Text style={[styles.pickerBtnText, { color: theme.text }]}>
                                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}

                    {showTimePicker && (
                        <DateTimePicker
                            value={date}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={onTimeChange}
                        />
                    )}
                </View>

                <View style={styles.modalFooter}>
                    <PremiumButton title="Hủy" color="#AAA" onPress={onClose} style={{ flex: 1, marginRight: 10 }} />
                    <PremiumButton title={editingTask ? "Cập nhật" : "Thêm mới"} onPress={onSave} style={{ flex: 1 }} />
                </View>
            </GlassCard>
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { width: '100%', borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 25, paddingBottom: 40 },
  sheetHeader: { alignItems: 'center', marginBottom: 20 },
  sheetDrag: { width: 40, height: 4, backgroundColor: '#DDD', borderRadius: 2, marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  formContainer: { marginBottom: 20 },
  pickerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  pickerBtn: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 15, width: '48%' },
  pickerBtnText: { marginLeft: 10, fontWeight: '500' },
  modalFooter: { flexDirection: 'row' },
});

export default TaskModal;
