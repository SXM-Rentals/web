// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The same colours and sizes as app/globals.css, but
// written as JavaScript so that the small amount of code which genuinely needs
// a number can read one — working out how wide a bar on a chart should be, or
// how many squares to draw in a calendar month.
//
// IMPORTANT: this file is NOT for styling. All styling reads the CSS variables
// in app/globals.css instead. This exists only so the two never disagree: if a
// colour changes there, change it here too.

// ---- LIGHT MODE COLOURS ----
const light = {
  ground: '#F5F5F6',
  card: '#FFFFFF',
  tile: '#F0F1F2',
  overlay: 'rgba(14, 17, 20, 0.45)',

  hairline: '#E4E5E7',

  ink: '#0E1114',
  ink2: '#6B7280',
  ink3: '#9CA3AF',

  primary: '#232B2E',
  primaryText: '#FFFFFF',
  primaryPressed: '#151A1C',

  star: '#FF9500',
  brand: '#0B9BFF',
  brandSoft: '#E6F4FF',
  success: '#22C55E',
  successSoft: '#D6F5DE',
  warning: '#D97706',
  warningSoft: '#FEF3C7',
  danger: '#EF4444',
  dangerSoft: '#FEE2E2',

  disabled: '#C9CCD1',
  disabledSurface: '#EDEEF0',
};

// ---- DARK MODE COLOURS ----
// Note the flip: the main button becomes near-white with dark text, because a
// charcoal button on a charcoal page would be almost invisible.
const dark: typeof light = {
  ground: '#0D0F11',
  card: '#16191D',
  tile: '#1C2025',
  overlay: 'rgba(0, 0, 0, 0.6)',

  hairline: '#2A2F36',

  ink: '#F3F5F7',
  ink2: '#A2AAB5',
  ink3: '#78818D',

  primary: '#F3F5F7',
  primaryText: '#0D0F11',
  primaryPressed: '#D8DDE3',

  star: '#FFA726',
  brand: '#3DAEFF',
  brandSoft: '#10293C',
  success: '#34D399',
  successSoft: '#0F2E22',
  warning: '#FBBF24',
  warningSoft: '#33270A',
  danger: '#F87171',
  dangerSoft: '#3A1616',

  disabled: '#4A525C',
  disabledSurface: '#22272D',
};

export const palettes = { light, dark };
export type Colors = typeof light;

// ---- SPACING ----
// All gaps between things are multiples of 4, so the layout stays even.
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

// ---- CORNER ROUNDNESS ----
export const radius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 20,
  pill: 999,
};

// ---- TEXT SIZES ----
export const type = {
  display: { size: 38, line: 44, weight: '700' as const, spacing: -0.8 },
  h1: { size: 30, line: 36, weight: '700' as const, spacing: -0.5 },
  h2: { size: 22, line: 28, weight: '700' as const, spacing: -0.3 },
  h3: { size: 18, line: 24, weight: '700' as const, spacing: -0.2 },
  bodyLg: { size: 16, line: 24, weight: '400' as const, spacing: 0 },
  body: { size: 15, line: 22, weight: '400' as const, spacing: 0 },
  label: { size: 14, line: 20, weight: '600' as const, spacing: 0 },
  small: { size: 13, line: 18, weight: '400' as const, spacing: 0 },
  caption: { size: 11, line: 14, weight: '600' as const, spacing: 0.2 },
};

// ---- STANDARD SIZES ----
export const sizes = {
  button: 56,
  buttonSm: 44,
  input: 54,
  iconButton: 44,
  touchMin: 44,
};

// ---- THE POINTS AT WHICH THE LAYOUT CHANGES SHAPE ----
// A phone gets one column. A laptop gets filters down the side and several
// columns of results. A very wide monitor gets a fourth column, and the content
// stops growing so it never stretches from edge to edge.
export const breakpoints = {
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

export const layout = {
  contentMax: 1400,
  sidebarWidth: 280,
  topBarHeight: 68,
};
