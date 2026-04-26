import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { Colors, Typography, Spacing, Shadows } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function OrderHistoryScreen({ navigation }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userToken } = useSelector((state) => state.auth);
    const { isDarkMode } = useSelector((state) => state.ui);
    const theme = isDarkMode ? Colors.dark : Colors.light;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const axios = require('axios');
                const { API_URL } = require('../config/api');
                const { data } = await axios.get(`${API_URL}/orders`, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                setOrders(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [userToken]);

    const renderOrderItem = ({ item, index }) => (
        <Animated.View entering={FadeInUp.delay(index * 100)}>
            <View style={[styles.orderCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.orderHeader}>
                    <View>
                        <Text style={[styles.orderId, { color: theme.text }]}>Mã ĐH: #{item._id.slice(-6).toUpperCase()}</Text>
                        <Text style={[styles.orderDate, { color: theme.subText }]}>
                            {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                        </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: item.status === 'Hoàn thành' ? Colors.success + '20' : Colors.warning + '20' }]}>
                        <Text style={[styles.statusText, { color: item.status === 'Hoàn thành' ? Colors.success : Colors.warning }]}>
                            {item.status}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {item.items.map((prod, idx) => (
                    <View key={idx} style={styles.productRow}>
                        <Text style={[styles.productName, { color: theme.text }]}>{prod.name} x{prod.qty}</Text>
                        <Text style={[styles.productPrice, { color: theme.text }]}>{(prod.price * prod.qty).toLocaleString()}đ</Text>
                    </View>
                ))}

                <View style={styles.totalRow}>
                    <Text style={[styles.totalLabel, { color: theme.text }]}>Tổng cộng:</Text>
                    <Text style={[styles.totalValue, { color: Colors.primary }]}>{item.totalPrice.toLocaleString()} VNĐ</Text>
                </View>
            </View>
        </Animated.View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Lịch Sử Đặt Hàng</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item._id}
                    renderItem={renderOrderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="receipt-outline" size={80} color={theme.subText} />
                            <Text style={[styles.emptyText, { color: theme.subText }]}>Bạn chưa có đơn hàng nào.</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 60, paddingBottom: 15, paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    backBtn: { padding: 8 },
    headerTitle: { ...Typography.title, fontSize: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: Spacing.l },
    orderCard: {
        borderRadius: 20, padding: Spacing.m, marginBottom: Spacing.m,
        borderWidth: 1, ...Shadows.small,
    },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    orderId: { fontWeight: 'bold', fontSize: 16 },
    orderDate: { fontSize: 12, marginTop: 2 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 12 },
    productRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    productName: { fontSize: 14 },
    productPrice: { fontSize: 14, fontWeight: '500' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
    totalLabel: { fontWeight: 'bold' },
    totalValue: { fontWeight: 'bold', fontSize: 16 },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { marginTop: 20, fontSize: 16 }
});
