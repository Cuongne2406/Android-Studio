import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { CartContext } from '../context/CartContext';
import { Colors, Typography, Spacing } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../api/client';

export default function CartScreen({ navigation }) {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const { isDarkMode } = useSelector((state) => state.ui);
    const theme = isDarkMode ? Colors.dark : Colors.light;
    const [loading, setLoading] = useState(false);

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        try {
            await apiClient.post('/orders', {
                items: cart,
                totalPrice
            });
            Alert.alert("Thành công", "Đơn hàng của bạn đã được đặt thành công!");
            clearCart();
            navigation.goBack();
        } catch (error) {
            Alert.alert("Lỗi", "Không thể đặt hàng lúc này. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.cardContent}>
                <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.price, { color: Colors.primary }]}>{item.price.toLocaleString()}đ</Text>
                <Text style={[styles.qty, { color: theme.subText }]}>Số lượng: {item.qty}</Text>
            </View>
            <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromCart(item.plantId)}>
                <Ionicons name="trash-outline" size={24} color={Colors.danger} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Giỏ Hàng</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={cart}
                keyExtractor={(item) => item.plantId}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="cart-outline" size={60} color={theme.subText} />
                        <Text style={[styles.emptyText, { color: theme.subText }]}>Giỏ hàng trống.</Text>
                    </View>
                )}
            />

            {cart.length > 0 && (
                <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
                    <View style={styles.totalRow}>
                        <Text style={[styles.totalLabel, { color: theme.text }]}>Tổng cộng:</Text>
                        <Text style={[styles.totalPrice, { color: Colors.primary }]}>{totalPrice.toLocaleString()}đ</Text>
                    </View>
                    <TouchableOpacity style={[styles.checkoutBtn, { backgroundColor: Colors.primary }]} onPress={handleCheckout} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.checkoutText}>Thanh toán</Text>}
                    </TouchableOpacity>
                </View>
            )}
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
    listContainer: { padding: Spacing.m },
    card: {
        flexDirection: 'row', padding: Spacing.m, borderRadius: 15, marginBottom: Spacing.m,
        borderWidth: 1, alignItems: 'center'
    },
    image: { width: 60, height: 60, borderRadius: 10 },
    cardContent: { flex: 1, marginLeft: Spacing.m },
    name: { ...Typography.title, fontSize: 16 },
    price: { ...Typography.body, fontWeight: 'bold', marginTop: 4 },
    qty: { ...Typography.caption, marginTop: 2 },
    removeBtn: { padding: 5 },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { ...Typography.body, marginTop: Spacing.m },
    footer: {
        padding: Spacing.l, borderTopWidth: 1,
    },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.m },
    totalLabel: { ...Typography.title },
    totalPrice: { ...Typography.title, fontWeight: 'bold' },
    checkoutBtn: { padding: 16, borderRadius: 12, alignItems: 'center' },
    checkoutText: { color: '#fff', ...Typography.title, fontWeight: 'bold' }
});
