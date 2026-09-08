import { useThemeStore } from '../store/useThemeStore';
import { lightColors, darkColors } from './colors';

export function useAppTheme() {
  const mode = useThemeStore((s) => s.mode);
  const colors = mode === 'dark' ? darkColors : lightColors;
  return { colors, mode };
}