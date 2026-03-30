const sharedColors = {
  primary: '#6366F1', // Soft Indigo
  primaryLight: '#818CF8',
  secondary: '#A855F7', // Soft Purple
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

export const lightColors = {
  ...sharedColors,
  background: '#F8FAFC', // Neutral 50
  surface: 'rgba(255, 255, 255, 0.8)', // Glassmorphism surface
  text: '#1E1B4B', // Deep Obsidian
  textMuted: '#64748B',
  border: '#E2E8F0',
  cardBackground: 'white',
};

export const darkColors = {
  ...sharedColors,
  background: '#0F172A', // Dark Navy
  surface: 'rgba(30, 41, 59, 0.8)', // Dark Glassmorphism 
  text: '#F8FAFC', // Light Text
  textMuted: '#94A3B8',
  border: '#334155',
  cardBackground: '#1E293B',
};

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  radius: 24,
};

export const SHADOWS = {
  softLight: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  softDark: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  }
};
