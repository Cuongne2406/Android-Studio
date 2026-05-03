import React, { useEffect, useContext, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlants } from '../store/slices/plantSlice';
import { Colors, Typography, Spacing, Shadows } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { CartContext } from '../context/CartContext';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from '../components/Toast';
import * as Haptics from 'expo-haptics';
import { fetchWeather } from '../services/WeatherService';

const { width } = Dimensions.get('window');

const WeatherWidget = ({ theme }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWeather('Hanoi').then(data => {
            setWeather(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return null;

    return (
        <View style={[styles.weatherCard, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
            {weather ? (
                <View style={styles.weatherInfo}>
                    <Image source={{ uri: `https:${weather.current.condition.icon}` }} style={styles.weatherIcon} />
                    <View>
                        <Text style={styles.weatherTemp}>{weather.current.temp_c}°C</Text>
                        <Text style={styles.weatherCity}>{weather.location.name}</Text>
                    </View>
                </View>
            ) : (
                <Text style={styles.weatherError}>Weather unavailable</Text>
            )}
        </View>
    );
};

import WebLayout from '../components/WebLayout';

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
        toastRef.current?.show(`Acquired ${plant.name} asset`);
    };

    const renderPlantItem = ({ item, index }) => (
        <Animated.View 
            entering={FadeInUp.delay(index * 100).springify()}
            layout={Layout.springify()}
            style={Platform.OS === 'web' && { width: '31%', minWidth: 300, marginBottom: 20 }}
        >
            <TouchableOpacity 
                activeOpacity={0.9}
                style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => navigation.navigate('PlantDetail', { plant: item })}
            >
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.imageUrl }} style={styles.plantImage} resizeMode="cover" />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.2)']}
                        style={StyleSheet.absoluteFill}
                    />
                </View>
                <View style={styles.cardContent}>
                    <View>
                        <Text style={[styles.plantName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                        <View style={[styles.categoryBadge, { backgroundColor: Colors.primary + '20' }]}>
                            <Text style={[styles.plantCategory, { color: Colors.primary }]}>{item.category || 'Neural Core'}</Text>
                        </View>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={[styles.plantPrice, { color: theme.text }]}>
                            {item.price.toLocaleString()} Cr
                        </Text>
                        <TouchableOpacity 
                            style={[styles.iconButton, { backgroundColor: Colors.primary }]}
                            onPress={() => handleAddToCart(item)}
                        >
                            <Ionicons name="download-outline" size={20} color="#fff" />
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

    const content = (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Toast ref={toastRef} />
            
            <View style={styles.heroContainer}>
                <LinearGradient
                    colors={[Colors.primary, Colors.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.headerTitle}>Neural Marketplace</Text>
                            <Text style={styles.headerSubtitle}>Acquire neural enhancements</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartBtn}>
                            <Ionicons name="cube-outline" size={28} color="#fff" />
                            {cartCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{cartCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                    
                    <WeatherWidget theme={theme} />
                </LinearGradient>
                <View style={[styles.headerCurve, { backgroundColor: theme.background }]} />
            </View>

            <FlatList
                data={plants}
                keyExtractor={(item) => item._id}
                renderItem={renderPlantItem}
                numColumns={Platform.OS === 'web' ? 3 : 1}
                key={Platform.OS === 'web' ? 'grid' : 'list'}
                contentContainerStyle={styles.listContainer}
                columnWrapperStyle={Platform.OS === 'web' && { gap: 20 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => <View style={{ height: 10 }} />}
            />
        </View>
    );

    return (
        <WebLayout navigation={navigation} activeRoute="Market">
            {content}
        </WebLayout>
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
        backgroundColor: '#050508',
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
    },
    weatherCard: {
        marginTop: 20,
        borderRadius: 16,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    weatherInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    weatherIcon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    weatherTemp: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    weatherCity: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    weatherError: {
        color: '#fff',
        fontSize: 12,
        fontStyle: 'italic',
    }
});
