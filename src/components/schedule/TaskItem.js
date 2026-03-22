import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../GlassCard';
import { Colors } from '../../theme/Theme';
import Animated, { FadeInRight, ZoomIn } from 'react-native-reanimated';

const TaskItem = ({ item, onDelete, onEdit, theme, isDarkMode }) => {
    return (
        <TouchableOpacity 
            onPress={() => onEdit(item)} 
            activeOpacity={0.8}
            style={styles.container}
        >
            <GlassCard 
                intensity={item.completed ? 5 : 15} 
                isDarkMode={isDarkMode} 
                style={[
                    styles.card, 
                    item.completed && { opacity: 0.6 }
                ]}
            >
                <View style={[
                    styles.checkCircle, 
                    { borderColor: item.completed ? Colors.success : theme.subText + '40' },
                    item.completed && { backgroundColor: Colors.success + '20' }
                ]}>
                    {item.completed && <Ionicons name="checkmark" size={16} color={Colors.success} />}
                </View>

                <View style={styles.content}>
                    <Text style={[
                        styles.title, 
                        { color: theme.text },
                        item.completed && { textDecorationLine: 'line-through', color: theme.subText }
                    ]}>
                        {item.title}
                    </Text>
                    <View style={styles.timeRow}>
                        <Ionicons name="time-outline" size={12} color={Colors.primary} style={{ marginRight: 4 }} />
                        <Text style={[styles.time, { color: theme.subText }]}>{item.time}</Text>
                    </View>
                </View>

                <TouchableOpacity 
                    onPress={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    style={styles.deleteBtn}
                >
                    <Ionicons name="trash-outline" size={20} color={Colors.error} />
                </TouchableOpacity>
            </GlassCard>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 15 },
    card: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 20 },
    checkCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    content: { flex: 1 },
    title: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
    timeRow: { flexDirection: 'row', alignItems: 'center' },
    time: { fontSize: 12, fontWeight: '600' },
    deleteBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }
});

export default TaskItem;
