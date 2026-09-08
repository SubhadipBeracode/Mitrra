import authenticatedFetch from './apiClient';

export async function getTopics() {
  return authenticatedFetch('/topics', { method: 'GET' });
}

export async function createTopic(name) {
  return authenticatedFetch('/topics', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export async function deleteTopic(id) {
  return authenticatedFetch(`/topics/${id}`, { method: 'DELETE' });
}

export async function getTopicItems(topicId) {
  return authenticatedFetch(`/topics/${topicId}/items`, { method: 'GET' });
}

export async function addTopicItem(topicId, item) {
  return authenticatedFetch(`/topics/${topicId}/items`, {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export async function deleteTopicItem(topicId, itemId) {
  return authenticatedFetch(`/topics/${topicId}/items/${itemId}`, { method: 'DELETE' });
}

export async function generateEpisodeFromTopic(topicId) {
  return authenticatedFetch(`/topics/${topicId}/generate-episode`, { method: 'POST' });
}

export async function generateEpisodeFromItem(topicId, itemId) {
  return authenticatedFetch(`/topics/${topicId}/items/${itemId}/generate-episode`, { method: 'POST' });
}