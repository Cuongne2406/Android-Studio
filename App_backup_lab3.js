import { 
  StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, 
  Dimensions, TextInput, KeyboardAvoidingView, 
  Alert, Modal, SectionList, Pressable, Platform, RefreshControl
} from 'react-native';
import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { top100StudentsByAvgPoint, top10StudentsByAvgTrainingPoint } from './studentStatistics';

const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

// --- BƯỚC 1: CONTEXT QUẢN LÝ DỮ LIỆU CHUNG (Global State + AsyncStorage) ---
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false); // Cờ kiểm tra dữ liệu đã load xong chưa
  const [profileAvatar, setProfileAvatar] = useState('https://cdn-icons-png.flaticon.com/512/3135/3135715.png');
  const [profileData, setProfileData] = useState({
    name: "Nguyễn Trung Cường",
    id: "123000991",
    major: "Khoa Công Nghệ Thông Tin",
    school: "Đại học Lạc Hồng",
    teacher: "Nguyễn Khắc Hoàng",
    year: "2023 - 2027",
    address: "Cơ sở 1 - Biên Hòa",
    avgPoint: 10,
    trainingPoint: 10,
    rank: "Xuất sắc"
  });

  const [studentsData, setStudentsData] = useState({
    point: top100StudentsByAvgPoint,
    training: top10StudentsByAvgTrainingPoint
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load dữ liệu từ AsyncStorage khi khởi động app
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedAvatar = await AsyncStorage.getItem('profileAvatar');
        const savedProfile = await AsyncStorage.getItem('profileData');
        const savedTheme = await AsyncStorage.getItem('isDarkMode');
        
        if (savedAvatar) setProfileAvatar(savedAvatar);
        if (savedProfile) setProfileData(JSON.parse(savedProfile));
        if (savedTheme !== null) setIsDarkMode(JSON.parse(savedTheme));
      } catch (error) {
        console.log("Lỗi load dữ liệu:", error);
      } finally {
        setIsReady(true);
      }
    };
    loadData();
  }, []);

  // Hàm helper để vừa gọi set state vừa lưu vào AsyncStorage
  const updateAvatar = async (uri) => {
    setProfileAvatar(uri);
    await AsyncStorage.setItem('profileAvatar', uri);
  };

  const updateProfileData = async (newData) => {
    setProfileData(newData);
    await AsyncStorage.setItem('profileData', JSON.stringify(newData));
  };

  const toggleDarkMode = async (value) => {
    setIsDarkMode(value);
    await AsyncStorage.setItem('isDarkMode', JSON.stringify(value));
  };

  if (!isReady) return null; // Hoặc trả về 1 ActivityIndicator xoay vòng

  return (
    <AppContext.Provider value={{
      profileAvatar, updateAvatar, 
      profileData, updateProfileData,
      studentsData, setStudentsData,
      isDarkMode, toggleDarkMode
    }}>
      {children}
    </AppContext.Provider>
  );
};

