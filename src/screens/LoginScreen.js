import React, { useState, useContext, useEffect } from 'react';
import { 
  View, Text, Image, StyleSheet, Dimensions, 
  KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, FadeInUp, ZoomIn, 
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence 
} from 'react-native-reanimated';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/Theme';
import PremiumButton from '../components/PremiumButton';
import PremiumInput from '../components/PremiumInput';
import GlassCard from '../components/GlassCard';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
    const { loginApp, isDarkMode, triggerHaptic } = useContext(AppContext);
    const [mssv, setMssv] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const accounts = [
        { label: "123000991 - Nguyễn Trung Cường", value: "123000991" },
        { label: "123000111 - Nguyễn Hậu", value: "123000111" },
        { label: "123000194 - Phú Trần", value: "123000194" }
    ];

    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Floating animation for decorative circles
    const floatAnim = useSharedValue(0);
    useEffect(() => {
        floatAnim.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 3000 }),
                withTiming(0, { duration: 3000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedCircleStyle = (offset = 0) => useAnimatedStyle(() => ({
        transform: [{ translateY: (floatAnim.value * 20) + offset }]
    }));

    const handleMssvChange = (text) => {
        setMssv(text);
        if (text.length > 0) {
            const filtered = accounts.filter(acc => 
                acc.value.includes(text) || acc.label.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredAccounts(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleLogin = async () => {
        if (!mssv || !password) {
            triggerHaptic('error');
            return;
        }
        setLoading(true);
        await loginApp(mssv, password);
        setLoading(false);
    };

    const theme = isDarkMode ? Colors.dark : Colors.light;

    return (
        <View style={styles.outerContainer}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <LinearGradient 
                colors={isDarkMode ? ['#0F172A', '#1E293B', '#334155'] : ['#6366F1', '#8B5CF6', '#EC4899']} 
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            
            {/* Decorative Animated Elements */}
            <Animated.View style={[styles.circle, styles.circle1, animatedCircleStyle(0)]} />
            <Animated.View style={[styles.circle, styles.circle2, animatedCircleStyle(50)]} />
            <Animated.View style={[styles.circle, styles.circle3, animatedCircleStyle(-30)]} />

            <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
                    
                    <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.logoSection}>
                        <GlassCard intensity={30} isDarkMode={true} style={styles.logoGlass}>
                            <Image source={{ uri: 'https://lhu.edu.vn/Image/Logo-LHU.png' }} style={styles.logo} resizeMode="contain" />
                        </GlassCard>
                        <Text style={styles.title}>LHU Pro</Text>
                        <Text style={styles.subtitle}>Smart Student Management</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(400).duration(1000)}>
                        <GlassCard intensity={40} isDarkMode={isDarkMode} style={styles.loginCard}>
                            <Text style={[styles.cardTitle, {color: theme.text}]}>Đăng Nhập</Text>
                            
                            <View style={{zIndex: 2000}}>
                                <PremiumInput 
                                    label="Mã số sinh viên"
                                    icon="person-outline"
                                    placeholder="Nhập MSSV"
                                    value={mssv}
                                    onChangeText={handleMssvChange}
                                    isDarkMode={isDarkMode}
                                />
                                {showSuggestions && (
                                    <View style={[styles.suggestionBox, {backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)', borderColor: theme.border}]}>
                                        {filteredAccounts.map((item, index) => (
                                            <TouchableOpacity key={index} style={styles.suggestionItem} onPress={() => { setMssv(item.value); setShowSuggestions(false); }}>
                                                <Text style={{color: theme.text, fontSize: 13, fontWeight: '500'}}>{item.label}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            <PremiumInput 
                                label="Mật khẩu"
                                icon="lock-closed-outline"
                                placeholder="••••••••"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                isDarkMode={isDarkMode}
                            />

                            <PremiumButton 
                                title="Vào hệ thống" 
                                onPress={handleLogin} 
                                loading={loading} 
                                style={styles.loginBtn}
                                color={Colors.primary}
                            />

                            <TouchableOpacity style={styles.forgotPass}>
                                <Text style={{color: isDarkMode ? Colors.primary : '#4F46E5', fontWeight: '600'}}>Quên mật khẩu?</Text>
                            </TouchableOpacity>
                        </GlassCard>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(600)} style={styles.footer}>
                        <Text style={styles.footerText}>Hợp tác bởi </Text>
                        <Text style={[styles.footerText, {fontWeight: 'bold', color: '#FFF'}]}>LHU IT Center</Text>
                    </Animated.View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: { flex: 1 },
    scrollContent: { flexGrow: 1 },
    container: { flex: 1, paddingHorizontal: 30, justifyContent: 'center', paddingTop: 60, paddingBottom: 40 },
    circle: { position: 'absolute', borderRadius: 1000, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
    circle1: { width: 300, height: 300, top: -50, right: -100 },
    circle2: { width: 200, height: 200, bottom: 100, left: -100, backgroundColor: 'rgba(99, 102, 241, 0.2)' },
    circle3: { width: 150, height: 150, top: 200, left: -50, backgroundColor: 'rgba(236, 72, 153, 0.2)' },
    logoSection: { alignItems: 'center', marginBottom: 35 },
    logoGlass: { padding: 10, borderRadius: 25, marginBottom: 15 },
    logo: { width: 70, height: 70 },
    title: { fontSize: 36, fontWeight: '900', color: '#FFF', letterSpacing: 2, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 10 },
    subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
    loginCard: { width: '100%', padding: 25 },
    cardTitle: { fontSize: 24, fontWeight: '800', marginBottom: 25, letterSpacing: -0.5 },
    loginBtn: { marginTop: 15, height: 55, borderRadius: 16 },
    suggestionBox: { position: 'absolute', top: 85, width: '100%', borderRadius: 16, borderWidth: 1, elevation: 10, padding: 5, zIndex: 3000 },
    suggestionItem: { padding: 15, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.05)' },
    forgotPass: { marginTop: 25, alignItems: 'center' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
    footerText: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
});

export default LoginScreen;
