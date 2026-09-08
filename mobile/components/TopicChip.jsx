import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme/useAppTheme';

export default function TopicChip({ label, selected, onPress }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors, selected);

  return (
    <TouchableOpacity style={styles.chip} onPress={onPress}>
      <Text style={styles.chipText}>{label}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors, selected) =>
  StyleSheet.create({
    chip: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: selected ? colors.primary : colors.border,
      backgroundColor: selected ? colors.primary : colors.surface,
      marginRight: 10,
      marginBottom: 10,
    },
    chipText: {
      color: selected ? colors.background : colors.text,
      fontSize: 14,
      fontWeight: '600',
    },
  });