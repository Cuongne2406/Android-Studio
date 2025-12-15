import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { top100AvgPoint, top10AvgTrainingPoint  } from './studentStatistics';
import { class1 } from './studentStatistics';


const { width } = Dimensions.get('window');

const Excercise1 = () => {
  return (
    <ScrollView styles = {styles.container}>
      <Text style={styles.title}>Danh sacsh vieen có điểm cao xuống thấp</Text>
      {top100AvgPoint.map(student => (
        <Text key={student.mssv}>{student.name}: {student.avgPoint}</Text>      
      ))}
      <Text style={styles.title}>Danh sacsh vieen có điểm ren luyen xuống thấp</Text>
      {top10AvgTrainingPoint.map(student => (
        <Text key={student.mssv}>{student.name}: {student.avgPoint}</Text>      
      ))}
    </ScrollView>
  )
}
export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* --- BACKGROUND HEADER --- */}
      <View style={styles.headerBackground}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>HỒ SƠ SINH VIÊN</Text>
          <Text style={styles.headerSchool}>Đại Học Lạc Hồng</Text>
        </View>
        {/* Vòng tròn trang trí nền */}
        <View style={styles.circleDecoration} />
      </View>

      {/* --- MAIN CONTENT --- */}
      <View style={styles.contentContainer}>
        
        {/* PROFILE CARD */}
        <View style={styles.card}>
          
          <View style={styles.avatarWrapper}>
             <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
                style={styles.avatar} 
            />
            <View style={styles.activeBadge} />
          </View>

          <Text style={styles.nameText}>Nguyễn Trung Cường</Text>
          <Text style={styles.idText}>MSSV: 123000991</Text>
          <Text style={styles.majorText}>Khoa Công Nghệ Thông Tin</Text>

          {/* Dòng kẻ mờ */}
          <View style={styles.divider} />

          {/* INFO SECTIONS */}
          <View style={styles.infoList}>
            <InfoItem 
              icon="school-outline" 
              label="Trường" 
              value="Đại học Lạc Hồng" 
              color="#4A90E2"
            />
             <InfoItem 
              icon="person-tie" 
              library="MaterialCommunityIcons"
              label="GVCN" 
              value="Nguyễn Khắc Hoàng" 
              color="#FF6B6B"
            />
            <InfoItem 
              icon="calendar-outline" 
              label="Niên khóa" 
              value="2023 - 2027" 
              color="#F5A623"
            />
             <InfoItem 
              icon="location-outline" 
              label="Cơ sở" 
              value="Cơ sở 1 - Biên Hòa" 
              color="#7ED321"
            />
          </View>

          {/* BUTTON */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Xem Bảng Điểm</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}

// Component hiển thị từng dòng thông tin
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

const sortedByPoint = [...class1].sort((a, b) => b.avgPoint - a.avgPoint);
const sortedByTrainingPoint = [...class1].sort((a, b) => b.avgTrainingPoint - a.avgTrainingPoint);
return (
  <SafeAreaView style={styles.container}>
    <StatusBar style="dark" />
    
    {/* Header */}
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Bài Tập 1</Text>
    </View>

    <ScrollView contentContainerStyle={styles.scrollContent}>
      
      {/* --- PHẦN 1: DANH SÁCH THEO ĐIỂM SỐ --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Danh sách sinh viên có điểm số từ cao xuống thấp:
        </Text>
        {sortedByPoint.map((student, index) => (
          <Text key={index} style={styles.itemText}>
            {student.name}: {student.avgPoint}
          </Text>
        ))}
      </View>

      {/* --- PHẦN 2: DANH SÁCH THEO ĐIỂM RÈN LUYỆN --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Danh sách sinh viên có điểm rèn luyện từ cao xuống thấp:
        </Text>
        {sortedByTrainingPoint.map((student, index) => (
          <Text key={index} style={styles.itemText}>
            {student.name}: {student.avgTrainingPoint}
          </Text>
        ))}
      </View>

    </ScrollView>

    {/* Footer giả lập Tab Bar giống hình mẫu */}
    <View style={styles.tabBar}>
        <View style={styles.tabItem}>
           <Text style={[styles.tabText, styles.activeTab]}>Bài Tập 1</Text>
        </View>
        <View style={styles.tabItem}>
           <Text style={styles.tabText}>Bài Tập 2</Text>
        </View>
        <View style={styles.tabItem}>
           <Text style={styles.tabText}>Bài Tập 3</Text>
        </View>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Màu nền xám xanh rất nhạt
    paddingTop: 50,
  },
  headerBackground: {
    height: 280,
    backgroundColor: '#1867C0', // Màu xanh đen sang trọng
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
    backgroundColor: '#ffffff10', // Trắng mờ 10%
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#AAB7B8',
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 5,
  },
  headerSchool: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: -100, // Đẩy nội dung lên đè header
  },
  card: {
    width: width * 0.9,
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    // Shadow xịn
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFF',
    backgroundColor: '#EEE',
  },
  activeBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2ECC71', // Màu xanh online
    borderWidth: 3,
    borderColor: '#FFF',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34495E',
    marginBottom: 5,
  },
  idText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 5,
    fontWeight: '500',
  },
  majorText: {
     fontSize: 14,
     color: '#3498DB',
     fontWeight: '600',
     backgroundColor: '#3498DB15',
     paddingHorizontal: 12,
     paddingVertical: 4,
     borderRadius: 15,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 20,
  },
  infoList: {
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#95A5A6',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
  },
  button: {
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
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  }
});