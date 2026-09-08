import { create } from 'zustand';

export const usePlayerStore = create((set, get) => ({
  currentEpisode: null,
  isPlaying: false,
  position: 0,
  duration: 1,
  _controls: null,

  registerControls: (controls) => set({ _controls: controls }),

  playEpisode: (episode) => {
    const controls = get()._controls;
    if (controls) controls.playEpisode(episode);
  },

  togglePlayPause: () => {
    const controls = get()._controls;
    if (controls) controls.togglePlayPause();
  },

  seekTo: (seconds) => {
    const controls = get()._controls;
    if (controls) controls.seekTo(seconds);
  },

  skip: (seconds) => {
    const controls = get()._controls;
    if (controls) controls.skip(seconds);
  },
  stopEpisode: () => {
    const controls = get()._controls;
    if (controls) controls.stopEpisode();
    set({ currentEpisode: null, isPlaying: false, position: 0 });
  },
}));