import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../GlassCard';
import { Colors } from '../../theme/Theme';

const TaskItem = ({ item, isDarkMode, theme, onToggle, onEdit, onDelete }) => {
  return (
    <GlassCard isDarkMode={isDarkMode} style={[styles.taskCard, item.completed && { opacity: 0.6 }]}>
        <TouchableOpacity style={styles.checkIcon} onPress={() => onToggle(item.id)}>
            <Ionicons 
                name={item.completed ? "checkbox" : "square-outline"} 
                size={24} 
                color={item.completed ? Colors.success : Colors.primary} 
            />
        </TouchableOpacity>
        
        <View style={styles.taskInfo}>
            <Text style={[styles.taskTitle, { color: theme.text, textDecorationLine: item.completed ? 'line-through' : 'none' }]}>
                {item.title}
            </Text>
            <View style={styles.timeRow}>
                <Ionicons name="calendar-outline" size={14} color={theme.subText} />
                <Text style={[styles.taskDate, { color: theme.subText }]}>{new Date(item.date).toLocaleDateString('vi-VN')}</Text>
                <Ionicons name="time-outline" size={14} color={theme.subText} style={{ marginLeft: 10 }} />
                <Text style={[styles.taskDate, { color: theme.subText }]}>{item.time}</Text>
            </View>
        </View>

        <View style={styles.actions}>
            <TouchableOpacity onPress={() => onEdit(item)}>
                <Ionicons name="create-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => onDelete(item.id)}>
                <Ionicons name="trash-outline" size={20} color={Colors.danger} />
            </TouchableOpacity>
        </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  taskCard: { flexDirection: 'row', alignItems: 'center', padding: 15, marginBottom: 15 },
  checkIcon: { marginRight: 15 },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: 'bold' },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  taskDate: { fontSize: 12, marginLeft: 4 },
  actions: { flexDirection: 'row', alignItems: 'center' },
});

export default TaskItem;