// --- MÀN HÌNH 1: CHI TIẾT HỒ SƠ ---
const Excercise1 = () => {
  const { profileAvatar, updateAvatar, profileData, updateProfileData, isDarkMode } = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false); // Modal Editor
  
  // State tạm tĩnh cho việc edit form Profile
  const [editName, setEditName] = useState(profileData.name);
  const [editId, setEditId] = useState(profileData.id);

  const bgColor = isDarkMode ? '#1e272e' : '#F5F7FA';
  const cardColor = isDarkMode ? '#2d3436' : '#FFF';
  const textColor = isDarkMode ? '#FFF' : '#333';
  const subTextColor = isDarkMode ? '#b2bec3' : '#7F8C8D';
  const dividerColor = isDarkMode ? '#4a4a4a' : '#F0F0F0';

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Lỗi", "Bạn chưa cho phép truy cập thư viện ảnh!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true, 
      aspect: [1, 1], 
      quality: 0.8,
    });

    if (!result.canceled) {
      updateAvatar(result.assets[0].uri); 
    }
  };

  const saveProfile = () => {
    if(!editName.trim() || !editId.trim()){
       Alert.alert("Lỗi", "Vui lòng không bỏ trống thông tin!");
       return;
    }
    updateProfileData({ ...profileData, name: editName, id: editId });
    setEditModalVisible(false);
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: bgColor}}>
      <StatusBar style="light" />
      <View style={styles.headerBackground}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>HỒ SƠ SINH VIÊN</Text>
          <Text style={styles.headerSchool}>{profileData.school}</Text>
        </View>
        <View style={styles.circleDecoration} />
      </View>

      <View style={styles.contentContainer}>
        <View style={[styles.card, {backgroundColor: cardColor}]}>
          
          {/* Nút nhỏ góc trên bên phải để bật Chế độ Edit */}
          <TouchableOpacity 
             style={{position: 'absolute', top: 25, right: 25}}
             onPress={() => {
                setEditName(profileData.name); 
                setEditId(profileData.id); 
                setEditModalVisible(true)
             }}
          >
             <Ionicons name="create" size={24} color="#3498DB" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
             <Image source={{ uri: profileAvatar }} style={styles.avatar} />
            <View style={styles.activeBadge} />
            <View style={styles.editIconBadge}>
              <Ionicons name="camera" size={14} color="#FFF" />
            </View>
          </TouchableOpacity>

          <Text style={[styles.nameText, {color: textColor}]}>{profileData.name}</Text>
          <Text style={[styles.idText, {color: subTextColor}]}>MSSV: {profileData.id}</Text>
          <Text style={styles.majorText}>{profileData.major}</Text>

          <View style={[styles.divider, {backgroundColor: dividerColor}]} />

          <View style={styles.infoList}>
            <InfoItem isDark={isDarkMode} icon="school-outline" label="Trường" value={profileData.school} color="#4A90E2"/>
            <InfoItem isDark={isDarkMode} icon="account-tie" library="MaterialCommunityIcons" label="GVCN" value={profileData.teacher} color="#FF6B6B"/>
            <InfoItem isDark={isDarkMode} icon="calendar-outline" label="Niên khóa" value={profileData.year} color="#F5A623"/>
            <InfoItem isDark={isDarkMode} icon="location-outline" label="Cơ sở" value={profileData.address} color="#7ED321"/>
          </View>

          <TouchableOpacity style={styles.buttonShadow} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Xem Bảng Điểm</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL 1: XEM BẢNG ĐIỂM */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)} >
        <View style={styles.modalBackground}>
          <View style={[styles.modalView, {backgroundColor: cardColor}]}>
            <Text style={[styles.modalTitle, {color: textColor}]}>Bảng Điểm Của Bạn</Text>
            <View style={{width: '100%', alignItems: 'flex-start', paddingHorizontal: 20}}>
                <Text style={[styles.modalText, {color: textColor}]}>⭐ Điểm Trung Bình: <Text style={{fontWeight:'bold'}}>{profileData.avgPoint}</Text></Text>
                <Text style={[styles.modalText, {color: textColor}]}>🏆 Điểm Rèn Luyện: <Text style={{fontWeight:'bold'}}>{profileData.trainingPoint}</Text></Text>
                <Text style={[styles.modalText, {color: textColor}]}>🏅 Xếp loại: <Text style={{color: '#E67E22', fontWeight:'bold'}}>{profileData.rank}</Text></Text>
            </View>
            <Pressable style={[styles.buttonShadow, { backgroundColor: '#FF6B6B', marginTop: 30 }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Đóng Bảng Điểm</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: CHỈNH SỬA HỒ SƠ */}
      <Modal animationType="fade" transparent={true} visible={editModalVisible} onRequestClose={() => setEditModalVisible(false)} >
         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBackground}>
          <View style={[styles.modalView, {backgroundColor: cardColor}]}>
            <Text style={[styles.modalTitle, {color: textColor, marginTop: 10}]}>Chỉnh Sửa Hồ Sơ</Text>
            
            <View style={{width: '100%', marginTop: 20}}>
                <Text style={[styles.label, {color: subTextColor}]}>Họ và Tên</Text>
                <TextInput 
                   style={[styles.inputModern, {backgroundColor: isDarkMode?'#1e272e':'#F5F7FA', color: textColor, marginBottom: 15}]}
                   value={editName} onChangeText={setEditName}
                />
                <Text style={[styles.label, {color: subTextColor}]}>Mã Số Sinh Viên</Text>
                <TextInput 
                   style={[styles.inputModern, {backgroundColor: isDarkMode?'#1e272e':'#F5F7FA', color: textColor}]}
                   value={editId} onChangeText={setEditId} keyboardType="numeric"
                />
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 30}}>
                <Pressable style={[styles.customBtn, {backgroundColor: '#95a5a6', width: '45%'}]} onPress={() => setEditModalVisible(false)}>
                   <Text style={styles.customBtnText}>Hủy</Text>
                </Pressable>
                <Pressable style={[styles.customBtn, {backgroundColor: '#2ECC71', width: '45%'}]} onPress={saveProfile}>
                   <Text style={styles.customBtnText}>Lưu</Text>
                </Pressable>
            </View>
          </View>
         </KeyboardAvoidingView>
      </Modal>

    </ScrollView>
  );
}

