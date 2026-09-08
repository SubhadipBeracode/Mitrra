import { create } from 'zustand';
import { getSources, addSource, deleteSource } from '../api/sources';

export const useSourceStore = create((set) => ({
  sources: [],
  loading: false,

  fetchSources: async () => {
    set({ loading: true });
    try {
      const data = await getSources();
      set({ sources: data, loading: false });
    } catch (error) {
      console.error('Failed to fetch sources:', error.message);
      set({ loading: false });
    }
  },

  addNewSource: async (newSource) => {
    try {
      const created = await addSource(newSource);
      set((state) => ({ sources: [...state.sources, created] }));
    } catch (error) {
      console.error('Failed to add source:', error.message);
    }
  },

  removeSource: async (id) => {
    try {
      await deleteSource(id);
      set((state) => ({ sources: state.sources.filter((s) => s._id !== id) }));
    } catch (error) {
      console.error('Failed to remove source:', error.message);
    }
  },
}));