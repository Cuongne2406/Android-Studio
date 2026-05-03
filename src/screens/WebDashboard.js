import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Platform, TextInput, KeyboardAvoidingView } from 'react-native';
import { useSelector } from 'react-redux';
import { Colors, Typography, Spacing, Shadows } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import WebLayout from '../components/WebLayout';

const StatCard = ({ title, value, icon, color, isMobile }) => (
  <View style={[styles.statCard, { borderLeftColor: color }, isMobile && { minWidth: '100%', marginBottom: Spacing.s }]}>
    <View style={styles.statIconContainer}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View>
      <Text style={styles.statLabel}>{title}</Text>
      <Text style={[styles.statValue, { color: color }]}>{value}</Text>
    </View>
  </View>
);

const NodeItem = ({ id, status, load }) => (
  <View style={styles.nodeItem}>
    <View style={styles.nodeInfo}>
      <View style={[styles.statusDot, { backgroundColor: status === 'Online' ? Colors.success : Colors.warning }]} />
      <Text style={styles.nodeId} numberOfLines={1}>{id}</Text>
    </View>
    <View style={styles.loadContainer}>
      <View style={[styles.loadBar, { width: `${load}%`, backgroundColor: load > 80 ? Colors.danger : Colors.primary }]} />
    </View>
    <Text style={styles.loadText}>{load}%</Text>
  </View>
);

