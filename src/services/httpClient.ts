import axios from 'axios';
import { API_URL } from '@/config/env.ts';
import { AuthService } from './auth.service.ts';

export const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = AuthService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
