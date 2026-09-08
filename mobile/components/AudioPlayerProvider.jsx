// import { useEffect, useRef } from 'react';
// import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
// import { usePlayerStore } from '../store/usePlayerStore';

// export default function AudioPlayerProvider() {
//   const currentEpisode = usePlayerStore((s) => s.currentEpisode);
//   const registerControls = usePlayerStore((s) => s.registerControls);

//   const player = useAudioPlayer(currentEpisode?.audioUrl ?? null);
//   const status = useAudioPlayerStatus(player);

//   // Reference to track if we should auto-play the track when the player instance changes
//   const shouldAutoPlay = useRef(false);

//   // 1. Listen for player instance changes. Once the new player is mounted, play it safely.
//   useEffect(() => {
//     if (player && shouldAutoPlay.current) {
//       player.play();
//       shouldAutoPlay.current = false;
//     }
//   }, [player]);

//   useEffect(() => {
//     usePlayerStore.setState({
//       isPlaying: status.playing,
//       position: status.currentTime,
//       duration: status.duration || 1,
//     });
//   }, [status.playing, status.currentTime, status.duration]);

//   useEffect(() => {
//     registerControls({
//       playEpisode: (episode) => {

//         const currentUrl = usePlayerStore.getState().currentEpisode?.audioUrl;
//         const isDifferentEpisode = currentUrl !== episode.audioUrl;

//         usePlayerStore.setState({ currentEpisode: episode });

//         if (isDifferentEpisode) {
//           shouldAutoPlay.current = true;
//         } else {
//           player.play();
//         }
//       },
//       togglePlayPause: () => {
//         const isFinished =
//           status.duration > 0 &&
//           status.currentTime >= status.duration - 0.2;

//         if (isFinished) {
//           player.seekTo(0);
//           player.play();
//           return;
//         }

//         if (status.playing) {
//           player.pause();
//         } else {
//           player.play();
//         }
//       },
//       seekTo: (seconds) => player.seekTo(seconds),
//       skip: (seconds) => {
//         const newTime = Math.max(0, Math.min(status.duration ?? 0, status.currentTime + seconds));
//         player.seekTo(newTime);
//       },
//       stopEpisode: () => {
//         player.pause();
//         player.seekTo(0);
//       },
//     });
//   }, [player, status.playing, status.currentTime, status.duration]);

//   return null;
// }

import { useEffect, useRef } from 'react';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { usePlayerStore } from '../store/usePlayerStore';

export default function AudioPlayerProvider() {
  const currentEpisode = usePlayerStore((s) => s.currentEpisode);
  const registerControls = usePlayerStore((s) => s.registerControls);

  const player = useAudioPlayer(currentEpisode?.audioUrl ?? null);
  const status = useAudioPlayerStatus(player);

  const shouldAutoPlay = useRef(false);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'duckOthers',
    });
  }, []);

  useEffect(() => {
    if (player && shouldAutoPlay.current) {
      player.play();
      shouldAutoPlay.current = false;
    }
  }, [player]);

  useEffect(() => {
    usePlayerStore.setState({
      isPlaying: status.playing,
      position: status.currentTime,
      duration: status.duration || 1,
    });
  }, [status.playing, status.currentTime, status.duration]);

  useEffect(() => {
    registerControls({
      playEpisode: (episode) => {
        const currentUrl = usePlayerStore.getState().currentEpisode?.audioUrl;
        const isDifferentEpisode = currentUrl !== episode.audioUrl;

        usePlayerStore.setState({ currentEpisode: episode });

        if (isDifferentEpisode) {
          shouldAutoPlay.current = true;
        } else {
          player.play();
        }
      },
      togglePlayPause: () => {
        if (status.playing) {
          player.pause();
        } else {
          player.play();
        }
      },
      seekTo: (seconds) => player.seekTo(seconds),
      skip: (seconds) => {
        const newTime = Math.max(0, Math.min(status.duration ?? 0, status.currentTime + seconds));
        player.seekTo(newTime);
      },
      stopEpisode: () => {
        player.pause();
        player.seekTo(0);
      },
    });
  }, [player, status.playing, status.currentTime, status.duration]);

  return null;
}