import { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet ,Image} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import PagerView from 'react-native-pager-view';
import { Play, Pause, RotateCcw, RotateCw, ChevronLeft } from 'lucide-react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import { getEpisodeById } from '../../api/episodes';
import ProgressBar from '../../components/ProgressBar';
import { useEpisodeStore } from '../../store/useEpisodeStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import FeedbackButtons from '../../components/FeedbackButtons';
import ScreenGradientBackground from '../../components/ScreenGradientBackground';
import { useDownloadStore } from '../../store/useDownloadStore';
export default function EpisodePlayer() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [episode, setEpisode] = useState(null);
  const [activePage, setActivePage] = useState(0);
  const pagerRef = useRef(null);

  const currentEpisode = usePlayerStore((s) => s.currentEpisode);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const position = usePlayerStore((s) => s.position);
  const duration = usePlayerStore((s) => s.duration);
  const playEpisode = usePlayerStore((s) => s.playEpisode);
  const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);
  const seekTo = usePlayerStore((s) => s.seekTo);
  const skip = usePlayerStore((s) => s.skip);

  const setFeedback = useEpisodeStore((s) => s.setFeedback);

  useEffect(() => {
    const downloadedVersion = useDownloadStore.getState().downloads[id];

    if (downloadedVersion && downloadedVersion.status === 'downloaded') {
      // Offline: downloaded data use karo, network call mat karo
      setEpisode({
        _id: downloadedVersion.episodeId,
        title: downloadedVersion.title,
        date: downloadedVersion.date,
        audioUrl: downloadedVersion.localUri,
        transcript: downloadedVersion.transcript,
        feedback: null,
      });
    } else {
      // Online: normal API se fetch karo
      getEpisodeById(id)
        .then((data) => {
          setEpisode(data);
        })
        .catch((error) => {
          console.error('Failed to fetch episode:', error.message);
        });
    }
  }, [id]);

  const handleFeedback = (value) => {
    if (!episode) return;
    setFeedback(episode._id, value);
    setEpisode((prev) => (prev ? { ...prev, feedback: value } : prev));
  };

  const handleSeek = (percentage) => {
    seekTo(percentage * duration);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const totalSeconds = Math.floor(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!episode) return null;

  const isThisEpisodeActive = currentEpisode?._id === episode._id;
  const progress = isThisEpisodeActive && duration ? position / duration : 0;

  return (
    <ScreenGradientBackground>
      <View style={styles.container}>
        <View style={styles.topBar}>
          {/* Back button is only visible when activePage is 0 (Player) */}
          {activePage === 0 ? (
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronLeft color={colors.text} size={28} />
            </TouchableOpacity>
          ) : (
            /* Spacer to maintain height when button is hidden */
            <View style={{ height: 28 }} />
          )}
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity onPress={() => pagerRef.current?.setPage(0)}>
            <Text style={[styles.tabLabel, activePage === 0 && styles.tabLabelActive]}>
              Player
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => pagerRef.current?.setPage(1)}>
            <Text style={[styles.tabLabel, activePage === 1 && styles.tabLabelActive]}>
              Transcript
            </Text>
          </TouchableOpacity>
        </View>

        <PagerView
          ref={pagerRef}
          style={styles.pager}
          initialPage={0}
          onPageSelected={(e) => setActivePage(e.nativeEvent.position)}
        >
          <View key="player" style={styles.page}>
            {episode.imageUrl ? (
              <Image source={{ uri: episode.imageUrl }} style={styles.artworkPlaceholder} />
            ) : (
              <View style={styles.artworkPlaceholder} />
            )}
            <Text style={styles.title}>{episode.title}</Text>
            <Text style={styles.meta}>{episode.date || new Date(episode.createdAt).toLocaleDateString()}</Text>

            <View style={styles.progressSection}>
              <ProgressBar progress={progress} onSeek={handleSeek} />
              <View style={styles.timeRow}>
                <Text style={styles.timeText}>
                  {formatTime(isThisEpisodeActive ? position : 0)}
                </Text>
                <Text style={styles.timeText}>
                  {formatTime(isThisEpisodeActive ? duration : 0)}
                </Text>
              </View>
            </View>

            <View style={styles.controlsRow}>
              <TouchableOpacity onPress={() => skip(-10)}>
                <RotateCcw color={colors.text} size={28} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => {
                  if (isThisEpisodeActive) {
                    togglePlayPause();
                  } else {
                    playEpisode(episode);
                  }
                }}
              >
                {isThisEpisodeActive && isPlaying ? (
                  <Pause color={colors.background} size={28} fill={colors.background} />
                ) : (
                  <Play color={colors.background} size={28} fill={colors.background} />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => skip(10)}>
                <RotateCw color={colors.text} size={28} />
              </TouchableOpacity>
            </View>

            <View style={styles.feedbackSection}>
              <FeedbackButtons feedback={episode.feedback} onFeedback={handleFeedback} />
            </View>
          </View>

          <View key="transcript" style={styles.page}>
            <View style={styles.transcriptFeedbackRow}>
              <FeedbackButtons feedback={episode.feedback} onFeedback={handleFeedback} />
            </View>
            <ScrollView
              style={styles.transcriptScroll}
              contentContainerStyle={{ padding: 20 }}
            >
              <Text style={styles.transcriptText}>{episode.transcript}</Text>
            </ScrollView>
          </View>
        </PagerView>
      </View>
    </ScreenGradientBackground>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 50,
    },
    topBar: {
      paddingHorizontal: 16,
      marginBottom: 10,
      height: 30, // Defined height to prevent layout jump when button disappears
      justifyContent: 'center',
    },
    tabRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 30,
      marginBottom: 10,
    },
    tabLabel: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '800',
      paddingBottom: 8,
    },
    tabLabelActive: {
      color: colors.text,
      borderBottomWidth: 2,
      borderBottomColor: colors.bottom,
    },
    pager: {
      flex: 1,
    },
    page: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 0,
    },
    artworkPlaceholder: {
      width: 220,
      height: 220,
      borderRadius: 16,
      backgroundColor: colors.surface,
      marginBottom: 24,
    },
    title: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 4,
    },
    meta: {
      color: colors.textMuted,
      fontSize: 14,
      marginBottom: 30,
    },
    progressSection: {
      width: '100%',
      marginBottom: 20,
    },
    timeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 20,
      marginTop: 6,
    },
    timeText: {
      color: colors.textMuted,
      fontSize: 12,
    },
    controlsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 30,
    },
    playButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    feedbackSection: {
      marginTop: 24,
      alignItems: 'center',
    },
    transcriptFeedbackRow: {
      paddingHorizontal: 10,
      paddingTop: 6,
      alignItems: 'flex-end',
      width: '100%',
    },
    transcriptScroll: {
      flex: 1,
      width: '100%',
    },
    transcriptText: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 24,
    },
  });