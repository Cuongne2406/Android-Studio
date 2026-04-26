import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setDarkMode } from '../store/slices/uiSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Typography, Spacing } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
    const dispatch = useDispatch();
    const { isDarkMode } = useSelector((state) => state.ui);
    const theme = isDarkMode ? Colors.dark : Colors.light;

    const toggleSwitch = async () => {
        const newValue = !isDarkMode;
        dispatch(setDarkMode(newValue));
        await AsyncStorage.setItem('isDarkMode', JSON.stringify(newValue));
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Cài Đặt</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={[styles.settingItem, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                    <View style={styles.settingLeft}>
                        <Ionicons name="moon-outline" size={24} color={theme.text} />
                        <Text style={[styles.settingText, { color: theme.text }]}>Giao diện tối (Dark Mode)</Text>
                    </View>
                    <Switch
                        trackColor={{ false: "#767577", true: Colors.primary }}
                        thumbColor={isDarkMode ? "#f4f3f4" : "#f4f3f4"}
                        onValueChange={toggleSwitch}
                        value={isDarkMode}
                    />
                </View>
                
                <View style={[styles.settingItem, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                    <View style={styles.settingLeft}>
                        <Ionicons name="notifications-outline" size={24} color={theme.text} />
                        <Text style={[styles.settingText, { color: theme.text }]}>Nhận thông báo</Text>
                    </View>
                    <Switch
                        trackColor={{ false: "#767577", true: Colors.primary }}
                        thumbColor={"#f4f3f4"}
                        value={true}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20,
        borderBottomWidth: 1, borderBottomColor: '#eee',
    },
    headerTitle: { ...Typography.title },
    backButton: { padding: 5 },
    content: { padding: Spacing.m },
    settingItem: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: Spacing.l, borderRadius: 12, marginBottom: Spacing.s,
    },
    settingLeft: { flexDirection: 'row', alignItems: 'center' },
    settingText: { ...Typography.body, marginLeft: Spacing.m }
});
