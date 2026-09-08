import authenticatedFetch from './apiClient';

export async function getEpisodes() {
  return authenticatedFetch('/episodes', { method: 'GET' });
}

export async function getEpisodeById(id) {
  return authenticatedFetch(`/episodes/${id}`, { method: 'GET' });
}

export async function updateEpisodeFeedback(id, feedback) {
  return authenticatedFetch(`/episodes/${id}/feedback`, {
    method: 'PATCH',
    body: JSON.stringify({ feedback }),
  });
}

export async function deleteEpisode(id) {
  return authenticatedFetch(`/episodes/${id}`, { method: 'DELETE' });
}