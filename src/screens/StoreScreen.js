import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Modal, ScrollView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { Colors, Typography, Spacing, Shadows } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchWeather, fetchForecast } from '../services/WeatherService';
import WebLayout from '../components/WebLayout';

const CityWeatherCard = ({ city, theme, onPress }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWeather(city).then(res => {
            setData(res);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [city]);

    if (loading) return (
        <View style={[styles.card, { backgroundColor: theme.card, justifyContent: 'center' }]}>
            <ActivityIndicator color={Colors.primary} />
        </View>
    );

    if (!data) return null;

    return (
        <Animated.View entering={FadeInUp.duration(500)}>
            <TouchableOpacity 
                style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => onPress(data)}
            >
                <View style={styles.cardMain}>
                    <View>
                        <Text style={[styles.cityName, { color: theme.text }]}>{data.location.name.toUpperCase()}</Text>
                        <Text style={[styles.countryName, { color: theme.subText }]}>{data.location.country}</Text>
                    </View>
                    <View style={styles.tempContainer}>
                        <Text style={[styles.tempText, { color: Colors.primary }]}>{data.current.temp_c}°C</Text>
                        <Image source={{ uri: `https:${data.current.condition.icon}` }} style={styles.conditionIcon} />
                    </View>
                </View>
                <View style={[styles.cardFooter, { borderTopColor: theme.border + '40' }]}>
                    <View style={styles.statItem}>
                        <Ionicons name="water-outline" size={14} color={theme.subText} />
                        <Text style={[styles.statText, { color: theme.subText }]}>{data.current.humidity}%</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="leaf-outline" size={14} color={theme.subText} />
                        <Text style={[styles.statText, { color: theme.subText }]}>{data.current.condition.text}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="speedometer-outline" size={14} color={theme.subText} />
                        <Text style={[styles.statText, { color: theme.subText }]}>{data.current.wind_kph} km/h</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function StoreScreen({ navigation }) {
    const { isDarkMode } = useSelector((state) => state.ui);
    const theme = isDarkMode ? Colors.dark : Colors.light; 
    const [selectedCity, setSelectedCity] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loadingForecast, setLoadingForecast] = useState(false);

    const cities = ['Hanoi', 'Tokyo', 'London', 'Paris', 'New York', 'Singapore', 'Sydney', 'Moscow', 'Dubai', 'Berlin'];

    const handleCityPress = async (cityData) => {
        setSelectedCity(cityData);
        setLoadingForecast(true);
        try {
            // Fetch 2 days to ensure we have enough hours if it's late at night
            const data = await fetchForecast(cityData.location.name, 2);
            
            // Combine hours from today and tomorrow
            const allHours = [
                ...data.forecast.forecastday[0].hour,
                ...data.forecast.forecastday[1].hour
            ];

            const now = new Date();
            const currentEpoch = Math.floor(now.getTime() / 1000);
            
            // Filter: only future hours, then take the first 12
            const futureHours = allHours.filter(h => h.time_epoch > currentEpoch);
            const next12Hours = futureHours.slice(0, 12);

            setForecast(next12Hours);
        } catch (e) {
            console.error("Error fetching forecast:", e);
        } finally {
            setLoadingForecast(false);
        }
    };

    const content = (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient
                colors={[Colors.primary + '20', 'transparent']}
                style={styles.headerGradient}
            />
            
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>ENVIRONMENTAL ASSETS</Text>
                <Text style={[styles.headerSubtitle, { color: theme.subText }]}>Global Node Atmospheric Monitoring</Text>
            </View>

            <FlatList
                data={cities}
                keyExtractor={(item) => item}
                renderItem={({ item }) => <CityWeatherCard city={item} theme={theme} onPress={handleCityPress} />}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                numColumns={Platform.OS === 'web' ? 2 : 1}
                key={Platform.OS === 'web' ? '2col' : '1col'}
                columnWrapperStyle={Platform.OS === 'web' && { gap: 20 }}
            />

            <Modal
                visible={!!selectedCity}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setSelectedCity(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={[styles.modalCityName, { color: theme.text }]}>{selectedCity?.location.name}</Text>
                                <Text style={[styles.modalSubtitle, { color: theme.subText }]}>12-HOUR NEURAL FORECAST</Text>
                            </View>
                            <TouchableOpacity onPress={() => setSelectedCity(null)} style={styles.closeBtn}>
                                <Ionicons name="close" size={28} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        {loadingForecast ? (
                            <ActivityIndicator size="large" color={Colors.primary} style={{ margin: 50 }} />
                        ) : (
                            <ScrollView style={styles.forecastList} showsVerticalScrollIndicator={false}>
                                {forecast.map((hour, idx) => (
                                    <View key={idx} style={[styles.forecastItem, { borderBottomColor: theme.border + '40' }]}>
                                        <Text style={[styles.forecastTime, { color: theme.text }]}>
                                            {new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                        <Image source={{ uri: `https:${hour.condition.icon}` }} style={styles.forecastIcon} />
                                        <Text style={[styles.forecastTemp, { color: Colors.primary }]}>{hour.temp_c}°C</Text>
                                        <Text style={[styles.forecastCond, { color: theme.subText }]}>{hour.condition.text}</Text>
                                    </View>
                                ))}
                                {forecast.length === 0 && <Text style={{ color: theme.subText, textAlign: 'center', padding: 20 }}>No further telemetry for today.</Text>}
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );

    return (
        <WebLayout navigation={navigation} activeRoute="Assets">
            {content}
        </WebLayout>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 300 },
    header: {
        paddingTop: 60,
        paddingHorizontal: Spacing.l,
        marginBottom: Spacing.m,
    },
    headerTitle: { ...Typography.header, fontSize: 28, letterSpacing: 2 },
    headerSubtitle: { ...Typography.body, fontSize: 13, opacity: 0.7, marginTop: 4 },
    listContainer: { paddingHorizontal: Spacing.l, paddingBottom: 100 },
    card: {
        borderRadius: 20,
        padding: Spacing.m,
        marginBottom: Spacing.m,
        borderWidth: 1,
        ...Shadows.small,
        minHeight: 120,
    },
    cardMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    cityName: { fontSize: 20, fontWeight: '900', letterSpacing: 1 },
    countryName: { fontSize: 12, fontWeight: '500', marginTop: 2 },
    tempContainer: { flexDirection: 'row', alignItems: 'center' },
    tempText: { fontSize: 28, fontWeight: 'bold', marginRight: 10 },
    conditionIcon: { width: 40, height: 40 },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTopWidth: 1,
    },
    statItem: { flexDirection: 'row', alignItems: 'center' },
    statText: { fontSize: 12, marginLeft: 5 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: Spacing.l,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    modalCityName: { fontSize: 32, fontWeight: 'bold' },
    modalSubtitle: { fontSize: 12, letterSpacing: 2, marginTop: 5, fontWeight: 'bold', color: Colors.primary },
    closeBtn: { padding: 5 },
    forecastList: { marginBottom: 20 },
    forecastItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    forecastTime: { width: 80, fontSize: 16, fontWeight: '500' },
    forecastIcon: { width: 35, height: 35, marginHorizontal: 15 },
    forecastTemp: { width: 60, fontSize: 18, fontWeight: 'bold' },
    forecastCond: { flex: 1, fontSize: 14, textAlign: 'right' },
});
