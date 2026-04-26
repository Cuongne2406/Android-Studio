export const Colors = {
  primary: '#4A7C59', // Sage Green
  secondary: '#C87941', // Terracotta
  success: '#10B981', // Emerald
  warning: '#F59E0B', // Amber
  danger: '#EF4444', // Rose
  info: '#3B82F6', // Sky Blue
  accent: '#D2B48C', // Tan
  light: {
    background: '#F9F6F0', // Warm Ivory
    card: '#FFFFFF',
    text: '#2D3A3A', // Dark Pine/Slate
    subText: '#6C7A7A', // Muted Pine
    border: '#E8E4DB', // Beige border
    input: '#FFFFFF',
    divider: '#E8E4DB',
    glass: 'rgba(255, 255, 255, 0.7)',
  },
  dark: {
    background: '#1A2421', // Very Dark Pine
    card: '#24302C', // Dark Card
    text: '#F0EBE1', // Off-white
    subText: '#9CA3AF',
    border: '#2C3A35',
    input: '#1F2926',
    divider: '#2C3A35',
    glass: 'rgba(36, 48, 44, 0.7)',
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