// Component thẻ sinh viên
const StudentCard = ({ index, student, type, onPress, isDark }) => {
  const getRankColor = (idx) => {
    if (idx === 0) return '#FFD700';
    if (idx === 1) return '#C0C0C0';
    if (idx === 2) return '#CD7F32';
    return '#bdc3c7'; // Rank thường bạc
  };
  
  const cardColor = isDark ? '#2d3436' : '#FFF';
  const textColor = isDark ? '#FFF' : '#333';
  const subTextColor = isDark ? '#b2bec3' : '#999';
  const scoreBgColor = isDark ? '#3d4447' : '#F8F9FA';

  return (
    <Pressable 
        style={({ pressed }) => [
            styles.cardContainer,
            { backgroundColor: cardColor, transform: [{ scale: pressed ? 0.98 : 1 }], opacity: pressed ? 0.8 : 1 }
        ]}
        onPress={() => onPress(student, type, index)}
    >
      <View style={[styles.rankBadge, { backgroundColor: getRankColor(index) }]}>
        <Text style={styles.rankText}>{index + 1}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.studentName, {color: textColor}]}>{student.name}</Text>
        <Text style={[styles.studentId, {color: subTextColor}]}>MSSV: {student.id || student.mssv || 'Đang cập nhật'}</Text>
      </View>
      <View style={[styles.scoreContainer, {backgroundColor: scoreBgColor}]}>
        <Text style={styles.scoreLabel}>{type === 'point' ? 'Điểm TB' : 'ĐRL'}</Text>
        <Text style={styles.scoreValue}>
          {type === 'point' ? student.avgPoint : student.avgTrainingPoint}
        </Text>
      </View>
    </Pressable>
  );
};

