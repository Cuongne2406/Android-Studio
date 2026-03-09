import { 
  StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, 
  Dimensions, TextInput, SafeAreaView, Platform, KeyboardAvoidingView, 
  Alert, Modal, SectionList, Pressable
} from 'react-native';

// Đã thêm useState vào phần import của React
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { top100StudentsByAvgPoint, top10StudentsByAvgTrainingPoint } from './studentStatistics';
import { useEventHandlers } from './evenHandlers';

const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

// --- MÀN HÌNH 1: DANH SÁCH SINH VIÊN (HỒ SƠ) ---
const Excercise1 = () => {
  // Quản lý trạng thái ẩn/hiện của Modal
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#F5F7FA'}}>
      <StatusBar style="light" />
      {/* BACKGROUND HEADER */}
      <View style={styles.headerBackground}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>HỒ SƠ SINH VIÊN</Text>
          <Text style={styles.headerSchool}>Đại Học Lạc Hồng</Text>
        </View>
        <View style={styles.circleDecoration} />
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.contentContainer}>
        <View style={styles.card}>
          {/* THÀNH PHẦN: ImageButton - Bọc Image bằng TouchableOpacity */}
          <TouchableOpacity 
            style={styles.avatarWrapper}
            onPress={() => Alert.alert('Thông báo', 'Bạn vừa bấm vào ảnh đại diện (ImageButton)')}
          >
             <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
                style={styles.avatar} 
            />
            <View style={styles.activeBadge} />
          </TouchableOpacity>

          <Text style={styles.nameText}>Nguyễn Trung Cường</Text>
          <Text style={styles.idText}>MSSV: 123000991</Text>
          <Text style={styles.majorText}>Khoa Công Nghệ Thông Tin</Text>

          <View style={styles.divider} />

          <View style={styles.infoList}>
            <InfoItem icon="school-outline" label="Trường" value="Đại học Lạc Hồng" color="#4A90E2"/>
            <InfoItem icon="account-tie" library="MaterialCommunityIcons" label="GVCN" value="Nguyễn Khắc Hoàng" color="#FF6B6B"/>
            <InfoItem icon="calendar-outline" label="Niên khóa" value="2023 - 2027" color="#F5A623"/>
            <InfoItem icon="location-outline" label="Cơ sở" value="Cơ sở 1 - Biên Hòa" color="#7ED321"/>
          </View>

          {/* Nút mở Modal */}
          <TouchableOpacity 
            style={styles.buttonShadow}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Xem Bảng Điểm</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* THÀNH PHẦN: Modal chứa thông tin */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        // Xử lý nút Back trên Android (Hardware Back Button)
        onRequestClose={() => {
          Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn đóng bảng điểm không?', [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Đóng', onPress: () => setModalVisible(false) },
          ]);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Bảng Điểm Chi Tiết</Text>
            <Text style={styles.modalText}>Điểm Trung Bình: 10</Text>
            <Text style={styles.modalText}>Điểm Rèn Luyện: 10</Text>
            <Text style={styles.modalText}>Xếp loại: Xuất sắc</Text>
            
            <Pressable
              style={[styles.buttonShadow, { backgroundColor: '#FF6B6B', marginTop: 20 }]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.buttonText}>Đóng Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

// Component thẻ sinh viên (Dùng chung cho Bài tập 1)
const StudentCard = ({ index, student, type }) => {
  const getRankColor = (idx) => {
    if (idx === 0) return '#FFD700';
    if (idx === 1) return '#C0C0C0';
    if (idx === 2) return '#CD7F32';
    return '#E0E0E0';
  };

  return (
    <View style={styles.cardContainer}>
      <View style={[styles.rankBadge, { backgroundColor: getRankColor(index) }]}>
        <Text style={styles.rankText}>{index + 1}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.studentName}>{student.name}</Text>
        <Text style={styles.studentId}>MSSV: {student.id || 'Đang cập nhật'}</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>{type === 'point' ? 'Điểm TB' : 'ĐRL'}</Text>
        <Text style={styles.scoreValue}>
          {type === 'point' ? student.avgPoint : student.avgTrainingPoint}
        </Text>
      </View>
    </View>
  );
};

// --- MÀN HÌNH 2: BẢNG XẾP HẠNG (Dùng SectionList) ---
const Excercise2 = () => {
  // Chuẩn bị dữ liệu cho SectionList
  const rankingData = [
    {
      title: 'Top Điểm Học Tập',
      icon: 'school',
      iconColor: '#4A90E2',
      data: top100StudentsByAvgPoint,
      type: 'point'
    },
    {
      title: 'Top Điểm Rèn Luyện',
      icon: 'arm-flex',
      iconColor: '#FF6B6B',
      data: top10StudentsByAvgTrainingPoint,
      type: 'training'
    }
  ];

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="dark" />
      <View style={styles.headerSimple}>
        <Text style={styles.headerSimpleTitle}>Bảng Xếp Hạng</Text>
        <Text style={styles.headerSimpleSubtitle}>Sử dụng SectionList tối ưu hiệu suất</Text>
      </View>

      {/* THÀNH PHẦN: SectionList */}
      <SectionList
        sections={rankingData}
        keyExtractor={(item, index) => item.id + index}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        // Render tiêu đề của mỗi Section
        renderSectionHeader={({ section: { title, icon, iconColor } }) => (
          <View style={[styles.sectionHeader, { marginTop: 15 }]}>
            <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
            <Text style={styles.sectionTitleModern}>{title}</Text>
          </View>
        )}
        // Render từng item sinh viên
        renderItem={({ item, index, section }) => (
          <StudentCard index={index} student={item} type={section.type} />
        )}
        ListFooterComponent={<View style={{ height: 40 }} />}
      />
    </View>
  );
}

