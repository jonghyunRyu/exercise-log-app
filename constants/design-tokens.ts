/**
 * FitLog 디자인 시스템 토큰
 *
 * 모든 UI에서 이 토큰을 사용하여 일관된 디자인을 유지한다.
 * 값을 직접 하드코딩하지 말고 반드시 이 파일의 토큰을 참조할 것.
 */

// --- Spacing (간격) ---
// 4px 단위 기반 스케일
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
} as const;

// --- Border Radius (모서리 둥글기) ---
export const Radius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  pill: 20,  // 칩, 태그용
} as const;

// --- Font Size (글자 크기) ---
export const FontSize = {
  xs: 11,
  sm: 12,
  md: 14,
  base: 15,
  lg: 16,
  xl: 17,
  '2xl': 18,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
  display: 42,
} as const;

// --- Font Weight (글자 굵기) ---
export const FontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
};

// --- Semantic Colors (의미 기반 색상) ---
// 테마 독립적인 고정 색상
export const SemanticColors = {
  error: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  white: '#ffffff',
  overlay: 'rgba(0,0,0,0.5)',
  placeholder: '#666',
  // 카드/서피스 배경 (다크 모드 기준, 반투명)
  surfaceLight: 'rgba(255,255,255,0.08)',
  surfaceSubtle: 'rgba(255,255,255,0.05)',
  border: '#333',
  divider: 'rgba(255,255,255,0.1)',
  // 스플래시
  splashBg: '#0a0a0a',
} as const;

// --- Opacity (투명도) ---
export const Opacity = {
  muted: 0.5,
  subtle: 0.6,
  soft: 0.7,
} as const;

// --- Icon Size ---
export const IconSize = {
  sm: 14,
  md: 18,
  lg: 20,
  xl: 28,
} as const;
