export const COLORS = {
  bg: '#06060A',
  surface1: '#0E0E14',
  surface2: '#16161F',
  border: '#1E1E2E',
  textPrimary: '#E8E6E3',
  textSecondary: '#8B8B9E',
  textMuted: '#555566',
  accentGreen: '#4ADE80',
  accentCyan: '#22D3EE',
  accentPurple: '#8B5CF6',
  accentAmber: '#FBBF24',
  synapseBlue: '#2E7DFF',
  particleDim: '#1A3A5C',
  particleMid: '#3B6EA8',
  particleActive: '#5FA8FF',
  particleHot: '#A5D8FF',
} as const;

export const TIMING = {
  cursorBlink: 530,
  typingSpeed: 45,
  typingSpeedFast: 30,
  scrollDuration: 1.2,
  revealStagger: 0.08,
  counterDuration: 1800,
} as const;

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

export const EASING = {
  expoOut: [0.22, 1, 0.36, 1] as const,
  expoInOut: [0.87, 0, 0.13, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
  smooth: [0.16, 1, 0.3, 1] as const,
} as const;
