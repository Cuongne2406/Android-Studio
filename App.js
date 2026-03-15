import { 
  StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, 
  Dimensions, TextInput, KeyboardAvoidingView, 
  Alert, Modal, SectionList, Pressable, Platform, RefreshControl,
  ActivityIndicator, FlatList
} from 'react-native';
import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { top100StudentsByAvgPoint, top10StudentsByAvgTrainingPoint } from './studentStatistics';
import { Picker } from '@react-native-picker/picker'; // Dùng Picker làm AutoComplete/Spinner drop-down

const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// --- CONTEXT ---
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false); 
  const [profileAvatar, setProfileAvatar] = useState('https://cdn-icons-png.flaticon.com/512/3135/3135715.png');
  const [profileData, setProfileData] = useState({
    name: "Nguyễn Trung Cường", id: "123000991", major: "Khoa Công Nghệ Thông Tin",
    school: "Đại học Lạc Hồng", teacher: "Nguyễn Khắc Hoàng", year: "2023 - 2027",
    address: "Cơ sở 1 - Biên Hòa", avgPoint: 10, trainingPoint: 10, rank: "Xuất sắc"
  });

  const [studentsData, setStudentsData] = useState({ point: top100StudentsByAvgPoint, training: top10StudentsByAvgTrainingPoint });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Quản lý trạng thái Đăng nhập

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedAvatar = await AsyncStorage.getItem('profileAvatar');
        const savedProfile = await AsyncStorage.getItem('profileData');
        const savedTheme = await AsyncStorage.getItem('isDarkMode');
        const savedLogin = await AsyncStorage.getItem('isLoggedIn');
        
        if (savedAvatar) setProfileAvatar(savedAvatar);
        if (savedProfile) setProfileData(JSON.parse(savedProfile));
        if (savedTheme !== null) setIsDarkMode(JSON.parse(savedTheme));
        if (savedLogin !== null) setIsLoggedIn(JSON.parse(savedLogin));
      } catch (error) { console.log(error); } finally { setIsReady(true); }
    };
    loadData();
  }, []);

  const updateAvatar = async (uri) => { setProfileAvatar(uri); await AsyncStorage.setItem('profileAvatar', uri); };
  const updateProfileData = async (newData) => { setProfileData(newData); await AsyncStorage.setItem('profileData', JSON.stringify(newData)); };
  const toggleDarkMode = async (value) => { setIsDarkMode(value); await AsyncStorage.setItem('isDarkMode', JSON.stringify(value)); };
  const loginApp = async () => { setIsLoggedIn(true); await AsyncStorage.setItem('isLoggedIn', 'true'); };
  const logoutApp = async () => { setIsLoggedIn(false); await AsyncStorage.setItem('isLoggedIn', 'false'); };

  if (!isReady) return null; 

  return (
    <AppContext.Provider value={{
      profileAvatar, updateAvatar, profileData, updateProfileData,
      studentsData, setStudentsData, isDarkMode, toggleDarkMode,
      isLoggedIn, loginApp, logoutApp
    }}>
      {children}
    </AppContext.Provider>
  );
};