const InfoItem = ({ icon, label, value, color, library }) => {
  return (
    <View style={styles.infoItem}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        {library === 'MaterialCommunityIcons' ? (
           <MaterialCommunityIcons name={icon} size={22} color={color} />
        ) : (
           <Ionicons name={icon} size={22} color={color} />
        )}
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
};

// --- MÀN HÌNH 3: PLAYGROUND (Thêm Checkbox, Radio, Pressable) ---
const Excercise3 = () => {
  const {
    inputValue, textValue, handleButtonClick,
    handleTextClick, handleInputChange, handleTextViewClick,
  } = useEventHandlers();

  // State cho Checkbox và RadioButton
  const [isChecked, setIsChecked] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState('react');

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.mainContainer}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerSimple}>
          <Text style={styles.headerSimpleTitle}>Playground</Text>
          <Text style={styles.headerSimpleSubtitle}>Thực hành xử lý sự kiện & UI Components</Text>
        </View>

        <View style={styles.playgroundCard}>
          <Text style={styles.label}>1. TouchableOpacity vs Pressable</Text>
          
          {/* TouchableOpacity thông thường */}
          <TouchableOpacity style={styles.actionButton} onPress={handleTextClick} activeOpacity={0.7}>
            <Ionicons name="finger-print" size={24} color="#FFF" />
            <Text style={styles.actionButtonText}>TouchableOpacity (Sẽ mờ đi)</Text>
          </TouchableOpacity>

          {/* THÀNH PHẦN: Pressable */}
          {/* Pressable cho phép ta đổi style tùy thuộc vào việc nó có đang bị bấm (pressed) hay không */}
          <Pressable 
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: pressed ? '#0984e3' : '#74b9ff' } // Đổi màu khi nhấn
            ]}
            onPress={() => Alert.alert('Pressable', 'Sự kiện chạm nâng cao!')}
          >
            {({ pressed }) => (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="color-wand" size={24} color="#FFF" />
                <Text style={styles.actionButtonText}>
                  {pressed ? 'Đang được nhấn...' : 'Pressable (Sẽ đổi màu)'}
                </Text>
              </View>
            )}
          </Pressable>

          <View style={styles.dividerSimple} />

          <Text style={styles.label}>2. Checkbox & RadioButton</Text>
          
          {/* THÀNH PHẦN: RadioButton */}
          <View style={styles.radioGroup}>
            <Text style={{marginBottom: 10, color: '#555', fontWeight:'bold'}}>Bạn đang học công nghệ nào?</Text>
            
            <TouchableOpacity style={styles.checkRow} onPress={() => setSelectedRadio('react')}>
              <Ionicons 
                name={selectedRadio === 'react' ? "radio-button-on" : "radio-button-off"} 
                size={24} color="#6C5CE7" 
              />
              <Text style={styles.checkText}>React Native</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.checkRow} onPress={() => setSelectedRadio('android')}>
              <Ionicons 
                name={selectedRadio === 'android' ? "radio-button-on" : "radio-button-off"} 
                size={24} color="#6C5CE7" 
              />
              <Text style={styles.checkText}>Android Studio (Java/Kotlin)</Text>
            </TouchableOpacity>
          </View>

          {/* THÀNH PHẦN: Checkbox */}
          <View style={{marginTop: 15, marginBottom: 15}}>
            <TouchableOpacity style={styles.checkRow} onPress={() => setIsChecked(!isChecked)}>
              <Ionicons 
                name={isChecked ? "checkbox" : "square-outline"} 
                size={24} color="#2ECC71" 
              />
              <Text style={styles.checkText}>Tôi đồng ý gửi dữ liệu xuống Terminal</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerSimple} />

          {/* PHẦN 3: NHẬP LIỆU */}
          <Text style={styles.label}>3. Nhập liệu & Hiển thị</Text>
          
          <View style={styles.inputWrapper}>
            <Ionicons name="create-outline" size={20} color="#666" style={{marginRight: 10}} />
            <TextInput
              style={styles.inputModern}
              placeholder="Nhập dữ liệu vào đây..."
              placeholderTextColor="#999"
              value={inputValue || ''}
              onChangeText={handleInputChange}
            />
          </View>

          {/* Kết quả hiển thị kiểu Terminal */}
          <View style={styles.terminalBox}>
            <View style={styles.terminalHeader}>
              <View style={[styles.dot, {backgroundColor:'#FF5F56'}]} />
              <View style={[styles.dot, {backgroundColor:'#FFBD2E'}]} />
              <View style={[styles.dot, {backgroundColor:'#27C93F'}]} />
            </View>
            <Text style={styles.terminalText}>
              <Text style={{color: '#4AF626'}}>$ output: </Text> 
              {textValue || 'Chưa có dữ liệu...'}
            </Text>
            <Text style={[styles.terminalText, {marginTop: 5, color: '#FFBD2E'}]}>
              $ radio_selected: {selectedRadio}
            </Text>
          </View>

          {/* Cụm nút chức năng */}
          <View style={styles.buttonGroup}>
             <TouchableOpacity 
                style={[styles.customBtn, { backgroundColor: '#4A90E2', marginBottom: 15 }]}
                onPress={handleButtonClick}
             >
                <Text style={styles.customBtnText}>Hiện Thông Báo (Alert)</Text>
                <Ionicons name="notifications-outline" size={20} color="#FFF" />
             </TouchableOpacity>

             <TouchableOpacity 
                style={[styles.customBtn, { backgroundColor: isChecked ? '#2ECC71' : '#BDC3C7' }]}
                onPress={isChecked ? handleTextViewClick : () => Alert.alert("Lỗi", "Vui lòng tick Checkbox đồng ý trước!")}
             >
                <Text style={styles.customBtnText}>Gửi dữ liệu xuống Terminal</Text>
                <Ionicons name="arrow-down-circle-outline" size={20} color="#FFF" />
             </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// --- APP COMPONENT CHÍNH ---
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Profile"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Profile') iconName = focused ? 'list' : 'list-outline';
            else if (route.name === 'Bài Tập 1') iconName = focused ? 'finger-print' : 'finger-print-outline';
            else if (route.name === 'Bài Tập 2') iconName = focused ? 'person' : 'person-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Profile" component={Excercise1} />
        <Tab.Screen name="Bài Tập 1" component={Excercise2} />
        <Tab.Screen name="Bài Tập 2" component={Excercise3} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  headerSimple: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerSimpleTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    letterSpacing: 0.5,
  },
  headerSimpleSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 5,
    backgroundColor: '#F5F7FA' // Giúp dính top mượt hơn nếu dùng sticky header
  },
  sectionTitleModern: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginLeft: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankText: {
    fontWeight: 'bold',
    color: '#FFF',
    fontSize: 16,
  },
  infoContainer: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  studentId: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'flex-end',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  scoreLabel: {
    fontSize: 10,
    color: '#AAA',
    textTransform: 'uppercase',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ECC71',
  },
  playgroundCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555',
    marginBottom: 10,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#6C5CE7',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 16,
  },
  dividerSimple: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 15,
  },
  // STYLES MỚI CHO CHECKBOX & RADIO
  radioGroup: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 10,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
  },
  //-------------------------------
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    marginBottom: 15,
  },
  inputModern: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  terminalBox: {
    backgroundColor: '#2D3436',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  terminalHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  terminalText: {
    color: '#FFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
  },
  buttonGroup: {
    marginTop: 10,
  },
  customBtn: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  customBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 8,
  },
  headerBackground: {
    height: 280,
    backgroundColor: '#1867C0',
    paddingTop: 60,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
    borderBottomRightRadius: 50,
  },
  circleDecoration: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ffffff10',
  },
  headerContent: { alignItems: 'center' },
  headerTitle: { fontSize: 20, color: '#AAB7B8', fontWeight: '600', letterSpacing: 2, marginBottom: 5 },
  headerSchool: { fontSize: 28, color: '#FFF', fontWeight: 'bold' },
  contentContainer: { flex: 1, alignItems: 'center', marginTop: -100 },
  card: {
    width: width * 0.9,
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  avatarWrapper: { position: 'relative', marginBottom: 15 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#FFF', backgroundColor: '#EEE' },
  activeBadge: { position: 'absolute', bottom: 5, right: 5, width: 20, height: 20, borderRadius: 10, backgroundColor: '#2ECC71', borderWidth: 3, borderColor: '#FFF' },
  nameText: { fontSize: 24, fontWeight: 'bold', color: '#34495E', marginBottom: 5 },
  idText: { fontSize: 16, color: '#7F8C8D', marginBottom: 5, fontWeight: '500' },
  majorText: { fontSize: 14, color: '#3498DB', fontWeight: '600', backgroundColor: '#3498DB15', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 15 },
  divider: { width: '100%', height: 1, backgroundColor: '#F0F0F0', marginVertical: 20 },
  infoList: { width: '100%' },
  infoItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconContainer: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  infoTextContainer: { flex: 1 },
  infoLabel: { fontSize: 13, color: '#95A5A6', marginBottom: 2 },
  infoValue: { fontSize: 16, color: '#2C3E50', fontWeight: '600' },
  buttonShadow: {
    marginTop: 10,
    backgroundColor: '#1867C0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    shadowColor: "#2C3E50",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginRight: 10 },
  
  // STYLES MỚI CHO MODAL
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Làm mờ nền phía sau
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2C3E50',
  },
  modalText: {
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
});