const WebDashboard = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { isDarkMode } = useSelector((state) => state.ui);
  const theme = isDarkMode ? Colors.dark : Colors.light; 
  const terminalScrollRef = React.useRef();

  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { text: '>> ZENITH NEURAL INTERFACE [Version 4.0.1]', type: 'sys' },
    { text: '>> (c) 2026 Zenith AI Corp. All rights reserved.', type: 'sys' },
    { text: '>> System: STABLE | Neural Hub: CONNECTED', type: 'sys' },
    { text: '>> Ready for operator command. Type "help" for available protocols._', type: 'prompt' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addLine = (text, type = 'ai') => {
    setChatHistory(prev => [...prev, { text: `>> ${text}`, type }]);
    setTimeout(() => terminalScrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleSendCommand = async () => {
    const cmd = chatInput.trim().toLowerCase();
    if (!cmd) return;

    setChatHistory(prev => [...prev, { text: `> ${chatInput}`, type: 'user' }]);
    setChatInput('');
    setIsAiTyping(true);

    // Terminal Commands Logic
    if (cmd === 'help') {
      setTimeout(() => {
        addLine('AVAILABLE PROTOCOLS:', 'sys');
        addLine('- help: Display this manual', 'sys');
        addLine('- status: Run system diagnostics', 'sys');
        addLine('- nodes: Scan active neural nodes', 'sys');
        addLine('- ipconfig: View neural network config', 'sys');
        addLine('- clear: Purge terminal buffer', 'sys');
        addLine('- chat: Open Lumina AI interface', 'sys');
        setIsAiTyping(false);
      }, 500);
    } else if (cmd === 'clear') {
      setChatHistory([{ text: '>> Terminal buffer purged. Ready._', type: 'prompt' }]);
      setIsAiTyping(false);
    } else if (cmd.startsWith('ipconfig')) {
      const isAll = cmd.includes('/all');
      setTimeout(() => {
        addLine('', 'sys');
        addLine('Windows IP Configuration', 'sys');
        addLine('', 'sys');
        addLine('Ethernet adapter Neural-Link (Sector-7G):', 'sys');
        addLine('   Connection-specific DNS Suffix  . : zenith.ai', 'sys');
        if (isAll) {
          addLine('   Description . . . . . . . . . . . : Zenith Neural-Link Virtual Adapter', 'sys');
          addLine('   Physical Address. . . . . . . . . : 00-1A-2B-3C-4D-5E', 'sys');
          addLine('   DHCP Enabled. . . . . . . . . . . : Yes', 'sys');
        }
        addLine('   IPv4 Address. . . . . . . . . . . : 192.168.100.241', 'sys');
        addLine('   Subnet Mask . . . . . . . . . . . : 255.255.255.0', 'sys');
        addLine('   Default Gateway . . . . . . . . . : 192.168.100.1', 'sys');
        if (isAll) {
          addLine('   DNS Servers . . . . . . . . . . . : 8.8.8.8', 'sys');
          addLine('                                       8.8.4.4', 'sys');
        }
        addLine('', 'sys');
        setIsAiTyping(false);
      }, 600);
    } else if (cmd === 'status') {
      setTimeout(() => {
        addLine('RUNNING DIAGNOSTICS...', 'ai');
        addLine('CPU LOAD: 24% | MEMORY: 4.2GB/s', 'ai');
        addLine('NEURAL SYNC: 99.4% [OPTIMAL]', 'ai');
        addLine('ALL SYSTEMS OPERATIONAL.', 'ai');
        setIsAiTyping(false);
      }, 1000);
    } else if (cmd === 'nodes') {
      setTimeout(() => {
        addLine('SCANNING NEURAL HUB...', 'ai');
        addLine('FOUND 5 ACTIVE MODULES:', 'ai');
        addLine('- DELTA-01: ONLINE', 'ai');
        addLine('- EPSILON-04: STABLE', 'ai');
        addLine('- THETA-09: SYNCING', 'ai');
        setIsAiTyping(false);
      }, 800);
    } else if (cmd === 'chat') {
      addLine('REDIRECTING TO LUMINA AI CORE...', 'sys');
      setTimeout(() => {
        navigation.navigate('Lumina AI');
        setIsAiTyping(false);
      }, 1000);
    } else {
      // Real AI integration
      try {
        const axios = require('axios');
        const { API_URL } = require('../config/api');
        const response = await axios.post(`${API_URL}/ai/chat`, { message: chatInput });
        addLine(response.data.reply, 'ai');
      } catch (error) {
        addLine('ERROR: Neural bridge failed. Check API configuration.', 'err');
      } finally {
        setIsAiTyping(false);
      }
    }
  };

  return (
    <WebLayout navigation={navigation} activeRoute="Command Center">
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
      >
        <ScrollView 
          style={styles.mainContent} 
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.content, 
            isMobile && { paddingHorizontal: Spacing.m, paddingTop: Spacing.s, paddingBottom: 100 }
          ]}
        >
          <View style={[styles.header, isMobile && { flexDirection: 'column', alignItems: 'flex-start', gap: 10, marginBottom: Spacing.m }]}>
            <View>
              <Text style={[styles.greeting, { color: theme.text }, isMobile && { fontSize: 24 }]}>SYSTEM ONLINE</Text>
              <Text style={[styles.subtitle, { color: theme.subText }]}>Neural Command Interface v4.0.1</Text>
            </View>
            <View style={[styles.timeContainer, isMobile && { alignItems: 'flex-start' }]}>
              <Text style={[styles.time, { color: theme.primary || Colors.primary }]}>{time}</Text>
              <Text style={styles.location}>SECTOR-7G / HANOI</Text>
            </View>
          </View>

          <View style={[styles.statsGrid, isMobile && { flexDirection: 'column', gap: Spacing.s, marginBottom: Spacing.m }]}>
            <StatCard title="Total Neural Nodes" value="1,284" icon="hardware-chip-outline" color={Colors.primary} isMobile={isMobile} />
            <StatCard title="Network Traffic" value="4.2 GB/s" icon="pulse-outline" color={Colors.secondary} isMobile={isMobile} />
            <StatCard title="AI Confidence" value="99.4%" icon="shield-checkmark-outline" color={Colors.success} isMobile={isMobile} />
            <StatCard title="System Load" value="24%" icon="speedometer-outline" color={Colors.warning} isMobile={isMobile} />
          </View>

          <View style={[styles.mainGrid, isMobile && { flexDirection: 'column' }]}>
            <View style={[styles.leftColumn, isMobile && { width: '100%' }]}>
              <View style={[styles.sectionHeader, { borderBottomColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>ACTIVE NODES MONITOR</Text>
                <TouchableOpacity onPress={() => navigation?.navigate('Neural Hub')}><Text style={{ color: theme.primary || Colors.primary }}>View All</Text></TouchableOpacity>
              </View>
              <NodeItem id="NODE-DELTA-01" status="Online" load={45} />
              <NodeItem id="NODE-EPSILON-04" status="Online" load={88} />
              <NodeItem id="NODE-THETA-09" status="Syncing" load={12} />
              <NodeItem id="NODE-ZETA-12" status="Online" load={64} />
              <NodeItem id="NODE-OMEGA-99" status="Online" load={31} />
            </View>

            <View style={[styles.rightColumn, isMobile && { width: '100%', marginTop: Spacing.l }]}>
              <View style={[styles.aiTerminal, { backgroundColor: isDarkMode ? '#050508' : '#f8f9fa', borderColor: theme.border }]}>
                <View style={[styles.terminalHeader, { backgroundColor: isDarkMode ? '#1a1a24' : '#e9ecef' }]}>
                  <View style={styles.dot} />
                  <View style={[styles.dot, { backgroundColor: '#FFBD2E' }]} />
                  <View style={[styles.dot, { backgroundColor: '#27C93F' }]} />
                  <Text style={[styles.terminalTitle, { color: theme.text }]}>LUMINA-AI_CORE</Text>
                </View>
                <ScrollView 
                  ref={terminalScrollRef}
                  style={styles.terminalContent} 
                  contentContainerStyle={{ paddingBottom: 20 }}
                  onContentSizeChange={() => terminalScrollRef.current?.scrollToEnd({ animated: true })}
                >
                  {chatHistory.map((msg, i) => (
                      <Text key={i} style={[
                        styles.terminalText, 
                        { color: isDarkMode ? '#00FF94' : '#008450' }, // Terminal Green
                        msg.type === 'user' && { color: theme.primary || Colors.primary },
                        msg.type === 'sys' && { color: '#888' },
                        msg.type === 'err' && { color: Colors.danger }
                      ]}>
                        {msg.text}
                      </Text>
                  ))}
                  {isAiTyping && <Text style={[styles.terminalText, { color: '#888' }]}>>> Processing...</Text>}
                </ScrollView>
                <View style={[styles.terminalInputContainer, { borderTopColor: theme.border, backgroundColor: isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.02)' }]}>
                  <Text style={[styles.prompt, { color: theme.primary || Colors.primary }]}>></Text>
                  <TextInput
                      style={[styles.terminalInput, { color: isDarkMode ? '#fff' : '#1a1a1a' }]}
                      value={chatInput}
                      onChangeText={setChatInput}
                      onSubmitEditing={handleSendCommand}
                      placeholder="Enter command..."
                      placeholderTextColor={theme.subText}
                      autoCapitalize="none"
                      autoCorrect={false}
                  />
                  <TouchableOpacity 
                    onPress={handleSendCommand}
                    style={[styles.executeBtn, { backgroundColor: Colors.primary + '20' }]}
                  >
                    <Ionicons name="return-down-forward" size={18} color={theme.primary || Colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </WebLayout>
  );
};

const styles = StyleSheet.create({
  mainContent: { flex: 1 },
  content: { padding: Spacing.xl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  greeting: { fontSize: 32, fontWeight: '900', letterSpacing: 2 },
  subtitle: { fontSize: 14, fontWeight: '500', opacity: 0.7 },
  timeContainer: { alignItems: 'flex-end' },
  time: { fontSize: 24, fontWeight: '700', fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier' },
  location: { fontSize: 12, color: '#888', textAlign: 'right' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.m,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: Spacing.l,
    borderRadius: 16,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  statLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: 'bold' },
  mainGrid: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },
  leftColumn: { flex: 1.5 },
  rightColumn: { flex: 1 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.m,
    marginBottom: Spacing.m,
    borderBottomWidth: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  nodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
    padding: Spacing.m,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
  },
  nodeInfo: { flexDirection: 'row', alignItems: 'center', width: 120 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  nodeId: { color: '#888', fontWeight: '500', fontSize: 13 },
  loadContainer: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', marginHorizontal: Spacing.m },
  loadBar: { height: '100%', borderRadius: 2 },
  loadText: { width: 40, textAlign: 'right', fontSize: 12, color: '#888' },
  aiTerminal: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    minHeight: 400,
    maxHeight: 500,
  },
  terminalHeader: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FF5F56', marginRight: 8 },
  terminalTitle: { fontSize: 11, marginLeft: 10, letterSpacing: 1 },
  terminalContent: { padding: 20, flex: 1 },
  terminalText: { fontSize: 13, marginBottom: 10, fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier' },
  terminalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
  },
  prompt: { marginRight: 10, fontWeight: 'bold' },
  terminalInput: { flex: 1, fontSize: 13, fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier' },
  executeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default WebDashboard;
