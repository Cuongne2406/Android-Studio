import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { Colors, Typography, Spacing, Shadows } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import WebLayout from '../components/WebLayout';

const StatCard = ({ title, value, icon, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
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
      <Text style={styles.nodeId}>{id}</Text>
    </View>
    <View style={styles.loadContainer}>
      <View style={[styles.loadBar, { width: `${load}%`, backgroundColor: load > 80 ? Colors.danger : Colors.primary }]} />
    </View>
    <Text style={styles.loadText}>{load}%</Text>
  </View>
);

const WebDashboard = ({ navigation }) => {
  const theme = Colors.dark; 
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { text: '> Initiating system diagnostic...', type: 'sys' },
    { text: '> All neural pathways stabilized.', type: 'sys' },
    { text: '> Ready for operator input_', type: 'prompt' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSendCommand = () => {
    if (!chatInput.trim()) return;
    const newHistory = [...chatHistory, { text: `> ${chatInput}`, type: 'user' }];
    setChatHistory(newHistory);
    setChatInput('');
    
    setTimeout(() => {
      setChatHistory(prev => [...prev, 
        { text: `> Processing request for "${chatInput}"...`, type: 'ai' },
        { text: `> Command executed. Signal: STABLE`, type: 'ai' }
      ]);
    }, 600);
  };

  return (
    <WebLayout navigation={navigation} activeRoute="Command Center">
      <ScrollView style={styles.mainContent} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.text }]}>SYSTEM ONLINE</Text>
            <Text style={[styles.subtitle, { color: theme.subText }]}>Neural Command Interface v4.0.1</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={[styles.time, { color: Colors.primary }]}>{time}</Text>
            <Text style={styles.location}>SECTOR-7G / HANOI</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard title="Total Neural Nodes" value="1,284" icon="hardware-chip-outline" color={Colors.primary} />
          <StatCard title="Network Traffic" value="4.2 GB/s" icon="pulse-outline" color={Colors.secondary} />
          <StatCard title="AI Confidence" value="99.4%" icon="shield-checkmark-outline" color={Colors.success} />
          <StatCard title="System Load" value="24%" icon="speedometer-outline" color={Colors.warning} />
        </View>

        <View style={styles.mainGrid}>
          <View style={styles.leftColumn}>
            <View style={[styles.sectionHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>ACTIVE NODES MONITOR</Text>
              <TouchableOpacity onPress={() => navigation?.navigate('Neural Hub')}><Text style={{ color: Colors.primary }}>View All</Text></TouchableOpacity>
            </View>
            <NodeItem id="NODE-DELTA-01" status="Online" load={45} />
            <NodeItem id="NODE-EPSILON-04" status="Online" load={88} />
            <NodeItem id="NODE-THETA-09" status="Syncing" load={12} />
            <NodeItem id="NODE-ZETA-12" status="Online" load={64} />
            <NodeItem id="NODE-OMEGA-99" status="Online" load={31} />
          </View>

          <View style={styles.rightColumn}>
            <View style={[styles.aiTerminal, { backgroundColor: '#121420' }]}>
              <View style={styles.terminalHeader}>
                <View style={styles.dot} />
                <View style={[styles.dot, { backgroundColor: '#FFBD2E' }]} />
                <View style={[styles.dot, { backgroundColor: '#27C93F' }]} />
                <Text style={styles.terminalTitle}>LUMINA-AI_CORE</Text>
              </View>
              <ScrollView style={styles.terminalContent} contentContainerStyle={{ paddingBottom: 20 }}>
                {chatHistory.map((msg, i) => (
                    <Text key={i} style={[styles.terminalText, msg.type === 'user' && { color: Colors.primary }]}>{msg.text}</Text>
                ))}
              </ScrollView>
              <View style={styles.terminalInputContainer}>
                <Text style={styles.prompt}>></Text>
                <TextInput
                    style={styles.terminalInput}
                    value={chatInput}
                    onChangeText={setChatInput}
                    onSubmitEditing={handleSendCommand}
                    placeholder="Enter command..."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </WebLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  sidebar: {
    width: 80,
    backgroundColor: '#050508',
    borderRightWidth: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    justifyContent: 'space-between',
  },
  logoContainer: { alignItems: 'center' },
  logoText: { color: Colors.primary, fontSize: 10, fontWeight: '900', marginTop: 5 },
  navItems: { gap: Spacing.xl },
  navItem: { alignItems: 'center', opacity: 0.5 },
  navItemActive: { alignItems: 'center' },
  navText: { color: '#888', fontSize: 10, marginTop: 5 },
  navTextActive: { color: Colors.primary, fontSize: 10, marginTop: 5, fontWeight: 'bold' },
  logoutBtn: { marginBottom: Spacing.m },
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
  nodeInfo: { flexDirection: 'row', alignItems: 'center', width: 140 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  nodeId: { color: '#888', fontWeight: '500' },
  loadContainer: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', marginHorizontal: Spacing.m },
  loadBar: { height: '100%', borderRadius: 2 },
  loadText: { width: 40, textAlign: 'right', fontSize: 12, color: '#888' },
  aiTerminal: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    minHeight: 400,
    maxHeight: 500,
  },
  terminalHeader: {
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FF5F56', marginRight: 8 },
  terminalTitle: { color: '#888', fontSize: 11, marginLeft: 10, letterSpacing: 1 },
  terminalContent: { padding: 20, flex: 1 },
  terminalText: { color: '#fff', fontSize: 13, marginBottom: 10, fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier' },
  terminalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  prompt: { color: Colors.primary, marginRight: 10, fontWeight: 'bold' },
  terminalInput: { flex: 1, color: '#fff', fontSize: 13, fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier', outlineStyle: 'none' },
});

export default WebDashboard;
