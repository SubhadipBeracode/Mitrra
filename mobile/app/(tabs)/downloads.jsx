import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Trash2, Play, Download } from 'lucide-react-native';
import { useAppTheme } from '../../theme/useAppTheme'
import { useDownloadStore } from '../../store/useDownloadStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import ScreenGradientBackground from '../../components/ScreenGradientBackground';
import EmptyState from '../../components/EmptyState';
import CustomAlert from '../../components/CustomAlert';

export default function Downloads() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const downloads = useDownloadStore((s) => s.downloads);
  const removeDownload = useDownloadStore((s) => s.removeDownload);
  const playEpisode = usePlayerStore((s) => s.playEpisode);

  const [itemToDelete, setItemToDelete] = useState(null);

  const downloadsList = Object.values(downloads).filter((d) => d.status === 'downloaded');

  const handlePlayDirectly = (download) => {
    playEpisode({
      _id: download.episodeId,
      title: download.title,
      date: download.date,
      audioUrl: download.localUri,
      transcript: download.transcript,
    });
  };

  const handleOpenPlayer = (download) => {
    router.push(`/episode/${download.episodeId}`);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await removeDownload(itemToDelete.episodeId);
      setItemToDelete(null);
    }
  };

  return (
    <ScreenGradientBackground>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Downloads</Text>
          <View style={{ width: 28 }} />
        </View>

        <FlatList
          data={downloadsList}
          keyExtractor={(item) => item.episodeId}
          contentContainerStyle={downloadsList.length === 0 ? { flex: 1 } : { paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleOpenPlayer(item)}
              activeOpacity={0.7}
            >
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.itemMeta}>Downloaded · Available offline</Text>
              </View>

              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => handlePlayDirectly(item)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Play color={colors.background} size={16} fill={colors.background} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setItemToDelete(item)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Trash2 color={colors.danger} size={20} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <EmptyState
              imageSource={require('../../assets/image/download.png')}
              title="No downloads yet"
              subtitle="Download episodes from Home to listen offline"
              buttonText="Go to Home"
              onButtonPress={() => router.push('/(tabs)')}
            />
          }
        />

        <CustomAlert
          visible={!!itemToDelete}
          title="Remove Download?"
          message={`Are you sure you want to remove "${itemToDelete?.title}" from your downloads?`}
          confirmText="Remove"
          destructive
          onConfirm={handleConfirmDelete}
          onCancel={() => setItemToDelete(null)}
        />
      </View>
    </ScreenGradientBackground>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 40,
      paddingHorizontal: 16,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    topBarTitle: {
      color: colors.text,
      fontSize: 24,
      fontWeight: '800',
      textAlign: 'center',
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginVertical: 6,
    },
    itemInfo: {
      flex: 1,
      marginRight: 12,
    },
    itemTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '600',
      marginBottom: 4,
    },
    itemMeta: {
      color: colors.textMuted,
      fontSize: 12,
    },
    itemActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    playButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });