import { create } from 'zustand';
import { getEpisodes, updateEpisodeFeedback, deleteEpisode } from '../api/episodes';
import { generateEpisodeFromTopic, generateEpisodeFromItem } from '../api/topics';

export const useEpisodeStore = create((set) => ({
  episodes: [],
  loading: false,
  generating: false,

  fetchEpisodes: async () => {
    set({ loading: true });
    try {
      const data = await getEpisodes();
      set({ episodes: data, loading: false });
    } catch (error) {
      console.error('Failed to fetch episodes:', error.message);
      set({ loading: false });
    }
  },

  setFeedback: async (episodeId, feedback) => {
    set((state) => ({
      episodes: state.episodes.map((ep) =>
        ep._id === episodeId ? { ...ep, feedback } : ep
      ),
    }));
    try {
      await updateEpisodeFeedback(episodeId, feedback);
    } catch (error) {
      console.error('Failed to update feedback:', error.message);
    }
  },

  generateFromTopic: async (topicId) => {
    set({ generating: true });
    try {
      const newEpisode = await generateEpisodeFromTopic(topicId);
      set((state) => ({
        episodes: [newEpisode, ...state.episodes],
        generating: false,
      }));
      return { success: true, episode: newEpisode };
    } catch (error) {
      set({ generating: false });
      return { success: false, error: error.message };
    }
  },

  generateFromItem: async (topicId, itemId) => {
    try {
      const newEpisode = await generateEpisodeFromItem(topicId, itemId);
      set((state) => ({
        episodes: [newEpisode, ...state.episodes],
      }));
      return { success: true, episode: newEpisode };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  removeEpisode: async (id) => {
    try {
      await deleteEpisode(id);
      set((state) => ({ episodes: state.episodes.filter((ep) => ep._id !== id) }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
}));