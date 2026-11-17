import axios from 'axios';
import { apiClient } from './httpClient.ts';
import { isAdmin as checkIsAdmin, USER_ROLES } from '@/utils/role.util.ts';

export interface LoginRequest {
  mail: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    user_type: string;
  };
}

export interface VerifyTokenResponse {
  message: string;
  user: {
    id: number;
    email: string;
    username: string;
    user_type: string;
    avatar?: string;
  };
}

export interface RegisterResponse {
  message?: string;
  token?: string;
  user: {
    id: string;
    username: string;
    user_type: string;
  };
}

export type SessionCheckResult =
  | { status: 'authenticated'; user: VerifyTokenResponse['user'] }
  | { status: 'unauthenticated'; user: null }
  | { status: 'network_error'; user: null; message: string };

let inMemoryToken: string | null = null;

function isJwtExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    if (typeof payload?.exp === 'number') {
      return payload.exp * 1000 <= Date.now();
    }
    return false;
  } catch {
    return true;
  }
}

export function isAuthTokenError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    return status === 401 || status === 403;
  }
  const status = (error as { response?: { status?: number } })?.response?.status;
  return status === 401 || status === 403;
}

export const AuthService = {
  async logingoogle(accesstoken: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/auth/login/google', {
        token: accesstoken,
      });
      return response.data;
    } catch (error) {
      console.error('Error al loguearse');
      throw error;
    }
  },
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        '/auth/login',
        credentials,
      );
      return response.data;
    } catch (error) {
      console.error('Error al loguearse');
      throw error;
    }
  },

  async RegisterUser(data: FormData) {
    try {
      const response = await apiClient.post<RegisterResponse>(
        '/auth/register',
        data,
      );
      return response.data;
    } catch (error) {
      console.error('Error al registrarse');
      throw error;
    }
  },

  async verifyToken(token: string): Promise<VerifyTokenResponse> {
    try {
      const response = await apiClient.get<VerifyTokenResponse>(
        '/auth/check-token',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error al verificar token');
      throw error;
    }
  },

  saveToken(token: string, rememberme: boolean = false): void {
    inMemoryToken = token;
    if (rememberme) {
      localStorage.setItem('token', token);
      sessionStorage.removeItem('token');
    } else {
      sessionStorage.setItem('token', token);
      localStorage.removeItem('token');
    }
  },

  clearSession(): void {
    inMemoryToken = null;
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  },

  clearToken(): void {
    this.clearSession();
  },

  logout(): void {
    this.clearSession();
    window.location.href = '/';
  },

  getToken(): string | null {
    const token =
      inMemoryToken ||
      sessionStorage.getItem('token') ||
      localStorage.getItem('token');

    if (!token) {
      return null;
    }

    if (isJwtExpired(token)) {
      this.clearSession();
      return null;
    }

    inMemoryToken = token;
    return token;
  },

  async checkSession(): Promise<SessionCheckResult> {
    const token = this.getToken();
    if (!token) {
      return { status: 'unauthenticated', user: null };
    }

    try {
      const response = await this.verifyToken(token);
      return { status: 'authenticated', user: response.user };
    } catch (error) {
      if (isAuthTokenError(error)) {
        this.clearSession();
        return { status: 'unauthenticated', user: null };
      }
      return {
        status: 'network_error',
        user: null,
        message:
          'No se pudo conectar con el servidor para verificar tu sesión. Tu sesión sigue guardada y podés reintentar.',
      };
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const result = await this.checkSession();
    return result.status === 'authenticated';
  },

  async getCurrentUser(): Promise<VerifyTokenResponse['user'] | null> {
    const result = await this.checkSession();
    return result.user;
  },

  async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return checkIsAdmin(user);
  },

  async isUser(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.user_type?.trim().toLowerCase() === USER_ROLES.USER;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(
        '/auth/forgot-password',
        { email },
      );
      return response.data;
    } catch (error) {
      console.error('Error al solicitar recuperación de contraseña');
      throw error;
    }
  },

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(
        '/auth/reset-password',
        { token, newPassword },
      );
      return response.data;
    } catch (error) {
      console.error('Error al restablecer contraseña');
      throw error;
    }
  },
};
