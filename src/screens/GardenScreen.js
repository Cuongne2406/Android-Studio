import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, TextInput, RefreshControl, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGarden, removePlant, setRefreshing, optimisticRemove, updatePlant } from '../store/slices/gardenSlice';
import { Colors, Typography, Spacing, Shadows } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

export default function GardenScreen({ navigation }) {
    const dispatch = useDispatch();
    const { data: garden, loading, refreshing } = useSelector((state) => state.garden);
    const { isDarkMode } = useSelector((state) => state.ui);
    const theme = isDarkMode ? Colors.dark : Colors.light;

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchGarden());
    }, [dispatch]);

    const onRefresh = () => {
        dispatch(setRefreshing(true));
        dispatch(fetchGarden());
    };

    const handleDelete = (id) => {
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }

        const deleteAction = () => {
            dispatch(optimisticRemove(id));
            dispatch(removePlant(id));
            if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm("Bạn có chắc muốn xóa cây này khỏi khu vườn?")) {
                deleteAction();
            }
        } else {
            Alert.alert("Xóa cây", "Bạn có chắc muốn xóa cây này khỏi khu vườn?", [
                { text: "Hủy", style: "cancel" },
                { text: "Xóa", style: "destructive", onPress: deleteAction }
            ]);
        }
    };

    const toggleWaterStatus = (item) => {
        const newStatus = item.waterStatus === 'Đã tưới' ? 'Cần tưới' : 'Đã tưới';
        dispatch(updatePlant({ id: item._id, data: { ...item, waterStatus: newStatus } }));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const filteredGarden = useMemo(() => {
        return garden.filter(item => 
            item.plantName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [garden, searchQuery]);

    const renderGardenItem = ({ item, index }) => (
        <Animated.View 
            entering={FadeInRight.delay(index * 100).duration(500)} 
            exiting={FadeOutLeft}
            layout={Layout.springify()}
        >
            <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => navigation.navigate('AddEditPlant', { plant: item })}
                style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
                <LinearGradient
                    colors={[Colors.primary + '20', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardGradient}
                />
                
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                    {item.waterStatus === 'Đã tưới' && (
                        <View style={styles.checkBadge}>
                            <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                        </View>
                    )}
                </View>

                <View style={styles.cardContent}>
                    <Text style={[styles.plantName, { color: theme.text }]} numberOfLines={1}>{item.plantName}</Text>
                    <Text style={[styles.notes, { color: theme.subText }]} numberOfLines={2}>
                        {item.notes || 'Thêm ghi chú chăm sóc...'}
                    </Text>
                    
                    <View style={styles.statusRow}>
                        <TouchableOpacity 
                            onPress={() => toggleWaterStatus(item)}
                            style={[
                                styles.statusBadge, 
                                { backgroundColor: item.waterStatus === 'Đã tưới' ? Colors.success + '15' : Colors.warning + '15' }
                            ]}
                        >
                            <Ionicons 
                                name={item.waterStatus === 'Đã tưới' ? "water" : "water-outline"} 
                                size={14} 
                                color={item.waterStatus === 'Đã tưới' ? Colors.success : Colors.warning} 
                            />
                            <Text style={[
                                styles.statusText, 
                                { color: item.waterStatus === 'Đã tưới' ? Colors.success : Colors.warning }
                            ]}>
                                {item.waterStatus}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                <View style={styles.actionColumn}>
                    <TouchableOpacity 
                        onPress={() => handleDelete(item._id)} 
                        style={[styles.deleteBtn, { backgroundColor: Colors.danger + '10' }]}
                    >
                        <Ionicons name="trash-outline" size={18} color={Colors.danger} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient
                colors={[Colors.primary + '15', 'transparent']}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.header}>
                <View>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Khu Vườn</Text>
                    <Text style={[styles.headerSubtitle, { color: theme.subText }]}>{garden.length} người bạn xanh của bạn</Text>
                </View>
                <TouchableOpacity style={[styles.profileIcon, { backgroundColor: theme.card }]}>
                    <Ionicons name="leaf" size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchSection}>
                <BlurView intensity={isDarkMode ? 20 : 40} style={[styles.searchBar, { backgroundColor: theme.glass }]}>
                    <Ionicons name="search-outline" size={20} color={theme.subText} style={styles.searchIcon} />
                    <TextInput
                        placeholder="Tìm kiếm cây của bạn..."
                        placeholderTextColor={theme.subText}
                        style={[styles.searchInput, { color: theme.text }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={18} color={theme.subText} />
                        </TouchableOpacity>
                    )}
                </BlurView>
            </View>

            <FlatList
                data={filteredGarden}
                keyExtractor={(item) => item._id}
                renderItem={renderGardenItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
                }
                ListEmptyComponent={() => (
                    <Animated.View entering={FadeInRight} style={styles.emptyContainer}>
                        <View style={styles.emptyIconCircle}>
                            <Ionicons name="flower-outline" size={80} color={Colors.primary + '40'} />
                        </View>
                        <Text style={[styles.emptyText, { color: theme.text }]}>Trống trơn...</Text>
                        <Text style={[styles.emptySubText, { color: theme.subText }]}>Hãy thêm những mầm xanh đầu tiên!</Text>
                        <TouchableOpacity 
                            style={[styles.addFirstBtn, { backgroundColor: Colors.primary }]}
                            onPress={() => navigation.navigate('AddEditPlant')}
                        >
                            <Text style={styles.addFirstBtnText}>Thêm Cây Ngay</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            />

            <Animated.View entering={FadeInRight.delay(500)} style={styles.fabContainer}>
                <TouchableOpacity 
                    activeOpacity={0.8}
                    style={[styles.fab, Shadows.medium, { backgroundColor: Colors.primary }]}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        navigation.navigate('AddEditPlant');
                    }}
                >
                    <LinearGradient
                        colors={[Colors.primary, '#3A6347']}
                        style={styles.fabGradient}
                    >
                        <Ionicons name="add" size={32} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: 60,
        paddingHorizontal: Spacing.l,
        paddingBottom: Spacing.m,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: { ...Typography.header, fontSize: 32 },
    headerSubtitle: { ...Typography.body, marginTop: Spacing.xs, opacity: 0.8 },
    profileIcon: {
        width: 50, height: 50, borderRadius: 25,
        justifyContent: 'center', alignItems: 'center',
        ...Shadows.small,
    },
    searchSection: {
        paddingHorizontal: Spacing.l,
        marginBottom: Spacing.m,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        overflow: 'hidden',
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 16 },
    listContainer: { paddingHorizontal: Spacing.l, paddingBottom: 120 },
    card: {
        flexDirection: 'row',
        borderRadius: 24,
        marginBottom: Spacing.m,
        padding: Spacing.m,
        borderWidth: 1,
        ...Shadows.small,
        overflow: 'hidden',
        position: 'relative',
    },
    cardGradient: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: 85, height: 85,
        borderRadius: 20,
        backgroundColor: '#eee',
    },
    checkBadge: {
        position: 'absolute', top: -5, right: -5,
        backgroundColor: '#fff', borderRadius: 10,
    },
    cardContent: {
        flex: 1,
        marginLeft: Spacing.m,
        justifyContent: 'center',
    },
    plantName: { ...Typography.title, fontSize: 20, marginBottom: 4 },
    notes: { ...Typography.caption, fontSize: 13, lineHeight: 18 },
    statusRow: { flexDirection: 'row', marginTop: 10 },
    statusBadge: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 12, paddingVertical: 6,
        borderRadius: 15,
    },
    statusText: { fontSize: 12, marginLeft: 6, fontWeight: '700' },
    actionColumn: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: Spacing.s,
    },
    deleteBtn: {
        width: 36, height: 36, borderRadius: 18,
        justifyContent: 'center', alignItems: 'center',
    },
    fabContainer: {
        position: 'absolute', bottom: 30, right: 30,
    },
    fab: {
        width: 65, height: 65, borderRadius: 32.5,
        overflow: 'hidden',
    },
    fabGradient: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
    },
    emptyContainer: { 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginTop: 60,
        paddingHorizontal: 40,
    },
    emptyIconCircle: {
        width: 150, height: 150, borderRadius: 75,
        backgroundColor: Colors.primary + '10',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 20,
    },
    emptyText: { ...Typography.title, fontSize: 24, marginBottom: 8 },
    emptySubText: { ...Typography.body, textAlign: 'center', opacity: 0.6 },
    addFirstBtn: {
        marginTop: 30,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 30,
        ...Shadows.medium,
    },
    addFirstBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
