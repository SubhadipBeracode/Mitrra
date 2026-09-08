import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Rss, Instagram, Youtube, Linkedin, Twitter, Facebook, Globe, Trash2, Sparkles } from 'lucide-react-native';
import { useAppTheme } from '../theme/useAppTheme';

const platformIcons = {
  Instagram,
  YouTube: Youtube,
  LinkedIn: Linkedin,
  X: Twitter,
  Facebook,
  Website: Globe,
};

export default function TopicItemRow({ item, onDelete, onGenerate, isGenerating }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const Icon = item.type === 'RSS' ? Rss : (platformIcons[item.platform] || Globe);

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Icon color={colors.primary} size={18} />
        <View style={styles.textGroup}>
          <Text style={styles.url} numberOfLines={1}>{item.url}</Text>
          <Text style={styles.type}>{item.type === 'RSS' ? 'RSS Feed' : item.platform}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onGenerate}
          disabled={isGenerating}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isGenerating ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Sparkles color={colors.primary} size={18} />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Trash2 color={colors.danger} size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 10,
      padding: 14,
      marginVertical: 5,
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
      marginRight: 10,
    },
    textGroup: {
      flex: 1,
    },
    url: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '600',
    },
    type: {
      color: colors.textMuted,
      fontSize: 11,
      marginTop: 2,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
  });