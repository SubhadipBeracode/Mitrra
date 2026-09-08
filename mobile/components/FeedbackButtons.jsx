import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThumbsUp, ThumbsDown } from 'lucide-react-native';
import { useAppTheme } from '../theme/useAppTheme';

export default function FeedbackButtons({ feedback, onFeedback }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const handlePress = (value) => {
    // tap same button again to un-select (toggle off)
    onFeedback(feedback === value ? null : value);
  };

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.button, feedback === 'up' && styles.buttonActiveUp]}
        onPress={() => handlePress('up')}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <ThumbsUp
          color={feedback === 'up' ? colors.background : colors.textMuted}
          size={18}
          fill={feedback === 'up' ? colors.background : 'none'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, feedback === 'down' && styles.buttonActiveDown]}
        onPress={() => handlePress('down')}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <ThumbsDown
          color={feedback === 'down' ? colors.background : colors.textMuted}
          size={18}
          fill={feedback === 'down' ? colors.background : 'none'}
        />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    button: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    buttonActiveUp: {
      backgroundColor: colors.secondary,
      borderColor: colors.secondary,
    },
    buttonActiveDown: {
      backgroundColor: colors.danger,
      borderColor: colors.danger,
    },
  });