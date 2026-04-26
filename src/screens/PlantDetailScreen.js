import React, { useContext, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { Colors, Typography, Spacing } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { CartContext } from '../context/CartContext';
import Toast from '../components/Toast';

export default function PlantDetailScreen({ route, navigation }) {
    const { plant } = route.params;
    const toastRef = useRef(null);
    const { isDarkMode } = useSelector((state) => state.ui);
    const theme = isDarkMode ? Colors.dark : Colors.light;
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = () => {
        addToCart(plant);
        toastRef.current?.show("Đã thêm vào giỏ hàng thành công!");
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Toast ref={toastRef} />
            <TouchableOpacity 
                style={[styles.backButton, { backgroundColor: theme.card }]} 
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>

            <Animatable.Image 
                animation="zoomIn"
                duration={800}
                source={{ uri: plant.imageUrl }} 
                style={styles.image} 
            />

            <Animatable.View 
                animation="fadeInUp" 
                duration={800} 
                delay={200}
                style={[styles.contentContainer, { backgroundColor: theme.card, shadowColor: theme.border }]}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.titleRow}>
                        <View>
                            <Text style={[styles.name, { color: theme.text }]}>{plant.name}</Text>
                            <Text style={[styles.category, { color: theme.subText }]}>{plant.category}</Text>
                        </View>
                        <View style={[styles.priceTag, { backgroundColor: Colors.primary + '20' }]}>
                            <Text style={[styles.price, { color: Colors.primary }]}>{plant.price.toLocaleString()}đ</Text>
                        </View>
                    </View>

                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Mô tả</Text>
                    <Text style={[styles.description, { color: theme.subText }]}>
                        {plant.description}
                    </Text>

                    <View style={styles.careInfo}>
                        <View style={[styles.careItem, { backgroundColor: theme.background }]}>
                            <Ionicons name="water-outline" size={24} color={Colors.info} />
                            <Text style={[styles.careText, { color: theme.text }]}>Tưới vừa</Text>
                        </View>
                        <View style={[styles.careItem, { backgroundColor: theme.background }]}>
                            <Ionicons name="sunny-outline" size={24} color={Colors.warning} />
                            <Text style={[styles.careText, { color: theme.text }]}>Ưa bóng râm</Text>
                        </View>
                        <View style={[styles.careItem, { backgroundColor: theme.background }]}>
                            <Ionicons name="thermometer-outline" size={24} color={Colors.danger} />
                            <Text style={[styles.careText, { color: theme.text }]}>18-25°C</Text>
                        </View>
                    </View>

                </ScrollView>
                <TouchableOpacity style={[styles.buyButton, { backgroundColor: Colors.primary }]} onPress={handleAddToCart}>
                    <Text style={styles.buyButtonText}>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: '45%',
        resizeMode: 'cover',
    },
    contentContainer: {
        flex: 1,
        marginTop: -30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: Spacing.l,
        elevation: 10,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.l,
    },
    name: {
        ...Typography.header,
        fontSize: 26,
    },
    category: {
        ...Typography.body,
        marginTop: 4,
    },
    priceTag: {
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.s,
        borderRadius: 20,
    },
    price: {
        ...Typography.title,
        fontWeight: 'bold',
    },
    sectionTitle: {
        ...Typography.title,
        marginBottom: Spacing.s,
    },
    description: {
        ...Typography.body,
        lineHeight: 24,
        marginBottom: Spacing.l,
    },
    careInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.xxl,
    },
    careItem: {
        alignItems: 'center',
        padding: Spacing.m,
        borderRadius: 15,
        flex: 1,
        marginHorizontal: 5,
    },
    careText: {
        ...Typography.caption,
        marginTop: Spacing.xs,
        fontWeight: '600',
    },
    buyButton: {
        paddingVertical: 18,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 'auto',
    },
    buyButtonText: {
        color: '#fff',
        ...Typography.title,
        fontWeight: 'bold',
    }
});
