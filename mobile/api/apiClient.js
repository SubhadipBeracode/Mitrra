import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from './config';

async function authenticatedFetch(endpoint, options = {}) {
  const token = await SecureStore.getItemAsync('authToken');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export default authenticatedFetch;