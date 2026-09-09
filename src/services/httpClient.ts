import axios from 'axios';

const URL_API = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: URL_API,
});

apiClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