// --- MÀN HÌNH 2: BẢNG XẾP HẠNG ---
const Excercise2 = () => {
  const { studentsData, setStudentsData, isDarkMode } = useContext(AppContext);
  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [refreshing, setRefreshing] = useState(false); // State cho Pull-to-refresh

  const rankingData = [
    {
      title: 'Top Điểm Học Tập', icon: 'school', iconColor: '#4A90E2',
      data: studentsData.point, type: 'point'
    },
    {
      title: 'Top Điểm Rèn Luyện', icon: 'arm-flex', iconColor: '#FF6B6B',
      data: studentsData.training, type: 'training'
    }
  ];

  // Logic Vuốt để tải lại
  const onRefresh = () => {
     setRefreshing(true);
     // Giả lập delay giống như gọi API load dữ liệu
     setTimeout(() => {
         // Reset data về full danh sách
         setStudentsData({ point: top100StudentsByAvgPoint, training: top10StudentsByAvgTrainingPoint });
         setRefreshing(false);
     }, 1500);
  };

  const handleStudentPress = (student, type, index) => {
      setSelectedStudent({ ...student, type, rank: index + 1 });
  }

  const bgColor = isDarkMode ? '#1e272e' : '#F5F7FA';
  const textColor = isDarkMode ? '#f5f6fa' : '#333';
  const headerBgColor = isDarkMode ? '#2d3436' : '#FFF';
  const dividerColor = isDarkMode ? '#4a4a4a' : '#F0F0F0';

  return (
    <View style={[styles.mainContainer, { backgroundColor: bgColor }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View style={[styles.headerSimple, {backgroundColor: headerBgColor, borderBottomColor: dividerColor}]}>
        <Text style={[styles.headerSimpleTitle, {color: textColor}]}>Bảng Xếp Hạng</Text>
        <Text style={styles.headerSimpleSubtitle}>Vuốt xuống để làm mới danh sách</Text>
      </View>

      <SectionList
        sections={rankingData}
        keyExtractor={(item, index) => item.id + index}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        
        // --- ỨNG DỤNG PULL TO REFRESH ---
        refreshControl={
           <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4A90E2', '#FF6B6B']} // Đổi màu loading spinner rực rỡ
              tintColor={isDarkMode ? '#FFF' : '#4A90E2'}
           />
        }
        
        renderSectionHeader={({ section: { title, icon, iconColor } }) => (
          <View style={[styles.sectionHeader, { backgroundColor: bgColor }]}>
            <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
            <Text style={[styles.sectionTitleModern, {color: textColor}]}>{title}</Text>
          </View>
        )}
        renderItem={({ item, index, section }) => (
          <StudentCard isDark={isDarkMode} index={index} student={item} type={section.type} onPress={handleStudentPress} />
        )}
        ListFooterComponent={<View style={{ height: 40 }} />}
      />

      {/* Modal chi tiết hiển thị cho phép Dark Mode */}
      <Modal visible={selectedStudent !== null} animationType="fade" transparent={true}>
          <View style={styles.modalBackground}>
              <View style={[styles.modalView, {backgroundColor: headerBgColor}]}>
                 {selectedStudent && (
                     <>
                        <View style={[styles.modalHeaderDecor, {backgroundColor: selectedStudent.type === 'point' ? '#4A90E2' : '#FF6B6B'}]}>
                             <MaterialCommunityIcons name="medal" size={40} color="#FFF" />
                        </View>
                        <Text style={[styles.modalTitle, {marginTop: 40, color: textColor}]}>{selectedStudent.name}</Text>
                        <Text style={styles.idText}>MSSV: {selectedStudent.id || selectedStudent.mssv}</Text>
                        <View style={[styles.dividerSimple, {backgroundColor: dividerColor, width: '100%'}]} />
                        <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 15}}>
                            <View style={{alignItems: 'center'}}>
                                <Text style={styles.infoLabel}>Xếp hạng</Text>
                                <Text style={{fontSize: 22, fontWeight: 'bold', color: '#E67E22'}}>#{selectedStudent.rank}</Text>
                            </View>
                            <View style={{alignItems: 'center'}}>
                                <Text style={styles.infoLabel}>{selectedStudent.type === 'point' ? 'Điểm TB' : 'ĐRL'}</Text>
                                <Text style={{fontSize: 22, fontWeight: 'bold', color: '#2ECC71'}}>
                                    {selectedStudent.type === 'point' ? selectedStudent.avgPoint : selectedStudent.avgTrainingPoint}
                                </Text>
                            </View>
                        </View>
                        <Pressable style={styles.customBtn} onPress={() => setSelectedStudent(null)}>
                            <Text style={styles.customBtnText}>Tuyệt vời</Text>
                        </Pressable>
                     </>
                 )}
              </View>
          </View>
      </Modal>

    </View>
  );
}

const InfoItem = ({ icon, label, value, color, library, isDark }) => {
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
        <Text style={[styles.infoValue, {color: isDark?'#FFF':'#2C3E50'}]}>{value}</Text>
      </View>
    </View>
  );
};

