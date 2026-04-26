import React, { useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlants } from '../store/slices/plantSlice';
import { Colors, Typography, Spacing, Shadows } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { CartContext } from '../context/CartContext';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from '../components/Toast';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function StoreScreen({ navigation }) {
    const dispatch = useDispatch();
    const toastRef = useRef(null);
    const { data: plants, loading } = useSelector((state) => state.plants);
    const { isDarkMode } = useSelector((state) => state.ui);
    const { cart, addToCart } = useContext(CartContext);
    const theme = isDarkMode ? Colors.dark : Colors.light;

    const cartCount = cart.reduce((total, item) => total + item.qty, 0);

    useEffect(() => {
        dispatch(fetchPlants());
    }, [dispatch]);

    const handleAddToCart = (plant) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        addToCart(plant);
        toastRef.current?.show(`Đã thêm ${plant.name} vào giỏ hàng`);
    };

    const renderPlantItem = ({ item, index }) => (
        <Animated.View 
            entering={FadeInUp.delay(index * 100).springify()}
            layout={Layout.springify()}
        >
            <TouchableOpacity 
                activeOpacity={0.9}
                style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => navigation.navigate('PlantDetail', { plant: item })}
            >
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.imageUrl }} style={styles.plantImage} resizeMode="cover" />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.1)']}
                        style={StyleSheet.absoluteFill}
                    />
                </View>
                <View style={styles.cardContent}>
                    <View>
                        <Text style={[styles.plantName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                        <View style={styles.categoryBadge}>
                            <Text style={[styles.plantCategory, { color: Colors.primary }]}>{item.category}</Text>
                        </View>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={[styles.plantPrice, { color: theme.text }]}>
                            {item.price.toLocaleString()} VNĐ
                        </Text>
                        <TouchableOpacity 
                            style={[styles.iconButton, { backgroundColor: Colors.primary }]}
                            onPress={() => handleAddToCart(item)}
                        >
                            <Ionicons name="add" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Toast ref={toastRef} />
            
            <View style={styles.heroContainer}>
                <LinearGradient
                    colors={[Colors.primary, '#3A6347']}
                    style={styles.header}
                >
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.headerTitle}>GreenSpace</Text>
                            <Text style={styles.headerSubtitle}>Tìm mảng xanh cho bạn</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartBtn}>
                            <Ionicons name="basket-outline" size={28} color="#fff" />
                            {cartCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{cartCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
                <View style={[styles.headerCurve, { backgroundColor: theme.background }]} />
            </View>

            <FlatList
                data={plants}
                keyExtractor={(item) => item._id}
                renderItem={renderPlantItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => <View style={{ height: 25 }} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    heroContainer: {
        position: 'relative',
        backgroundColor: Colors.primary,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: Spacing.l,
        paddingBottom: 60,
    },
    headerTop: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center'
    },
    headerTitle: {
        ...Typography.header,
        color: '#fff',
        fontSize: 32,
    },
    headerSubtitle: {
        ...Typography.body,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    headerCurve: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    cartBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        paddingHorizontal: Spacing.l,
        paddingBottom: 100,
    },
    card: {
        flexDirection: 'row',
        borderRadius: 24,
        marginBottom: Spacing.m,
        borderWidth: 1,
        overflow: 'hidden',
        ...Shadows.small,
        height: 140,
    },
    imageContainer: {
        width: 140,
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },
    plantImage: {
        width: '100%',
        height: '100%',
    },
    cardContent: {
        flex: 1,
        padding: Spacing.m,
        justifyContent: 'space-between',
    },
    plantName: {
        ...Typography.title,
        fontSize: 18,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.primary + '15',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginTop: 4,
    },
    plantCategory: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    plantPrice: {
        fontSize: 16,
        fontWeight: '700',
    },
    iconButton: {
        borderRadius: 14,
        padding: 6,
        ...Shadows.small,
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    }
});
