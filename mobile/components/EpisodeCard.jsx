import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Play, Trash2, Download, Check } from 'lucide-react-native';
import { useAppTheme } from '../theme/useAppTheme';
import { useDownloadStore } from '../store/useDownloadStore';

export default function EpisodeCard({ episode, onPress, onPlayPress, onDeletePress }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const downloadInfo = useDownloadStore((s) => s.downloads[episode._id]);
  const downloadEpisode = useDownloadStore((s) => s.downloadEpisode);

  const isDownloading = downloadInfo?.status === 'downloading';
  const isDownloaded = downloadInfo?.status === 'downloaded';

  const handleDownloadPress = (e) => {
    e.stopPropagation?.();
    if (!isDownloaded && !isDownloading) {
      downloadEpisode(episode);
    }
  };
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{episode.title}</Text>
        <Text style={styles.meta}>
          {episode.date || new Date(episode.createdAt).toLocaleDateString()} · {formatDuration(episode.duration)}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownloadPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isDownloading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : isDownloaded ? (
            <Check color={colors.secondary} size={18} />
          ) : (
            <Download color={colors.textMuted} size={18} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDeletePress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Trash2 color={colors.danger} size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={onPlayPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Play color={colors.background} size={20} fill={colors.background} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 6,
    },
    info: {
      flex: 1,
      marginRight: 8,
    },
    title: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    meta: {
      color: colors.textMuted,
      fontSize: 13,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    downloadButton: {
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteButton: {
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    playButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });