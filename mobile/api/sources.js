import authenticatedFetch from './apiClient';

export async function getSources() {
  return authenticatedFetch('/sources', { method: 'GET' });
}

export async function addSource(newSource) {
  return authenticatedFetch('/sources', {
    method: 'POST',
    body: JSON.stringify(newSource),
  });
}

export async function deleteSource(id) {
  return authenticatedFetch(`/sources/${id}`, { method: 'DELETE' });
}