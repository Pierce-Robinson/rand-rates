import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#111827',
    background: '#FFFFFF',
    backgroundElement: '#F3F4F6',
    backgroundSelected: '#E5E7EB',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    accent: '#0F766E',
    accentSoft: '#E6F4F2',
    onAccent: '#FFFFFF',
    positive: '#15803D',
    negative: '#B91C1C',
    warning: '#92400E',
    warningSoft: '#FEF3C7',
  },
  dark: {
    text: '#F9FAFB',
    background: '#000000',
    backgroundElement: '#18181B',
    backgroundSelected: '#27272A',
    textSecondary: '#A1A1AA',
    border: '#27272A',
    accent: '#2DD4BF',
    accentSoft: '#0F2E2B',
    onAccent: '#042F2E',
    positive: '#4ADE80',
    negative: '#F87171',
    warning: '#FCD34D',
    warningSoft: '#3B2F0A',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 8,
  medium: 12,
  large: 16,
  pill: 999,
} as const;

export const MaxContentWidth = 640;
