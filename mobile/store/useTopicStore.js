import { create } from 'zustand';
import {
  getTopics,
  createTopic,
  deleteTopic,
  getTopicItems,
  addTopicItem,
  deleteTopicItem,
} from '../api/topics';

export const useTopicStore = create((set, get) => ({
  topics: [],
  loading: false,

  topicItems: {}, // { [topicId]: [items] }
  itemsLoading: false,

  fetchTopics: async () => {
    set({ loading: true });
    try {
      const data = await getTopics();
      set({ topics: data, loading: false });
    } catch (error) {
      console.error('Failed to fetch topics:', error.message);
      set({ loading: false });
    }
  },

  addTopic: async (name) => {
    try {
      const created = await createTopic(name);
      set((state) => ({ topics: [created, ...state.topics] }));
      return { success: true, topic: created };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  removeTopic: async (id) => {
    try {
      await deleteTopic(id);
      set((state) => ({ topics: state.topics.filter((t) => t._id !== id) }));
    } catch (error) {
      console.error('Failed to remove topic:', error.message);
    }
  },

  fetchTopicItems: async (topicId) => {
    set({ itemsLoading: true });
    try {
      const items = await getTopicItems(topicId);
      set((state) => ({
        topicItems: { ...state.topicItems, [topicId]: items },
        itemsLoading: false,
      }));
    } catch (error) {
      console.error('Failed to fetch topic items:', error.message);
      set({ itemsLoading: false });
    }
  },

  addItemToTopic: async (topicId, item) => {
    try {
      const created = await addTopicItem(topicId, item);
      set((state) => ({
        topicItems: {
          ...state.topicItems,
          [topicId]: [created, ...(state.topicItems[topicId] || [])],
        },
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  removeItemFromTopic: async (topicId, itemId) => {
    try {
      await deleteTopicItem(topicId, itemId);
      set((state) => ({
        topicItems: {
          ...state.topicItems,
          [topicId]: (state.topicItems[topicId] || []).filter((i) => i._id !== itemId),
        },
      }));
    } catch (error) {
      console.error('Failed to remove item:', error.message);
    }
  },
}));