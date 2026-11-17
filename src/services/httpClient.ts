import axios from 'axios';
import { API_URL } from '@/config/env.ts';
import { AuthService } from './auth.service.ts';

export const apiClient = axios.create({
  baseURL: API_URL,
});

const PUBLIC_AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/login/google',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

let isHandlingSessionExpiry = false;

apiClient.interceptors.request.use((config) => {
  const token = AuthService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const requestUrl: string = error.config?.url || '';

    const isPublicAuthRequest = PUBLIC_AUTH_ENDPOINTS.some((endpoint) =>
      requestUrl.includes(endpoint),
    );

    const isTokenExpired403 =
      status === 403 &&
      (data?.code === 'TOKEN_EXPIRED' ||
        data?.error === 'TOKEN_EXPIRED' ||
        (typeof data?.message === 'string' &&
          /token|expir|vencid|sesi[oó]n/i.test(data.message)) ||
        (typeof data?.error === 'string' &&
          /token|expir|vencid|sesi[oó]n/i.test(data.error)));

    const isUnauthorized = status === 401 || isTokenExpired403;

    const hadToken = Boolean(
      localStorage.getItem('token') ||
        sessionStorage.getItem('token') ||
        error.config?.headers?.Authorization,
    );

    if (
      isUnauthorized &&
      !isPublicAuthRequest &&
      hadToken &&
      !isHandlingSessionExpiry
    ) {
      isHandlingSessionExpiry = true;

      AuthService.clearSession();
      sessionStorage.setItem('session_expired', '1');
      window.dispatchEvent(new Event('sessionExpired'));

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }

      setTimeout(() => {
        isHandlingSessionExpiry = false;
      }, 2000);
    }

    return Promise.reject(error);
  },
);
