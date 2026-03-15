import React, { useState, useContext } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  Alert, Dimensions, Modal, Platform 
} from 'react-native';
import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/Theme';
import GlassCard from '../components/GlassCard';
import PremiumButton from '../components/PremiumButton';
import PremiumInput from '../components/PremiumInput';
import ScreenHeader from '../components/ScreenHeader';
import Toast from '../components/Toast';
import TaskItem from '../components/schedule/TaskItem';
import TaskModal from '../components/schedule/TaskModal';

const { width } = Dimensions.get('window');

const ScheduleScreen = () => {
  const { isDarkMode, triggerHaptic } = useContext(AppContext);
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const toastRef = React.useRef(null);

  const [tasks, setTasks] = useState([
    { id: '1', title: 'Nộp đồ án cuối kỳ', date: new Date(), time: '09:00', completed: false },
    { id: '2', title: 'Họp nhóm môn React Native', date: new Date(), time: '14:30', completed: true },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [taskTitle, setTaskTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const resetForm = () => {
    setTaskTitle('');
    setDate(new Date());
    setEditingTask(null);
  };

  const handleSaveTask = () => {
    if (!taskTitle.trim()) {
      triggerHaptic('error');
      Alert.alert("Lỗi", "Vui lòng nhập tên công việc!");
      return;
    }

    const today = new Date();
    today.setHours(0,0,0,0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0,0,0,0);
    
    if (selectedDate < today && !editingTask) {
        triggerHaptic('warning');
        Alert.alert("Cảnh báo", "Bạn đang đặt lịch cho một ngày trong quá khứ!");
    }

    triggerHaptic('selection');
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { 
        ...t, 
        title: taskTitle, 
        date: date,
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } : t));
    } else {
      const newTask = {
        id: Date.now().toString(),
        title: taskTitle,
        date: date,
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: false
      };
      setTasks([...tasks, newTask]);
    }
    setModalVisible(false);
    resetForm();
    setTimeout(() => {
        triggerHaptic('success');
        toastRef.current?.show(editingTask ? "Đã cập nhật công việc" : "Đã thêm công việc mới");
    }, 400);
  };

  const handleDeleteTask = (id) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có muốn xóa công việc này không?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", onPress: () => setTasks(tasks.filter(t => t.id !== id)), style: "destructive" }
      ]
    );
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || date;
    setShowTimePicker(Platform.OS === 'ios');
    setDate(currentTime);
  };

  const renderTaskItem = ({ item, index }) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()}
      layout={Layout.springify()}
    >
      <GlassCard isDarkMode={isDarkMode} style={[
          styles.taskCard, 
          item.completed && { opacity: 0.6 },
          { 
              elevation: isDarkMode ? 2 : 6, 
              shadowOpacity: isDarkMode ? 0.2 : 0.15,
              borderWidth: isDarkMode ? 0 : 1,
              borderColor: 'rgba(0,0,0,0.03)'
          }
      ]}>
          <TouchableOpacity style={styles.checkIcon} onPress={() => toggleComplete(item.id)}>
              <Ionicons 
                  name={item.completed ? "checkbox" : "square-outline"} 
                  size={26} 
                  color={item.completed ? Colors.success : Colors.primary} 
              />
          </TouchableOpacity>
          <View style={styles.taskInfo}>
              <Text style={[styles.taskTitle, { color: theme.text, fontWeight: '800', textDecorationLine: item.completed ? 'line-through' : 'none' }]}>
                  {item.title}
              </Text>
              <View style={styles.timeRow}>
                  <Ionicons name="calendar-outline" size={14} color={isDarkMode ? theme.subText : '#475569'} />
                  <Text style={[styles.taskDate, { color: isDarkMode ? theme.subText : '#475569', fontWeight: '800' }]}>{new Date(item.date).toLocaleDateString('vi-VN')}</Text>
                  <Ionicons name="time-outline" size={14} color={isDarkMode ? theme.subText : '#475569'} style={{ marginLeft: 10 }} />
                  <Text style={[styles.taskDate, { color: isDarkMode ? theme.subText : '#475569', fontWeight: '800' }]}>{item.time}</Text>
              </View>
          </View>
          <View style={styles.actions}>
              <TouchableOpacity onPress={() => { setEditingTask(item); setTaskTitle(item.title); setDate(new Date(item.date)); setModalVisible(true); }}>
                  <Ionicons name="create-outline" size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => handleDeleteTask(item.id)}>
                  <Ionicons name="trash-outline" size={20} color={Colors.danger} />
              </TouchableOpacity>
          </View>
      </GlassCard>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader 
        title="Lịch Học Tập" 
        subtitle={`${tasks.filter(t => !t.completed).length} mục tiêu cần thực hiện`}
        theme={theme} 
        isDarkMode={isDarkMode}
        rightElement={
            <TouchableOpacity 
                style={[styles.addBtn, { backgroundColor: Colors.primary }]} 
                onPress={() => { triggerHaptic(); resetForm(); setModalVisible(true); }}
            >
                <Ionicons name="add" size={28} color="#FFF" />
            </TouchableOpacity>
        }
      />

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderTaskItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
            <View style={styles.emptyState}>
                <MaterialCommunityIcons name="calendar-check" size={80} color={theme.border} />
                <Text style={{ color: theme.subText, marginTop: 10 }}>Chưa có lịch hẹn nào</Text>
            </View>
        }
      />

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
              <GlassCard isDarkMode={isDarkMode} style={styles.modalContent}>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>
                      {editingTask ? "Sửa Công Việc" : "Thêm Công Việc Mới"}
                  </Text>
                  
                  <PremiumInput 
                    label="Tên công việc"
                    placeholder="Ví dụ: Học React Native..."
                    value={taskTitle}
                    onChangeText={setTaskTitle}
                    isDarkMode={isDarkMode}
                  />

                  <View style={styles.pickerRow}>
                      <TouchableOpacity style={[styles.pickerBtn, { backgroundColor: theme.border + '20' }]} onPress={() => setShowDatePicker(true)}>
                          <Ionicons name="calendar" size={20} color={Colors.primary} />
                          <Text style={[styles.pickerBtnText, { color: theme.text }]}>
                              {date.toLocaleDateString('vi-VN')}
                          </Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={[styles.pickerBtn, { backgroundColor: theme.border + '20' }]} onPress={() => setShowTimePicker(true)}>
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

                  <View style={styles.modalFooter}>
                      <PremiumButton title="Hủy" color="#AAA" onPress={() => setModalVisible(false)} style={{ flex: 1, marginRight: 10 }} />
                      <PremiumButton title={editingTask ? "Cập nhật" : "Thêm mới"} onPress={handleSaveTask} style={{ flex: 1 }} />
                  </View>
              </GlassCard>
          </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 25, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 4 },
  headerTitle: { fontSize: 24, fontWeight: '900' },
  headerSubtitle: { fontSize: 13, marginTop: 2 },
  addBtn: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  listContainer: { padding: 20 },
  taskCard: { flexDirection: 'row', alignItems: 'center', padding: 15, marginBottom: 15 },
  checkIcon: { marginRight: 15 },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: 'bold' },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  taskDate: { fontSize: 12, marginLeft: 4 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  pickerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  pickerBtn: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, width: '48%' },
  pickerBtnText: { marginLeft: 10, fontWeight: '500' },
  modalFooter: { flexDirection: 'row', marginTop: 10 },
});

export default ScheduleScreen;