// --- MÀN HÌNH ĐĂNG NHẬP (LAB 4 - CẢI THIỆN SPINNER & AUTOCOMPLETE) ---
const LoginScreen = () => {
   const { loginApp, isDarkMode } = useContext(AppContext);
   const [mssv, setMssv] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   
   // Dữ liệu gợi ý thông minh (Lab 4 - Yêu cầu 2: AutoComplete)
   const accounts = [
       { label: "123000991 - Nguyễn Trung Cường", value: "123000991" },
       { label: "123000111 - Nguyễn Hậu", value: "123000111" },
       { label: "123000194 - Phú Trần", value: "123000194" }
   ];

   const [filteredAccounts, setFilteredAccounts] = useState([]);
   const [showSuggestions, setShowSuggestions] = useState(false);

   const handleMssvChange = (text) => {
       setMssv(text);
       if (text.length > 0) {
           const filtered = accounts.filter(acc => 
               acc.value.includes(text) || acc.label.toLowerCase().includes(text.toLowerCase())
           );
           setFilteredAccounts(filtered);
           setShowSuggestions(filtered.length > 0);
       } else {
           setShowSuggestions(false);
       }
   };

   const selectAccount = (value) => {
       setMssv(value);
       setShowSuggestions(false);
   };

   const handleLogin = () => {
       if(!mssv || !password) {
           Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
           return;
       }
       setLoading(true); // Kích hoạt Spinner
       setTimeout(() => {
           setLoading(false);
           if(password === "123456") {
               loginApp();
           } else {
               Alert.alert("Lỗi", "Mật khẩu sai! Gợi ý: 123456");
           }
       }, 2000); 
   };

   return (
       <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1, backgroundColor: isDarkMode ? '#1e272e' : '#F5F7FA', justifyContent: 'center', alignItems: 'center'}}>
           <View style={[styles.loginCard, {backgroundColor: isDarkMode ? '#2d3436' : '#FFF'}]}>
               <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/2950/2950942.png'}} style={styles.loginLogo} />
               <Text style={[styles.loginTitle, {color: isDarkMode ? '#FFF' : '#2C3E50'}]}>Quản Lý Sinh Viên</Text>
               <Text style={styles.loginSub}>Đăng nhập để tiếp tục</Text>
               
               {/* 1. AutoComplete Smart Input (Thay thế Spinner Picker cũ) */}
               <View style={[styles.inputGroup, { zIndex: 100 }]}>
                   <Text style={[styles.inputLabel, {color: isDarkMode ? '#b2bec3' : '#7F8C8D'}]}>Tài khoản (Nhập MSSV)</Text>
                   <View style={[styles.inputWrapper, {backgroundColor: isDarkMode ? '#3d4447' : '#F5F7FA', borderColor: isDarkMode ? '#3d4447' : '#E1E1E1'}]}>
                       <Ionicons name="person" size={20} color="#666" style={{marginRight: 10}} />
                       <TextInput 
                            style={[styles.inputModern, {color: isDarkMode ? '#FFF' : '#333'}]}
                            placeholder="Nhập MSSV"
                            placeholderTextColor="#999"
                            value={mssv}
                            onChangeText={handleMssvChange}
                            onFocus={() => mssv.length > 0 && setShowSuggestions(true)}
                       />
                   </View>
                   
                   {/* Gợi ý Dropdown */}
                   {showSuggestions && (
                       <View style={[styles.suggestionContainer, {backgroundColor: isDarkMode ? '#3d4447' : '#FFF', borderColor: isDarkMode ? '#555' : '#E1E1E1'}]}>
                           {filteredAccounts.map((item, index) => (
                               <TouchableOpacity 
                                    key={index} 
                                    style={styles.suggestionItem}
                                    onPress={() => selectAccount(item.value)}
                               >
                                   <Text style={{color: isDarkMode ? '#FFF' : '#333'}}>{item.label}</Text>
                               </TouchableOpacity>
                           ))}
                       </View>
                   )}
               </View>

               {/* 2. Password */}
               <View style={styles.inputGroup}>
                   <Text style={[styles.inputLabel, {color: isDarkMode ? '#b2bec3' : '#7F8C8D'}]}>Mật khẩu</Text>
                   <View style={[styles.inputWrapper, {backgroundColor: isDarkMode ? '#3d4447' : '#F5F7FA', borderColor: isDarkMode ? '#3d4447' : '#E1E1E1'}]}>
                       <Ionicons name="lock-closed" size={20} color="#666" style={{marginRight: 10}} />
                       <TextInput 
                          style={[styles.inputModern, {color: isDarkMode ? '#FFF' : '#333'}]}
                          placeholder="Mật khẩu là 123456"
                          placeholderTextColor="#999"
                          secureTextEntry={!showPassword}
                          value={password}
                          onChangeText={setPassword}
                       />
                       <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                           <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#666" />
                       </TouchableOpacity>
                   </View>
               </View>

               {/* 3. Spinner Loading Button (Cải thiện hiệu ứng chờ) */}
               <TouchableOpacity 
                   style={[styles.customBtn, { marginTop: 20, backgroundColor: loading ? '#bdc3c7' : '#4A90E2' }]} 
                   onPress={handleLogin}
                   disabled={loading}
               >
                   {loading ? (
                       <ActivityIndicator size="small" color="#FFF" />
                   ) : (
                       <Text style={styles.customBtnText}>Đăng Nhập</Text>
                   )}
               </TouchableOpacity>
           </View>
       </KeyboardAvoidingView>
   )
}

