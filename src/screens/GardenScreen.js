import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, TextInput, RefreshControl, Platform, useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGarden, removePlant, setRefreshing, optimisticRemove, updatePlant } from '../store/slices/gardenSlice';
import { Colors, Typography, Spacing, Shadows } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Menu, Divider, Provider as PaperProvider } from 'react-native-paper';

import WebLayout from '../components/WebLayout';

export default function GardenScreen({ navigation }) {
    const layout = useWindowDimensions();
    const dispatch = useDispatch();
    const { data: garden, loading, refreshing } = useSelector((state) => state.garden);
    const { isDarkMode } = useSelector((state) => state.ui);
    const theme = isDarkMode ? Colors.dark : Colors.light; 

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'active', title: 'Active Nodes' },
        { key: 'history', title: 'Logs' },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });

    useEffect(() => {
        dispatch(fetchGarden());
    }, [dispatch]);

    const onRefresh = () => {
        dispatch(setRefreshing(true));
        dispatch(fetchGarden());
    };

    const handleDelete = (id) => {
        const deleteAction = () => {
            dispatch(optimisticRemove(id));
            dispatch(removePlant(id));
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        };

        Alert.alert("Eject Node", "Are you sure you want to remove this node from the command center?", [
            { text: "Cancel", style: "cancel" },
            { text: "Eject", style: "destructive", onPress: deleteAction }
        ]);
    };

    const toggleStatus = (item) => {
        const newStatus = item.waterStatus === 'Stable' ? 'Critical' : 'Stable';
        dispatch(updatePlant({ id: item._id, data: { ...item, waterStatus: newStatus } }));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const filteredGarden = useMemo(() => {
        return garden.filter(item => 
            (item.plantName || item.name || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [garden, searchQuery]);

    const onLongPress = (event, item) => {
        const { nativeEvent } = event;
        setSelectedItem(item);
        setMenuAnchor({ x: nativeEvent.pageX, y: nativeEvent.pageY });
        setMenuVisible(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    };

    const renderGardenItem = ({ item, index: i }) => (
        <Animated.View 
            entering={FadeInRight.delay(i * 100).duration(500)} 
            exiting={FadeOutLeft}
            layout={Layout.springify()}
            style={Platform.OS === 'web' && { width: '30%', minWidth: 280 }}
        >
            <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => navigation.navigate('AddEditPlant', { plant: item })}
                onLongPress={(e) => onLongPress(e, item)}
                style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                    {item.waterStatus === 'Stable' && (
                        <View style={styles.checkBadge}>
                            <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
                        </View>
                    )}
                </View>

                <View style={styles.cardContent}>
                    <Text style={[styles.plantName, { color: theme.text }]} numberOfLines={1}>{item.plantName || item.name}</Text>
                    <Text style={[styles.notes, { color: theme.subText }]} numberOfLines={2}>
                        {item.notes || 'No telemetry data...'}
                    </Text>
                    
                    <View style={styles.statusRow}>
                        <View style={[
                                styles.statusBadge, 
                                { backgroundColor: item.waterStatus === 'Stable' ? Colors.success + '15' : Colors.danger + '15' }
                            ]}
                        >
                            <View style={[styles.pulse, { backgroundColor: item.waterStatus === 'Stable' ? Colors.success : Colors.danger }]} />
                            <Text style={[
                                styles.statusText, 
                                { color: item.waterStatus === 'Stable' ? Colors.success : Colors.danger }
                            ]}>
                                {item.waterStatus === 'Stable' ? 'STABLE' : 'CRITICAL'}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    const [logs, setLogs] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const { userToken } = useSelector((state) => state.auth);

    const fetchLogs = async () => {
        setLoadingLogs(true);
        try {
            const axios = require('axios');
            const { API_URL } = require('../config/api');
            const { data } = await axios.get(`${API_URL}/logs`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            setLogs(data);
        } catch (e) {
            console.error('Failed to fetch logs:', e);
        } finally {
            setLoadingLogs(false);
        }
    };

    useEffect(() => {
        if (index === 1) { // When switching to Logs tab
            fetchLogs();
        }
    }, [index]);

    const renderLogItem = ({ item }) => (
        <View style={[styles.logItem, { borderLeftColor: item.action === 'EJECT' ? Colors.danger : Colors.primary }]}>
            <View style={styles.logHeader}>
                <Text style={[styles.logAction, { color: item.action === 'EJECT' ? Colors.danger : Colors.primary }]}>
                    [{item.action}]
                </Text>
                <Text style={[styles.logTime, { color: theme.subText }]}>
                    {new Date(item.timestamp).toLocaleTimeString()}
                </Text>
            </View>
            <Text style={[styles.logTarget, { color: theme.text }]}>{item.targetName}</Text>
            <Text style={[styles.logDetails, { color: theme.subText }]}>{item.details}</Text>
        </View>
    );

    const ActiveRoute = () => (
        <FlatList
            data={filteredGarden}
            keyExtractor={(item) => item._id}
            renderItem={renderGardenItem}
            numColumns={Platform.OS === 'web' ? 3 : 1}
            key={Platform.OS === 'web' ? 'grid' : 'list'}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={Platform.OS === 'web' && { gap: 20 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
            }
            ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                    <Ionicons name="pulse-outline" size={80} color={Colors.primary + '40'} />
                    <Text style={[styles.emptyText, { color: theme.text }]}>No modules active</Text>
                    <TouchableOpacity 
                        style={[styles.addFirstBtn, { backgroundColor: Colors.primary }]}
                        onPress={() => navigation.navigate('AddEditPlant')}
                    >
                        <Text style={styles.addFirstBtnText}>Initialize Node</Text>
                    </TouchableOpacity>
                </View>
            )}
        />
    );

    const HistoryRoute = () => (
        <FlatList
            data={logs}
            keyExtractor={(item) => item._id}
            renderItem={renderLogItem}
            contentContainerStyle={styles.listContainer}
            refreshControl={
                <RefreshControl refreshing={loadingLogs} onRefresh={fetchLogs} tintColor={Colors.primary} />
            }
            ListEmptyComponent={() => (
                <View style={styles.center}>
                    <Ionicons name="time-outline" size={60} color={theme.subText} />
                    <Text style={{ color: theme.subText, marginTop: 10 }}>Logs are empty</Text>
                </View>
            )}
        />
    );

    const renderScene = SceneMap({
        active: ActiveRoute,
        history: HistoryRoute,
    });

    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: Colors.primary }}
            style={{ backgroundColor: 'transparent', elevation: 0 }}
            labelStyle={{ fontWeight: 'bold', fontSize: 13 }}
            activeColor={Colors.primary}
            inactiveColor={theme.subText}
        />
    );

    const content = (
        <PaperProvider>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.headerTitle, { color: theme.text }]}>Neural Command</Text>
                        <Text style={[styles.headerSubtitle, { color: theme.subText }]}>{garden.length} nodes under management</Text>
                    </View>
                </View>

                <View style={styles.searchSection}>
                    <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Ionicons name="search-outline" size={20} color={theme.subText} style={styles.searchIcon} />
                        <TextInput
                            placeholder="Scan for active nodes..."
                            placeholderTextColor={theme.subText}
                            style={[styles.searchInput, { color: theme.text }]}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    renderTabBar={renderTabBar}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                />

                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={menuAnchor}
                >
                    <Menu.Item onPress={() => { toggleStatus(selectedItem); setMenuVisible(false); }} title="Toggle Stability" />
                    <Divider />
                    <Menu.Item onPress={() => { handleDelete(selectedItem?._id); setMenuVisible(false); }} title="Eject Module" titleStyle={{ color: Colors.danger }} />
                </Menu>

                <TouchableOpacity 
                    activeOpacity={0.8}
                    style={[styles.fab, Shadows.medium, { backgroundColor: Colors.primary }]}
                    onPress={() => navigation.navigate('AddEditPlant')}
                >
                    <Ionicons name="hardware-chip-outline" size={32} color="#fff" />
                </TouchableOpacity>
            </View>
        </PaperProvider>
    );

    return (
        <WebLayout navigation={navigation} activeRoute="Neural Hub">
            {content}
        </WebLayout>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: Spacing.xl + 10,
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
    listContainer: { 
        paddingHorizontal: Spacing.l, 
        paddingTop: Spacing.m,
        paddingBottom: 120 
    },
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
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    checkBadge: {
        position: 'absolute', top: -5, right: -5,
        backgroundColor: '#000', borderRadius: 10,
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
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.medium,
        overflow: 'hidden',
        zIndex: 1000,
    },
    logItem: {
        padding: Spacing.m,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
        marginBottom: Spacing.s,
        borderLeftWidth: 3,
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    logAction: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    logTime: {
        fontSize: 11,
    },
    logTarget: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    logDetails: {
        fontSize: 13,
    }
});
