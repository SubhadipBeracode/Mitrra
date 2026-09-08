import { API_BASE_URL } from './config';
import authenticatedFetch from './apiClient';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system/legacy';

export async function signupUser(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Signup failed');
  }

  return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
}

export async function getCurrentUser() {
  return authenticatedFetch('/auth/me', { method: 'GET' });
}

export async function updateUserProfile(updates) {
  return authenticatedFetch('/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function uploadAvatar(localUri) {
  const token = await SecureStore.getItemAsync('authToken');

  const result = await FileSystem.uploadAsync(`${API_BASE_URL}/auth/avatar`, localUri, {
    httpMethod: 'POST',
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    fieldName: 'avatar',
    mimeType: 'image/jpeg',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = JSON.parse(result.body);

  if (result.status < 200 || result.status >= 300) {
    throw new Error(data.message || 'Failed to upload avatar');
  }

  return data;
}

export async function changePassword(currentPassword, newPassword) {
  return authenticatedFetch('/auth/change-password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function deleteAccount() {
  return authenticatedFetch('/auth/account', { method: 'DELETE' });
}