// --- MÀN HÌNH 1: CHI TIẾT HỒ SƠ & GRID VIEW CÁC KHOA (LAB 4 - YÊU CẦU 3) ---
const Excercise1 = () => {
  const { profileAvatar, updateAvatar, profileData, updateProfileData, isDarkMode } = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false); 
  const [editName, setEditName] = useState(profileData.name);
  const [editId, setEditId] = useState(profileData.id);

  // Data cho lưới GridView & AutoComplete Khoa
  const gridData = [
     { id: '1', title: 'Công Nghệ Thông Tin', icon: 'laptop', color: '#4A90E2' },
     { id: '2', title: 'Khoa Cơ Điện', icon: 'cog', color: '#E67E22' },
     { id: '3', title: 'Khoa Dược', icon: 'flask', color: '#2ECC71' },
     { id: '4', title: 'Ngôn Ngữ Anh', icon: 'alphabetical', color: '#9B59B6' },
     { id: '5', title: 'Quản Trị Kinh Doanh', icon: 'chart-pie', color: '#F1C40F' },
     { id: '6', title: 'Luật Kinh Tế', icon: 'scale-balance', color: '#E74C3C' }
  ];

  const [editMajor, setEditMajor] = useState(profileData.major);
  const [filteredMajors, setFilteredMajors] = useState([]);
  const [showMajorSuggestions, setShowMajorSuggestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleMajorChange = (text) => {
      setEditMajor(text);
      if (text.length > 0) {
          const filtered = gridData.filter(item => item.title.toLowerCase().includes(text.toLowerCase()));
          setFilteredMajors(filtered);
          setShowMajorSuggestions(filtered.length > 0);
      } else {
          setShowMajorSuggestions(false);
      }
  };

  const bgColor = isDarkMode ? '#1e272e' : '#F5F7FA';
  const cardColor = isDarkMode ? '#2d3436' : '#FFF';
  const textColor = isDarkMode ? '#FFF' : '#333';
  const subTextColor = isDarkMode ? '#b2bec3' : '#7F8C8D';
  const dividerColor = isDarkMode ? '#4a4a4a' : '#F0F0F0';

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled) updateAvatar(result.assets[0].uri); 
  };

  const saveProfile = () => {
    if(!editName.trim() || !editId.trim() || !editMajor.trim()){ Alert.alert("Lỗi", "Vui lòng không bỏ trống thông tin!"); return; }
    setIsSaving(true);
    setTimeout(() => {
        updateProfileData({ ...profileData, name: editName, id: editId, major: editMajor });
        setIsSaving(false);
        setEditModalVisible(false);
    }, 1500); // Giả lập Spinner lưu 1.5s
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: bgColor}} showsVerticalScrollIndicator={false}>
      {/* (LAB 4 - Yêu Cầu 4): Đổi màu StatusBar */}
      <StatusBar style="light" backgroundColor="#1867C0" />
      <View style={styles.headerBackground}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>HỒ SƠ SINH VIÊN</Text>
          <Text style={styles.headerSchool}>{profileData.school}</Text>
        </View>
        <View style={styles.circleDecoration} />
      </View>

      <View style={styles.contentContainer}>
        <View style={[styles.card, {backgroundColor: cardColor}]}>
          <TouchableOpacity style={{position: 'absolute', top: 25, right: 25}} onPress={() => { setEditName(profileData.name); setEditId(profileData.id); setEditModalVisible(true) }}>
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
          
          <TouchableOpacity style={[styles.buttonShadow, {width: '80%', paddingVertical: 12}]} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Xem Bảng Điểm</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* LAB 4 - YÊU CẦU 3: Sử dụng GridView */}
      <View style={{paddingHorizontal: 20, marginTop: 15}}>
          <Text style={[styles.sectionTitleModern, {color: textColor, marginBottom: 15, marginLeft: 0}]}>Danh Sách Các Khoa</Text>
          <FlatList 
             data={gridData}
             keyExtractor={(item) => item.id}
             numColumns={2} 
             scrollEnabled={false} // Vì đang bọc bên trong ScrollView cha
             columnWrapperStyle={{justifyContent: 'space-between', marginBottom: 15}}
             renderItem={({item}) => (
                 <View style={[styles.gridItem, {backgroundColor: cardColor}]}>
                      <View style={[styles.gridIcon, {backgroundColor: item.color + '20'}]}>
                          <MaterialCommunityIcons name={item.icon} size={30} color={item.color} />
                      </View>
                      <Text style={[styles.gridTitle, {color: textColor}]} numberOfLines={2} textAlign="center">{item.title}</Text>
                 </View>
             )}
          />
      </View>
      <View style={{height: 30}} />

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

      <Modal animationType="fade" transparent={true} visible={editModalVisible} onRequestClose={() => setEditModalVisible(false)} >
         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBackground}>
          <View style={[styles.modalView, {backgroundColor: cardColor}]}>
            <Text style={[styles.modalTitle, {color: textColor, marginTop: 10}]}>Chỉnh Sửa Hồ Sơ</Text>
            <View style={{width: '100%', marginTop: 20}}>
                <Text style={[styles.label, {color: isDarkMode ? '#b2bec3' : '#333', fontWeight: 'bold'}]}>Họ và Tên</Text>
                <TextInput style={[styles.inputModern, {backgroundColor: isDarkMode?'#3d4447':'#F0F2F5', color: isDarkMode ? '#FFF' : '#000', marginBottom: 15, paddingHorizontal: 15, borderRadius: 10}]} value={editName} onChangeText={setEditName}/>
                <Text style={[styles.label, {color: isDarkMode ? '#b2bec3' : '#333', fontWeight: 'bold'}]}>Mã Số Sinh Viên</Text>
                <TextInput style={[styles.inputModern, {backgroundColor: isDarkMode?'#3d4447':'#F0F2F5', color: isDarkMode ? '#FFF' : '#000', marginBottom: 15, paddingHorizontal: 15, borderRadius: 10}]} value={editId} onChangeText={setEditId} keyboardType="numeric"/>
                
                {/* AutoComplete cho Khoa */}
                <Text style={[styles.label, {color: subTextColor}]}>Khoa / Ngành (Gợi ý)</Text>
                <View style={{zIndex: 1000}}>
                    <TextInput 
                        style={[styles.inputModern, {backgroundColor: isDarkMode?'#3d4447':'#F0F2F5', color: isDarkMode ? '#FFF' : '#000', paddingHorizontal: 15, borderRadius: 10}]} 
                        value={editMajor} 
                        onChangeText={handleMajorChange}
                        placeholder="VD: Công Nghệ Thông Tin"
                        placeholderTextColor="#999"
                    />
                    {showMajorSuggestions && (
                        <View style={[styles.suggestionContainer, {top: 55, backgroundColor: isDarkMode ? '#3d4447' : '#FFF'}]}>
                            {filteredMajors.map((m, idx) => (
                                <TouchableOpacity key={idx} style={styles.suggestionItem} onPress={() => { setEditMajor(m.title); setShowMajorSuggestions(false); }}>
                                    <Text style={{color: isDarkMode ? '#FFF' : '#333'}}>{m.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 30}}>
                <Pressable style={[styles.customBtn, {backgroundColor: '#95a5a6', width: '45%'}]} onPress={() => setEditModalVisible(false)} disabled={isSaving}><Text style={styles.customBtnText}>Hủy</Text></Pressable>
                <Pressable style={[styles.customBtn, {backgroundColor: isSaving ? '#bdc3c7' : '#2ECC71', width: '45%'}]} onPress={saveProfile} disabled={isSaving}>
                    {isSaving ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.customBtnText}>Lưu</Text>}
                </Pressable>
            </View>
          </View>
         </KeyboardAvoidingView>
      </Modal>

    </ScrollView>
  );
}

// Thẻ sinh viên component 
const StudentCard = ({ index, student, type, onPress, isDark }) => {
  const getRankColor = (idx) => { if (idx === 0) return '#FFD700'; if (idx === 1) return '#C0C0C0'; if (idx === 2) return '#CD7F32'; return '#bdc3c7'; };
  const cardColor = isDark ? '#2d3436' : '#FFF';
  const textColor = isDark ? '#FFF' : '#333';
  const subTextColor = isDark ? '#b2bec3' : '#999';
  const scoreBgColor = isDark ? '#3d4447' : '#F8F9FA';

  return (
    <Pressable style={({ pressed }) => [ styles.cardContainer, { backgroundColor: cardColor, transform: [{ scale: pressed ? 0.98 : 1 }], opacity: pressed ? 0.8 : 1 }]} onPress={() => onPress(student, type, index)}>
      <View style={[styles.rankBadge, { backgroundColor: getRankColor(index) }]}><Text style={styles.rankText}>{index + 1}</Text></View>
      <View style={styles.infoContainer}><Text style={[styles.studentName, {color: textColor}]}>{student.name}</Text><Text style={[styles.studentId, {color: subTextColor}]}>MSSV: {student.id || student.mssv || 'Đang cập nhật'}</Text></View>
      <View style={[styles.scoreContainer, {backgroundColor: scoreBgColor}]}><Text style={styles.scoreLabel}>{type === 'point' ? 'Điểm TB' : 'ĐRL'}</Text><Text style={styles.scoreValue}>{type === 'point' ? student.avgPoint : student.avgTrainingPoint}</Text></View>
    </Pressable>
  );
};

// --- MÀN HÌNH 2: BẢNG XẾP HẠNG ---
const Excercise2 = () => {
  const { studentsData, setStudentsData, isDarkMode } = useContext(AppContext);
  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [refreshing, setRefreshing] = useState(false); 

  const rankingData = [
    { title: 'Top Điểm Học Tập', icon: 'school', iconColor: '#4A90E2', data: studentsData.point, type: 'point' },
    { title: 'Top Điểm Rèn Luyện', icon: 'arm-flex', iconColor: '#FF6B6B', data: studentsData.training, type: 'training' }
  ];

  const onRefresh = () => {
     setRefreshing(true);
     setTimeout(() => {
         setStudentsData({ point: top100StudentsByAvgPoint, training: top10StudentsByAvgTrainingPoint });
         setRefreshing(false);
     }, 1500);
  };

  const handleStudentPress = (student, type, index) => { setSelectedStudent({ ...student, type, rank: index + 1 }); }

  const bgColor = isDarkMode ? '#1e272e' : '#F5F7FA';
  const textColor = isDarkMode ? '#f5f6fa' : '#333';
  const headerBgColor = isDarkMode ? '#2d3436' : '#FFF';
  const dividerColor = isDarkMode ? '#4a4a4a' : '#F0F0F0';

  return (
    <View style={[styles.mainContainer, { backgroundColor: bgColor }]}>
      {/* LAB 4 - YÊU CẦU 4: Đổi màu StatusBar */}
      <StatusBar style={isDarkMode ? "light" : "dark"} backgroundColor={headerBgColor} />
      <View style={[styles.headerSimple, {backgroundColor: headerBgColor, borderBottomColor: dividerColor}]}>
        <Text style={[styles.headerSimpleTitle, {color: textColor}]}>Bảng Xếp Hạng</Text>
        <Text style={styles.headerSimpleSubtitle}>Vuốt xuống để làm mới danh sách</Text>
      </View>

      <SectionList
        sections={rankingData}
        keyExtractor={(item, index) => item.id + index}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4A90E2', '#FF6B6B']} tintColor={isDarkMode ? '#FFF' : '#4A90E2'} /> }
        renderSectionHeader={({ section: { title, icon, iconColor } }) => (
          <View style={[styles.sectionHeader, { backgroundColor: bgColor }]}>
            <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
            <Text style={[styles.sectionTitleModern, {color: textColor}]}>{title}</Text>
          </View>
        )}
        renderItem={({ item, index, section }) => ( <StudentCard isDark={isDarkMode} index={index} student={item} type={section.type} onPress={handleStudentPress} /> )}
        ListFooterComponent={<View style={{ height: 40 }} />}
      />

      <Modal visible={selectedStudent !== null} animationType="fade" transparent={true}>
          <View style={styles.modalBackground}>
              <View style={[styles.modalView, {backgroundColor: headerBgColor}]}>
                 {selectedStudent && (
                     <>
                        <View style={[styles.modalHeaderDecor, {backgroundColor: selectedStudent.type === 'point' ? '#4A90E2' : '#FF6B6B'}]}><MaterialCommunityIcons name="medal" size={40} color="#FFF" /></View>
                        <Text style={[styles.modalTitle, {marginTop: 40, color: textColor}]}>{selectedStudent.name}</Text>
                        <Text style={styles.idText}>MSSV: {selectedStudent.id || selectedStudent.mssv}</Text>
                        <View style={[styles.dividerSimple, {backgroundColor: dividerColor, width: '100%'}]} />
                        <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 15}}>
                            <View style={{alignItems: 'center'}}><Text style={styles.infoLabel}>Xếp hạng</Text><Text style={{fontSize: 22, fontWeight: 'bold', color: '#E67E22'}}>#{selectedStudent.rank}</Text></View>
                            <View style={{alignItems: 'center'}}><Text style={styles.infoLabel}>{selectedStudent.type === 'point' ? 'Điểm TB' : 'ĐRL'}</Text><Text style={{fontSize: 22, fontWeight: 'bold', color: '#2ECC71'}}>{selectedStudent.type === 'point' ? selectedStudent.avgPoint : selectedStudent.avgTrainingPoint}</Text></View>
                        </View>
                        <Pressable style={styles.customBtn} onPress={() => setSelectedStudent(null)}><Text style={styles.customBtnText}>Tuyệt vời</Text></Pressable>
                     </>
                 )}
              </View>
          </View>
      </Modal>
    </View>
  );
}

