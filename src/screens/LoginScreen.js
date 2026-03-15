import React, { useState, useContext } from 'react';
import { 
  View, Text, Image, StyleSheet, Dimensions, 
  KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView
} from 'react-native';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/Theme';
import PremiumButton from '../components/PremiumButton';
import PremiumInput from '../components/PremiumInput';
import GlassCard from '../components/GlassCard';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
    const { loginApp, isDarkMode } = useContext(AppContext);
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

    const handleLogin = () => {
        if (!mssv || !password) return;
        setLoading(true);
        setTimeout(() => {
            loginApp();
            setLoading(false);
        }, 1500);
    };

    const theme = isDarkMode ? Colors.dark : Colors.light;

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} bounces={false}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.container, {backgroundColor: theme.background}]}>
                <View style={styles.topDecor}>
                    <View style={[styles.circle, { top: -50, right: -50, backgroundColor: Colors.primary + '20' }]} />
                    <View style={[styles.circle, { bottom: 100, left: -80, backgroundColor: Colors.secondary + '15', width: 250, height: 250 }]} />
                </View>

                <View style={styles.logoSection}>
                    <Image source={{ uri: 'https://lhu.edu.vn/Image/Logo-LHU.png' }} style={styles.logo} resizeMode="contain" />
                    <Text style={[styles.title, {color: theme.text}]}>23CT112</Text>
                    <Text style={[styles.subtitle, {color: theme.subText}]}>Hệ thống Quản lý Sinh viên Thông minh</Text>
                </View>

                <GlassCard isDarkMode={isDarkMode} style={styles.loginCard}>
                    <Text style={[styles.cardTitle, {color: theme.text}]}>Đăng Nhập</Text>
                    
                    <View style={{zIndex: 2000}}>
                        <PremiumInput 
                            label="Mã số sinh viên"
                            icon="person-outline"
                            placeholder="Nhập MSSV của bạn"
                            value={mssv}
                            onChangeText={handleMssvChange}
                            isDarkMode={isDarkMode}
                        />
                        {showSuggestions && (
                            <View style={[styles.suggestionBox, {backgroundColor: theme.card, borderColor: theme.border}]}>
                                {filteredAccounts.map((item, index) => (
                                    <TouchableOpacity key={index} style={styles.suggestionItem} onPress={() => { setMssv(item.value); setShowSuggestions(false); }}>
                                        <Text style={{color: theme.text, fontSize: 14}}>{item.label}</Text>
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
                        style={{marginTop: 10}}
                    />

                    <TouchableOpacity style={styles.forgotPass}>
                        <Text style={{color: Colors.primary, fontWeight: '500'}}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                </GlassCard>

                <View style={styles.footer}>
                    <Text style={{color: theme.subText}}>Chưa có tài khoản? </Text>
                    <TouchableOpacity><Text style={{color: Colors.primary, fontWeight: 'bold'}}>Liên hệ phòng đào tạo</Text></TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 25, justifyContent: 'center' },
    topDecor: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
    circle: { position: 'absolute', width: 300, height: 300, borderRadius: 150 },
    logoSection: { alignItems: 'center', marginBottom: 40 },
    logo: { width: 90, height: 90, marginBottom: 15 },
    title: { fontSize: 32, fontWeight: '900', letterSpacing: 1 },
    subtitle: { fontSize: 14, textAlign: 'center', marginTop: 5 },
    loginCard: { width: '100%', elevation: 15 },
    cardTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 25, textAlign: 'left' },
    suggestionBox: { position: 'absolute', top: 85, width: '100%', borderRadius: 12, borderWidth: 1, elevation: 5, padding: 5, zIndex: 3000 },
    suggestionItem: { padding: 15, borderBottomWidth: 0.5, borderBottomColor: '#EEE' },
    forgotPass: { marginTop: 20, alignItems: 'center' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
});

export default LoginScreen;
