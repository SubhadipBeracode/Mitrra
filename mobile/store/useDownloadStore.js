import { create } from 'zustand';
import * as FileSystem from 'expo-file-system/legacy';

const DOWNLOADS_DIR = FileSystem.documentDirectory + 'downloads/';

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(DOWNLOADS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(DOWNLOADS_DIR, { intermediates: true });
  }
};

export const useDownloadStore = create((set, get) => ({
  downloads: {},

  downloadEpisode: async (episode) => {
    await ensureDirExists();

    const fileName = `${episode._id}.mp3`;
    const localUri = DOWNLOADS_DIR + fileName;

    set((state) => ({
      downloads: {
        ...state.downloads,
        [episode._id]: {
          episodeId: episode._id,
          title: episode.title,
          date: episode.date || episode.createdAt,
          transcript: episode.transcript,
          localUri: null,
          progress: 0,
          status: 'downloading',
        },
      },
    }));

    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        episode.audioUrl,
        localUri,
        {},
        (downloadProgress) => {
          const progress =
            downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          set((state) => ({
            downloads: {
              ...state.downloads,
              [episode._id]: {
                ...state.downloads[episode._id],
                progress,
              },
            },
          }));
        }
      );

      const result = await downloadResumable.downloadAsync();

      set((state) => ({
        downloads: {
          ...state.downloads,
          [episode._id]: {
            ...state.downloads[episode._id],
            localUri: result.uri,
            progress: 1,
            status: 'downloaded',
          },
        },
      }));

      return { success: true };
    } catch (error) {
      set((state) => {
        const updated = { ...state.downloads };
        delete updated[episode._id];
        return { downloads: updated };
      });
      return { success: false, error: error.message };
    }
  },

  removeDownload: async (episodeId) => {
    const download = get().downloads[episodeId];
    if (download?.localUri) {
      try {
        await FileSystem.deleteAsync(download.localUri, { idempotent: true });
      } catch (error) {
        console.error('Failed to delete file:', error.message);
      }
    }

    set((state) => {
      const updated = { ...state.downloads };
      delete updated[episodeId];
      return { downloads: updated };
    });
  },

  clearAllDownloads: async () => {
    const allDownloads = get().downloads;

    for (const episodeId of Object.keys(allDownloads)) {
      const download = allDownloads[episodeId];
      if (download?.localUri) {
        try {
          await FileSystem.deleteAsync(download.localUri, { idempotent: true });
        } catch (error) {
          console.error('Failed to delete file:', error.message);
        }
      }
    }

    set({ downloads: {} });
  },

  getTotalSizeBytes: async () => {
    const allDownloads = get().downloads;
    let totalBytes = 0;

    for (const episodeId of Object.keys(allDownloads)) {
      const download = allDownloads[episodeId];
      if (download?.localUri) {
        try {
          const info = await FileSystem.getInfoAsync(download.localUri);
          if (info.exists && info.size) {
            totalBytes += info.size;
          }
        } catch (error) {
          // file missing, skip
        }
      }
    }

    return totalBytes;
  },

  isDownloaded: (episodeId) => {
    return get().downloads[episodeId]?.status === 'downloaded';
  },
}));