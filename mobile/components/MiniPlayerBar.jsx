import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, X } from 'lucide-react-native';
import { useAppTheme } from '../theme/useAppTheme';
import { usePlayerStore } from '../store/usePlayerStore';

export default function MiniPlayerBar() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const currentEpisode = usePlayerStore((s) => s.currentEpisode);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);
  const stopEpisode = usePlayerStore((s) => s.stopEpisode);

  if (!currentEpisode) return null;

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {currentEpisode.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {currentEpisode.date}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.playButton}
        onPress={togglePlayPause}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {isPlaying ? (
          <Pause color={colors.background} size={18} fill={colors.background} />
        ) : (
          <Play color={colors.background} size={18} fill={colors.background} />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={stopEpisode}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <X color={colors.textMuted} size={20} />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 70,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 10,
      gap: 12,
    },
    info: {
      flex: 1,
    },
    title: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 12,
    },
    playButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButton: {
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });