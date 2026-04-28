export const Colors = {
  primary: '#00F5FF', // Neon Cyan
  secondary: '#9D00FF', // Electric Purple
  success: '#00FF94', // Cyber Green
  warning: '#FFD700', // Gold
  danger: '#FF0055', // Cyber Red
  info: '#00A3FF',
  accent: '#FF00E5', // Neon Pink
  light: {
    background: '#F0F2F5',
    card: '#FFFFFF',
    text: '#050505',
    subText: '#65676B',
    border: '#CED0D4',
    input: '#F0F2F5',
    divider: '#E4E6EB',
    glass: 'rgba(255, 255, 255, 0.8)',
  },
  dark: {
    background: '#050508', // Deep Space Black
    card: '#0F111A', // Dark Tech Blue
    text: '#E4E6EB',
    subText: '#B0B3B8',
    border: '#242526',
    input: '#242526',
    divider: '#3E4042',
    glass: 'rgba(15, 17, 26, 0.8)',
  }
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  }
};

export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48
};

export const Typography = {
  header: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.25
  },
  body: {
    fontSize: 16,
    lineHeight: 24
  },
  caption: {
    fontSize: 14,
    color: '#888'
  }
};
