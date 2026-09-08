import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../theme/useAppTheme';

export default function ScreenGradientBackground({ children }) {
  const { colors } = useAppTheme();

  return (
    <LinearGradient
      colors={[colors.primary + '80', colors.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.5 }}
      style={styles.gradient}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});