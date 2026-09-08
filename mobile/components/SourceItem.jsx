import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Trash2, Rss, Tag, Sparkles } from 'lucide-react-native';
import { useAppTheme } from '../theme/useAppTheme';

export default function SourceItem({ source, onDelete, onGenerate, isGenerating }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const Icon = source.type === 'RSS' ? Rss : Tag;

  return (
    <View style={styles.item}>
      <View style={styles.left}>
        <Icon color={colors.primary} size={20} />
        <View style={styles.textGroup}>
          <Text style={styles.name}>{source.name}</Text>
          <Text style={styles.type}>{source.type}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {source.type === 'RSS' && (
          <TouchableOpacity
            onPress={onGenerate}
            disabled={isGenerating}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Sparkles color={colors.primary} size={20} />
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={onDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Trash2 color={colors.danger} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 6,
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    textGroup: {
      gap: 2,
    },
    name: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    type: {
      color: colors.textMuted,
      fontSize: 13,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 18,
    },
  });