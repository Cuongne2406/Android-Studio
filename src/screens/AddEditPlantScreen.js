import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addPlant, updatePlant } from '../store/slices/gardenSlice';
import { Colors, Typography, Spacing, Shadows } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddEditPlantScreen({ route, navigation }) {
    const dispatch = useDispatch();
    const isEdit = route.params?.plant ? true : false;
    const plant = route.params?.plant;

    const [plantName, setPlantName] = useState(plant ? plant.plantName : '');
    const [notes, setNotes] = useState(plant ? plant.notes : '');
    const [waterStatus, setWaterStatus] = useState(plant ? plant.waterStatus : 'Cần tưới');
    const [imageUrl, setImageUrl] = useState(plant ? plant.imageUrl : 'https://cdn-icons-png.flaticon.com/512/628/628283.png');

    const { isDarkMode } = useSelector((state) => state.ui);
    const theme = isDarkMode ? Colors.dark : Colors.light;

    const handleSave = async () => {
        if (!plantName) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Lỗi', 'Vui lòng nhập tên cây');
            return;
        }

        const data = { plantName, notes, waterStatus, imageUrl };

        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            if (isEdit) {
                await dispatch(updatePlant({ id: plant._id, data })).unwrap();
            } else {
                await dispatch(addPlant(data)).unwrap();
            }
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.goBack();
        } catch (e) {
            Alert.alert("Lỗi", "Không thể lưu thông tin. Vui lòng thử lại.");
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.background }]}
        >
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <TouchableOpacity 
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        navigation.goBack();
                    }} 
                    style={[styles.backButton, { backgroundColor: theme.card }]}
                >
                    <Ionicons name="chevron-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                    {isEdit ? 'Chỉnh Sửa' : 'Thêm Cây Mới'}
                </Text>
                <View style={{ width: 45 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.imageSection}>
                    <View style={[styles.imageWrapper, Shadows.medium]}>
                        <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
                        <TouchableOpacity style={[styles.editImageBtn, { backgroundColor: Colors.primary }]}>
                            <Ionicons name="camera" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.text }]}>Tên cây</Text>
                        <View style={[styles.inputWrapper, { backgroundColor: theme.card, borderColor: theme.border }]}>
                            <Ionicons name="leaf-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                value={plantName}
                                onChangeText={setPlantName}
                                placeholder="VD: Cây Trầu Bà"
                                placeholderTextColor={theme.subText}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.text }]}>Ghi chú chăm sóc</Text>
                        <View style={[styles.inputWrapper, styles.textAreaWrapper, { backgroundColor: theme.card, borderColor: theme.border }]}>
                            <TextInput
                                style={[styles.input, styles.textArea, { color: theme.text }]}
                                value={notes}
                                onChangeText={setNotes}
                                placeholder="VD: Tưới 2 lần/tuần, để nơi mát mẻ..."
                                placeholderTextColor={theme.subText}
                                multiline
                                numberOfLines={4}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.text }]}>Tình trạng</Text>
                        <View style={[styles.statusToggle, { backgroundColor: theme.card, borderColor: theme.border }]}>
                            <TouchableOpacity 
                                style={[styles.statusOption, waterStatus === 'Cần tưới' && { backgroundColor: Colors.warning }]}
                                onPress={() => {
                                    setWaterStatus('Cần tưới');
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }}
                            >
                                <Ionicons name="water-outline" size={18} color={waterStatus === 'Cần tưới' ? '#fff' : theme.subText} />
                                <Text style={[styles.statusOptionText, { color: waterStatus === 'Cần tưới' ? '#fff' : theme.subText }]}>Cần tưới</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.statusOption, waterStatus === 'Đã tưới' && { backgroundColor: Colors.success }]}
                                onPress={() => {
                                    setWaterStatus('Đã tưới');
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }}
                            >
                                <Ionicons name="water" size={18} color={waterStatus === 'Đã tưới' ? '#fff' : theme.subText} />
                                <Text style={[styles.statusOptionText, { color: waterStatus === 'Đã tưới' ? '#fff' : theme.subText }]}>Đã tưới</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity activeOpacity={0.8} style={styles.saveBtnContainer} onPress={handleSave}>
                        <LinearGradient
                            colors={[Colors.primary, '#3A6347']}
                            style={[styles.saveBtn, Shadows.medium]}
                        >
                            <Text style={styles.saveBtnText}>{isEdit ? 'Cập Nhật Thay Đổi' : 'Thêm Vào Khu Vườn'}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    backButton: { 
        width: 45, height: 45, borderRadius: 22.5,
        justifyContent: 'center', alignItems: 'center',
        ...Shadows.small,
    },
    headerTitle: { ...Typography.title, fontSize: 22 },
    content: { padding: Spacing.l },
    imageSection: {
        alignItems: 'center',
        marginVertical: Spacing.xl,
    },
    imageWrapper: {
        width: 150, height: 150, borderRadius: 75,
        position: 'relative',
    },
    imagePreview: {
        width: 150, height: 150, borderRadius: 75,
        borderWidth: 4, borderColor: '#fff',
    },
    editImageBtn: {
        position: 'absolute', bottom: 5, right: 5,
        width: 40, height: 40, borderRadius: 20,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 3, borderColor: '#fff',
    },
    form: {
        marginTop: Spacing.m,
    },
    inputGroup: { marginBottom: Spacing.l },
    label: { ...Typography.body, fontWeight: '700', marginBottom: 12, marginLeft: 5 },
    inputWrapper: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderRadius: 18, paddingHorizontal: 15,
        height: 60,
    },
    inputIcon: { marginRight: 12 },
    input: {
        flex: 1, fontSize: 16, height: '100%',
    },
    textAreaWrapper: {
        height: 120, alignItems: 'flex-start', paddingTop: 15,
    },
    textArea: { height: '100%', textAlignVertical: 'top' },
    statusToggle: {
        flexDirection: 'row',
        padding: 5,
        borderRadius: 20,
        borderWidth: 1,
    },
    statusOption: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 12, borderRadius: 15, gap: 8,
    },
    statusOptionText: { fontWeight: 'bold', fontSize: 14 },
    saveBtnContainer: { marginTop: Spacing.xl },
    saveBtn: {
        height: 65, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    },
    saveBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
