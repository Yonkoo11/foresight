import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/api';

// Auth failure callback — AuthProvider registers its logout here
let onAuthFailure: (() => void) | null = null;
export function setOnAuthFailure(cb: () => void) {
  onAuthFailure = cb;
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach Bearer token
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mutex for token refresh - prevents concurrent refresh attempts
let isRefreshing = false;
let refreshSubscribers: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((sub) => sub.resolve(token));
  refreshSubscribers = [];
}

function onRefreshFailed(err: any) {
  refreshSubscribers.forEach((sub) => sub.reject(err));
  refreshSubscribers = [];
}

function addRefreshSubscriber(resolve: (token: string) => void, reject: (err: any) => void) {
  refreshSubscribers.push({ resolve, reject });
}

// Response interceptor: auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Clear auth on 403 (banned/suspended) - don't attempt refresh
    if (status === 403 && !originalRequest._retry) {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      onAuthFailure?.();
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Another request is already refreshing - wait for it
        return new Promise((resolve, reject) => {
          addRefreshSubscriber(
            (newToken: string) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(originalRequest));
            },
            (err: any) => {
              reject(err);
            },
          );
        });
      }

      isRefreshing = true;
      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_URL}/api/auth/mobile-refresh`, { refreshToken }, { timeout: 10000 });

        const newAccessToken = data?.data?.accessToken;
        if (!newAccessToken) throw new Error('Invalid refresh response');
        await SecureStore.setItemAsync('accessToken', newAccessToken);
        if (data.data.refreshToken) {
          await SecureStore.setItemAsync('refreshToken', data.data.refreshToken);
        }

        isRefreshing = false;
        onTokenRefreshed(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshFailed(refreshError);
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        onAuthFailure?.();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
