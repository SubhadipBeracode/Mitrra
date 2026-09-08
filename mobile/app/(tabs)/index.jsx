import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Headphones } from 'lucide-react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import { useEpisodeStore } from '../../store/useEpisodeStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import EpisodeCard from '../../components/EpisodeCard';
import EmptyState from '../../components/EmptyState';
import CustomAlert from '../../components/CustomAlert';
import ScreenGradientBackground from '../../components/ScreenGradientBackground';
import { useAuthStore } from '../../store/useAuthStore';

export default function Home() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const episodes = useEpisodeStore((s) => s.episodes);
  const loading = useEpisodeStore((s) => s.loading);
  const fetchEpisodes = useEpisodeStore((s) => s.fetchEpisodes);
  const removeEpisode = useEpisodeStore((s) => s.removeEpisode);
  const playEpisode = usePlayerStore((s) => s.playEpisode);

  const [episodeToDelete, setEpisodeToDelete] = useState(null);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEpisodes();
    }
  }, [isAuthenticated]);

  const handleConfirmDelete = async () => {
    if (episodeToDelete) {
      await removeEpisode(episodeToDelete._id);
      setEpisodeToDelete(null);
    }
  };

  if (loading) {
    return (
      <ScreenGradientBackground>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenGradientBackground>
    );
  }

  return (
    <ScreenGradientBackground>
      <View style={styles.container}>
        <Text style={styles.header}>Your Episodes</Text>
        <FlatList
          data={episodes}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <EpisodeCard
              episode={item}
              onPress={() => router.push(`/episode/${item._id}`)}
              onPlayPress={() => playEpisode(item)}
              onDeletePress={() => setEpisodeToDelete(item)}
            />
          )}
          contentContainerStyle={episodes.length === 0 ? { flex: 1 } : { paddingBottom: 90 }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchEpisodes}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              imageSource={require('../../assets/image/avatar.png')}
              title="No episodes yet"
              subtitle="Add a few sources and your first digest will be ready soon"
              buttonText="Go to Sources"
              onButtonPress={() => router.push('/(tabs)/sources')}
            />

          }

        />


        <CustomAlert
          visible={!!episodeToDelete}
          title="Delete Episode?"
          message={`Are you sure you want to delete "${episodeToDelete?.title}"? This can't be undone.`}
          confirmText="Delete"
          destructive
          onConfirm={handleConfirmDelete}
          onCancel={() => setEpisodeToDelete(null)}
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
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      color: colors.text,
      fontSize: 24,
      fontWeight: '800',
      marginHorizontal: 16,
      marginBottom: 15,
      textAlign: 'center',
    },
  });