// --- MÀN HÌNH 3: BỘ LỌC VÀ CÀI ĐẶT ---
const Excercise3 = () => {
  const { isDarkMode, toggleDarkMode, studentsData, setStudentsData } = useContext(AppContext);
  const [searchText, setSearchText] = useState('');
  const [isAgree, setIsAgree] = useState(false);

  const filterStudents = () => {
     if(!searchText.trim()) {
         Alert.alert("Thiếu thông tin", "Vui lòng nhập tên sinh viên cần tìm.");
         return;
     }
     const lowerSearch = searchText.toLowerCase();
     const filteredPoints = top100StudentsByAvgPoint.filter(s => s.name.toLowerCase().includes(lowerSearch));
     const filteredTraining = top10StudentsByAvgTrainingPoint.filter(s => s.name.toLowerCase().includes(lowerSearch));
     
     setStudentsData({ point: filteredPoints, training: filteredTraining });
     Alert.alert("Thành công", `Đã lọc danh sách theo từ khóa: "${searchText}"\nHãy sang Tab "Xếp Hạng" để xem kết quả!`);
  };

  const bgColor = isDarkMode ? '#1e272e' : '#F5F7FA';
  const cardColor = isDarkMode ? '#2d3436' : '#FFF';
  const textColor = isDarkMode ? '#FFF' : '#333';
  const subTextColor = isDarkMode ? '#b2bec3' : '#555';
  const sectionBgColor = isDarkMode ? '#3d4447' : '#F8F9FA';
  const dividerColor = isDarkMode ? '#4a4a4a' : '#F0F0F0';

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.mainContainer, {backgroundColor: bgColor}]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.headerSimple, {backgroundColor: cardColor, borderBottomColor: dividerColor}]}>
          <Text style={[styles.headerSimpleTitle, {color:textColor}]}>Cài Đặt & Bộ Lọc</Text>
          <Text style={styles.headerSimpleSubtitle}>Ảnh hưởng trực tiếp đến App</Text>
        </View>

        <View style={[styles.playgroundCard, {backgroundColor: cardColor}]}>
          
          <Text style={[styles.label, {color: subTextColor}]}>1. Giao Diện Toàn Cục</Text>
          <View style={[styles.radioGroup, {backgroundColor: sectionBgColor}]}>
            <TouchableOpacity style={styles.checkRow} onPress={() => toggleDarkMode(false)}>
              <Ionicons name={!isDarkMode ? "radio-button-on" : "radio-button-off"} size={24} color="#6C5CE7" />
              <Text style={[styles.checkText, {color: textColor}]}>Chế độ Sáng (Mặc định)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.checkRow} onPress={() => toggleDarkMode(true)}>
              <Ionicons name={isDarkMode ? "radio-button-on" : "radio-button-off"} size={24} color="#6C5CE7" />
              <Text style={[styles.checkText, {color: textColor}]}>Chế độ Tối (Dark Mode)</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.dividerSimple, {backgroundColor: dividerColor}]} />

          <Text style={[styles.label, {color: subTextColor}]}>2. Lọc Danh Sách Sinh Viên</Text>
          <View style={[styles.inputWrapper, {backgroundColor: sectionBgColor, borderColor: sectionBgColor}]}>
            <Ionicons name="search" size={20} color={subTextColor} style={{marginRight: 10}} />
            <TextInput
              style={[styles.inputModern, {color: textColor}]}
              placeholder="Nhập tên sinh viên VD: Cường"
              placeholderTextColor={subTextColor}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <View style={{marginTop: 5, marginBottom: 15}}>
            <TouchableOpacity style={styles.checkRow} onPress={() => setIsAgree(!isAgree)}>
              <Ionicons name={isAgree ? "checkbox" : "square-outline"} size={24} color="#2ECC71" />
              <Text style={[styles.checkText, {color: textColor}]}>Cho phép thay đổi trạng thái danh sách</Text>
            </TouchableOpacity>
          </View>

          <Pressable 
             style={({ pressed }) => [
                styles.actionButton,
                { backgroundColor: !isAgree ? '#BDC3C7' : (pressed ? '#27ae60' : '#2ECC71') }
             ]}
             disabled={!isAgree}
             onPress={filterStudents}
          >
            <Ionicons name="filter" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Thực Hiện Lọc Bộ Nhớ</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Custom component để bọc Bottom Tabs, hứng được isDarkMode từ Context
function MainTabs() {
   const { isDarkMode } = useContext(AppContext);
   return (
       <Tab.Navigator initialRouteName="Profile"
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
                else if (route.name === 'Bài Tập 1') iconName = focused ? 'list' : 'list-outline';
                else if (route.name === 'Bài Tập 2') iconName = focused ? 'options' : 'options-outline';
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              headerShown: false,
              // Áp dụng Dark Mode cho thanh Tab dưới cùng
              tabBarStyle: {
                 backgroundColor: isDarkMode ? '#1e272e' : '#FFFFFF',
                 borderTopColor: isDarkMode ? '#2d3436' : '#E0E0E0',
              },
              tabBarActiveTintColor: isDarkMode ? '#4A90E2' : '#1867C0', // Xanh nước biển
              tabBarInactiveTintColor: isDarkMode ? '#7f8fa6' : '#8e8e8e',
            })}
          >
            <Tab.Screen name="Profile" component={Excercise1} options={{title: "Hồ Sơ"}}/>
            <Tab.Screen name="Bài Tập 1" component={Excercise2} options={{title: "Xếp Hạng"}}/>
            <Tab.Screen name="Bài Tập 2" component={Excercise3} options={{title: "Cài Đặt"}}/>
        </Tab.Navigator>
   )
}