// Info Item Màn hình 1
const InfoItem = ({ icon, label, value, color, library, isDark }) => {
  return (
    <View style={styles.infoItem}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        {library === 'MaterialCommunityIcons' ? ( <MaterialCommunityIcons name={icon} size={22} color={color} /> ) : ( <Ionicons name={icon} size={22} color={color} /> )}
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
  const { isDarkMode, toggleDarkMode, studentsData, setStudentsData, logoutApp } = useContext(AppContext);
  const [searchText, setSearchText] = useState('');
  const [isAgree, setIsAgree] = useState(false);
  const [studentSuggestions, setStudentSuggestions] = useState([]);
  const [showStudentSuggestions, setShowStudentSuggestions] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const handleSearchChange = (text) => {
      setSearchText(text);
      if (text.length > 0) {
          const allStudents = [...top100StudentsByAvgPoint, ...top10StudentsByAvgTrainingPoint];
          const filtered = allStudents.filter(s => s.name.toLowerCase().includes(text.toLowerCase())).slice(0, 5);
          setStudentSuggestions(filtered);
          setShowStudentSuggestions(filtered.length > 0);
      } else {
          setShowStudentSuggestions(false);
      }
  };

  const filterStudents = () => {
     if(!searchText.trim()) { Alert.alert("Thiếu thông tin", "Vui lòng nhập tên sinh viên cần tìm."); return; }
     setIsFiltering(true);
     setTimeout(() => {
         const lowerSearch = searchText.toLowerCase();
         const filteredPoints = top100StudentsByAvgPoint.filter(s => s.name.toLowerCase().includes(lowerSearch));
         const filteredTraining = top10StudentsByAvgTrainingPoint.filter(s => s.name.toLowerCase().includes(lowerSearch));
         setStudentsData({ point: filteredPoints, training: filteredTraining });
         setIsFiltering(false);
         Alert.alert("Thành công", `Đã lọc danh sách theo từ khóa: "${searchText}"\nHãy sang Tab "Xếp Hạng" để xem kết quả!`);
     }, 1500); // Spinner lọc 1.5s
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
      <StatusBar style={isDarkMode ? "light" : "dark"} backgroundColor={cardColor} />
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
          <View style={{zIndex: 1000}}>
              <View style={[styles.inputWrapper, {backgroundColor: sectionBgColor, borderColor: sectionBgColor}]}>
                <Ionicons name="search" size={20} color={subTextColor} style={{marginRight: 10}} />
                <TextInput 
                    style={[styles.inputModern, {color: textColor}]} 
                    placeholder="Nhập tên sinh viên VD: Cường" 
                    placeholderTextColor={subTextColor} 
                    value={searchText} 
                    onChangeText={handleSearchChange} 
                />
              </View>
              {showStudentSuggestions && (
                  <View style={[styles.suggestionContainer, {top: 55, backgroundColor: isDarkMode ? '#3d4447' : '#FFF'}]}>
                      {studentSuggestions.map((s, idx) => (
                          <TouchableOpacity key={idx} style={styles.suggestionItem} onPress={() => { setSearchText(s.name); setShowStudentSuggestions(false); }}>
                              <Text style={{color: isDarkMode ? '#FFF' : '#333'}}>{s.name}</Text>
                          </TouchableOpacity>
                      ))}
                  </View>
              )}
          </View>
          <View style={{marginTop: 5, marginBottom: 15}}>
            <TouchableOpacity style={styles.checkRow} onPress={() => setIsAgree(!isAgree)}>
              <Ionicons name={isAgree ? "checkbox" : "square-outline"} size={24} color="#2ECC71" />
              <Text style={[styles.checkText, {color: textColor}]}>Cho phép thay đổi trạng thái danh sách</Text>
            </TouchableOpacity>
          </View>
          <Pressable style={({ pressed }) => [ styles.actionButton, { backgroundColor: !isAgree || isFiltering ? '#BDC3C7' : (pressed ? '#27ae60' : '#2ECC71') } ]} disabled={!isAgree || isFiltering} onPress={filterStudents}>
            {isFiltering ? <ActivityIndicator size="small" color="#FFF" /> : (
                <>
                    <Ionicons name="filter" size={20} color="#FFF" />
                    <Text style={styles.actionButtonText}>Thực Hiện Lọc Bộ Nhớ</Text>
                </>
            )}
          </Pressable>

          <View style={[styles.dividerSimple, {backgroundColor: dividerColor}]} />
          
          <Pressable style={[styles.actionButton, {backgroundColor: '#e74c3c'}]} onPress={logoutApp}>
            <Ionicons name="log-out" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Đăng Xuất</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function MainTabs() {
   const { isDarkMode } = useContext(AppContext);
   return (
       <Tab.Navigator initialRouteName="Profile" screenOptions={({ route }) => ({ tabBarIcon: ({ focused, color, size }) => { let iconName; if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline'; else if (route.name === 'Bài Tập 1') iconName = focused ? 'list' : 'list-outline'; else if (route.name === 'Bài Tập 2') iconName = focused ? 'options' : 'options-outline'; return <Ionicons name={iconName} size={size} color={color} />; }, headerShown: false, tabBarStyle: { backgroundColor: isDarkMode ? '#1e272e' : '#FFFFFF', borderTopColor: isDarkMode ? '#2d3436' : '#E0E0E0', }, tabBarActiveTintColor: isDarkMode ? '#4A90E2' : '#1867C0', tabBarInactiveTintColor: isDarkMode ? '#7f8fa6' : '#8e8e8e', })}>
            <Tab.Screen name="Profile" component={Excercise1} options={{title: "Hồ Sơ"}}/>
            <Tab.Screen name="Bài Tập 1" component={Excercise2} options={{title: "Xếp Hạng"}}/>
            <Tab.Screen name="Bài Tập 2" component={Excercise3} options={{title: "Cài Đặt"}}/>
        </Tab.Navigator>
   )
}

function AuthStack() {
   const { isLoggedIn } = useContext(AppContext);
   return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
   );
}

// --- APP ROOT ---
export default function App() {
  return (
    <AppProvider>
        <NavigationContainer>
           <AuthStack />
        </NavigationContainer>
    </AppProvider>
  );
}

// --- STYLES GIỮ NGUYÊN (THÊM CHO LOGIN VÀ GRID) ---
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
  inputModern: { flex: 1, height: 50, fontSize: 16, color: '#333' },
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
  // Login Styles
  loginCard: { width: width * 0.85, padding: 30, borderRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 10, alignItems: 'center'},
  loginLogo: { width: 80, height: 80, marginBottom: 15 },
  loginTitle: { fontSize: 26, fontWeight: 'bold', marginBottom: 5 },
  loginSub: { fontSize: 14, color: '#7F8C8D', marginBottom: 30 },
  inputGroup: { width: '100%', marginBottom: 15 },
  inputLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  // AutoComplete Suggestions
  suggestionContainer: { position: 'absolute', top: 75, left: 0, right: 0, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E1E1E1', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, zIndex: 1000 },
  suggestionItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  // GridView Styles
  gridItem: { width: (width - 55) / 2, padding: 20, borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2},
  gridIcon: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  gridTitle: { fontSize: 14, fontWeight: '600' }
});