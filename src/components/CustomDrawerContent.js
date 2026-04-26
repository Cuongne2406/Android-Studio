import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Typography, Spacing } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';

export default function CustomDrawerContent(props) {
    const { isDarkMode } = useSelector(state => state.ui);
    const theme = isDarkMode ? Colors.dark : Colors.light;
    const dispatch = useDispatch();

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userToken');
        dispatch(logout());
    };

    const { profileData } = useSelector((state) => state.auth);
    const userName = profileData?.name || 'Người Yêu Cây';
    const userEmail = profileData?.email || 'user@greenspace.com';

    return (
        <View style={{ flex: 1, backgroundColor: theme.card }}>
            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
                <View style={[styles.header, { backgroundColor: Colors.primary }]}>
                    <View style={styles.headerTop}>
                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} style={styles.avatar} />
                        <View style={styles.headerInfo}>
                            <Text style={styles.name}>{userName}</Text>
                            <Text style={styles.email}>{userEmail}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.menuContainer}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>

            <View style={[styles.footer, { borderTopColor: theme.border }]}>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color={Colors.danger} />
                    <Text style={[styles.logoutText, { color: Colors.danger }]}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 10,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
    },
    headerInfo: {
        marginLeft: 15,
    },
    name: {
        ...Typography.title,
        color: '#fff',
        fontWeight: 'bold',
    },
    email: {
        ...Typography.caption,
        color: 'rgba(255,255,255,0.8)',
    },
    menuContainer: {
        flex: 1,
        paddingTop: 10,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutText: {
        ...Typography.title,
        marginLeft: 15,
    }
});