// --- APP COMPONENT CHÍNH ---
export default function App() {
  return (
    <AppProvider>
        <NavigationContainer>
           <MainTabs />
        </NavigationContainer>
    </AppProvider>
  );
}

// --- STYLES GIỮ NGUYÊN HOẶC TINH CHỈNH MỘT ÍT ---
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F5F7FA' },
  scrollContent: { paddingHorizontal: 16 },
  headerSimple: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: '#FFF', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerSimpleTitle: { fontSize: 24, fontWeight: '800', color: '#333', letterSpacing: 0.5 },
  headerSimpleSubtitle: { fontSize: 14, color: '#888', marginTop: 5 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, paddingVertical: 5, marginTop: 15 },
  sectionTitleModern: { fontSize: 18, fontWeight: '700', color: '#2C3E50', marginLeft: 10 },
  cardContainer: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 15, marginBottom: 12, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  rankBadge: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  rankText: { fontWeight: 'bold', color: '#FFF', fontSize: 16 },
  infoContainer: { flex: 1 },
  studentName: { fontSize: 16, fontWeight: '600', color: '#333' },
  studentId: { fontSize: 13, color: '#999', marginTop: 2 },
  scoreContainer: { alignItems: 'flex-end', backgroundColor: '#F8F9FA', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  scoreLabel: { fontSize: 10, color: '#AAA', textTransform: 'uppercase' },
  scoreValue: { fontSize: 18, fontWeight: 'bold', color: '#2ECC71' },
  playgroundCard: { backgroundColor: '#FFF', marginHorizontal: 16, borderRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  label: { fontSize: 14, fontWeight: '700', color: '#555', marginBottom: 10, marginTop: 10, textTransform: 'uppercase' },
  actionButton: { flexDirection: 'row', backgroundColor: '#6C5CE7', paddingVertical: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  actionButtonText: { color: '#FFF', fontWeight: '600', marginLeft: 10, fontSize: 15 },
  dividerSimple: { height: 1, backgroundColor: '#EEE', marginVertical: 15 },
  radioGroup: { backgroundColor: '#F8F9FA', padding: 15, borderRadius: 10 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkText: { marginLeft: 10, fontSize: 15, color: '#333' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7FA', borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: '#E1E1E1', marginBottom: 15 },
  inputModern: { flex: 1, height: 50, fontSize: 16, color: '#333', paddingHorizontal: 10, borderRadius: 10 },
  customBtn: { flexDirection: 'row', paddingVertical: 14, backgroundColor: '#4A90E2', borderRadius: 30, alignItems: 'center', justifyContent: 'center', width: '100%' },
  customBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  headerBackground: { height: 280, backgroundColor: '#1867C0', paddingTop: 60, paddingHorizontal: 20, position: 'relative', overflow: 'hidden', borderBottomRightRadius: 50 },
  circleDecoration: { position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: '#ffffff10' },
  headerContent: { alignItems: 'center' },
  headerTitle: { fontSize: 20, color: '#AAB7B8', fontWeight: '600', letterSpacing: 2, marginBottom: 5 },
  headerSchool: { fontSize: 28, color: '#FFF', fontWeight: 'bold' },
  contentContainer: { flex: 1, alignItems: 'center', marginTop: -100 },
  card: { width: width * 0.9, backgroundColor: '#FFF', borderRadius: 25, padding: 25, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 15 },
  avatarWrapper: { position: 'relative', marginBottom: 15 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#FFF', backgroundColor: '#EEE' },
  activeBadge: { position: 'absolute', bottom: 5, right: 5, width: 20, height: 20, borderRadius: 10, backgroundColor: '#2ECC71', borderWidth: 3, borderColor: '#FFF' },
  editIconBadge: { position: 'absolute', top: 5, right: -5, width: 26, height: 26, borderRadius: 13, backgroundColor: '#1867C0', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
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
  buttonShadow: { marginTop: 10, backgroundColor: '#1867C0', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, width: '100%', shadowColor: "#2C3E50", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginRight: 10 },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, width: width * 0.8, overflow: 'hidden'},
  modalHeaderDecor: { width: '150%', height: 100, position: 'absolute', top: -30, borderBottomLeftRadius: 100, borderBottomRightRadius: 100, justifyContent: 'center', alignItems: 'center', paddingTop: 20},
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 5, color: '#2C3E50' },
  modalText: { marginBottom: 10, fontSize: 16, color: '#333' },
});