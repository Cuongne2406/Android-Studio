import React, { useState, useContext, useEffect, useMemo } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  Dimensions, Platform, Image, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, FadeInRight, ZoomIn 
} from 'react-native-reanimated';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, addTask, updateTask, deleteTask } from '../store/slices/taskSlice';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/Theme';
import ScreenHeader from '../components/ScreenHeader';
import GlassCard from '../components/GlassCard';
import TaskItem from '../components/schedule/TaskItem';
import TaskModal from '../components/schedule/TaskModal';

const { width } = Dimensions.get('window');

const ScheduleScreen = () => {
    const dispatch = useDispatch();
    const { tasks, loading } = useSelector(state => state.tasks);
    const { isDarkMode } = useSelector(state => state.ui);
    const { triggerHaptic } = useContext(AppContext);

    useEffect(() => {
        if (tasks.length === 0) {
            dispatch(fetchTasks());
        }
    }, []);
    
    const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
    const [modalVisible, setModalVisible] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const theme = isDarkMode ? Colors.dark : Colors.light;

    const filteredTasks = useMemo(() => {
        return tasks.filter(t => t.date === selectedDate);
    }, [tasks, selectedDate]);

    const weekDays = useMemo(() => {
        const days = [];
        const today = new Date();
        for (let i = -3; i <= 3; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            days.push({
                full: date.toDateString(),
                day: date.getDate(),
                name: date.toLocaleDateString('vi-VN', { weekday: 'short' }).replace('Th ', 'T'),
            });
        }
        return days;
    }, []);

    const handleAddTask = (task) => {
        if (editingTask) {
            dispatch(updateTask({ ...task, id: editingTask._id || editingTask.id }));
        } else {
            dispatch(addTask(task));
        }
        setModalVisible(false);
        setEditingTask(null);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setModalVisible(true);
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <ScreenHeader title="Lịch Học" subtitle="Kế hoạch cá nhân" theme={theme} isDarkMode={isDarkMode} />
            
            <View style={styles.calendarContainer}>
                <FlatList
                    horizontal
                    data={weekDays}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.full}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
                    renderItem={({ item, index }) => {
                        const isSelected = item.full === selectedDate;
                        return (
                            <Animated.View entering={FadeInRight.delay(index * 50)}>
                                <TouchableOpacity 
                                    onPress={() => { triggerHaptic(); setSelectedDate(item.full); }}
                                    activeOpacity={0.7}
                                >
                                    <GlassCard 
                                        intensity={isSelected ? 50 : 10} 
                                        isDarkMode={isDarkMode} 
                                        style={[
                                            styles.dayCard, 
                                            isSelected && { borderColor: Colors.primary }
                                        ]}
                                    >
                                        <Text style={[styles.dayName, { color: isSelected ? Colors.primary : theme.subText }]}>{item.name}</Text>
                                        <Text style={[styles.dayNum, { color: theme.text, fontSize: isSelected ? 20 : 16, fontWeight: isSelected ? '900' : '600' }]}>{item.day}</Text>
                                        {isSelected && <View style={styles.activeDot} />}
                                    </GlassCard>
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    }}
                />
            </View>

            <View style={{ flex: 1 }}>
                <View style={styles.listHeader}>
                    <Text style={[styles.listTitle, { color: theme.text }]}>Lịch trình hôm nay</Text>
                    <View style={styles.taskCount}>
                        <Text style={styles.taskCountText}>{filteredTasks.length} nhiệm vụ</Text>
                    </View>
                </View>

                {filteredTasks.length === 0 ? (
                    <Animated.View entering={FadeInDown.delay(300)} style={styles.emptyContainer}>
                        <GlassCard intensity={15} isDarkMode={isDarkMode} style={styles.emptyCard}>
                            <Ionicons name="calendar-outline" size={60} color={theme.subText + '40'} />
                            <Text style={[styles.emptyText, { color: theme.subText }]}>Hôm nay bạn không có lịch trình nào.</Text>
                            <TouchableOpacity 
                                style={[styles.emptyAddBtn, { backgroundColor: Colors.primary }]}
                                onPress={() => setModalVisible(true)}
                            >
                                <Text style={styles.emptyAddText}>Thêm nhiệm vụ mới</Text>
                            </TouchableOpacity>
                        </GlassCard>
                    </Animated.View>
                ) : (
                    <FlatList
                        data={filteredTasks}
                        keyExtractor={item => (item._id || item.id).toString()}
                        renderItem={({ item, index }) => (
                            <Animated.View entering={FadeInDown.delay(index * 100).duration(600)}>
                                <TaskItem 
                                    item={item} 
                                    onDelete={() => dispatch(deleteTask(item._id || item.id))} 
                                    onEdit={() => handleEditTask(item)}
                                    theme={theme}
                                    isDarkMode={isDarkMode}
                                />
                            </Animated.View>
                        )}
                        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                    />
                )}
            </View>

            <Animated.View entering={ZoomIn.delay(500)} style={styles.fabContainer}>
                <TouchableOpacity 
                    style={styles.fab} 
                    onPress={() => { triggerHaptic(); setEditingTask(null); setModalVisible(true); }}
                >
                    <LinearGradient colors={[Colors.primary, Colors.accent]} style={styles.fabGradient}>
                        <Ionicons name="add" size={32} color="#FFF" />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>

            <TaskModal 
                visible={modalVisible} 
                onClose={() => { setModalVisible(false); setEditingTask(null); }} 
                onSave={handleAddTask}
                editingTask={editingTask}
                isDarkMode={isDarkMode}
                initialDate={new Date(selectedDate)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    calendarContainer: { marginTop: 10, marginBottom: 5 },
    dayCard: { width: 65, height: 85, alignItems: 'center', justifyContent: 'center', marginRight: 12, padding: 0 },
    dayName: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', marginBottom: 5 },
    dayNum: { letterSpacing: -0.5 },
    activeDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.primary, marginTop: 5 },
    listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, marginVertical: 20 },
    listTitle: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
    taskCount: { backgroundColor: 'rgba(99, 102, 241, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    taskCountText: { color: Colors.primary, fontSize: 12, fontWeight: '800' },
    emptyContainer: { flex: 1, padding: 30, alignItems: 'center', justifyContent: 'center' },
    emptyCard: { width: '100%', alignItems: 'center', padding: 40 },
    emptyText: { marginTop: 15, textAlign: 'center', fontSize: 15, fontWeight: '600' },
    emptyAddBtn: { marginTop: 25, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14 },
    emptyAddText: { color: '#FFF', fontWeight: '800' },
    fabContainer: { position: 'absolute', bottom: 30, right: 30, elevation: 10 },
    fab: { width: 64, height: 64, borderRadius: 32, overflow: 'hidden' },
    fabGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default ScheduleScreen;
