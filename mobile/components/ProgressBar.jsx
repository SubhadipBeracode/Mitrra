import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useAppTheme } from '../theme/useAppTheme';

export default function ProgressBar({ progress, onSeek }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const handlePress = (event) => {
    const { locationX } = event.nativeEvent;
    const { pageX, layout } = event.nativeEvent; // fallback not used
    event.target.measure((fx, fy, width) => {
      const percentage = Math.max(0, Math.min(1, locationX / width));
      onSeek(percentage);
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        <View style={[styles.thumb, { left: `${progress * 100}%` }]} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    track: {
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 3,
      marginHorizontal: 20,
      justifyContent: 'center',
    },
    fill: {
      height: 6,
      backgroundColor: colors.primary,
      borderRadius: 3,
      position: 'absolute',
      left: 0,
    },
    thumb: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: colors.primary,
      position: 'absolute',
      marginLeft: -7,
    },
  });