import { apiClient } from "./httpClient.ts";

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
  };
}

export interface RegisterResponse {
  message?: string;
  user: {
    id: string;
    username: string;
    user_type: string;
  };
}

export const AuthService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      return response.data;
    } catch (error) {
      console.error("Error al loguearse: ", error);
      throw error;
    }
  },

  async RegisterUser({
    email,
    password,
    username,
    date_of_birth,
    name,
  }: {
    email: string;
    password: string;
    username: string;
    date_of_birth: string;
    name: string;
  }) {
    try {
      const response = await apiClient.post<RegisterResponse>(
        "/auth/register",
        {
          email: email,
          password: password,
          username: username,
          date_of_birth: date_of_birth,
          name: name,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al registrarse: ", error);
      throw error;
    }
  },

  async verifyToken(token: string): Promise<VerifyTokenResponse> {
    try {
      const response = await apiClient.get<VerifyTokenResponse>(
        "/auth/check-token",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al verificar token: ", error);
      throw error;
    }
  },

  saveToken(token: string, rememberme: boolean = false): void {
    if (rememberme) {
      localStorage.setItem("token", token); // persiste en el navegador
    } else {
      sessionStorage.setItem("token", token); // se borra al cerrar la pestaña
    }
  },

  logout(): void {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.href = "/";
  },

  getToken(): string | null {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  },

  async isAuthenticated(): Promise<Boolean> {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      await this.verifyToken(token);
      return true;
    } catch {
      //en caso de que el token sea inválido/esté vencido lo deslogueamos
      this.logout();
      return false;
    }
  },

  async getCurrentUser(): Promise<VerifyTokenResponse["user"] | null> {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const response = await this.verifyToken(token);
      return response.user;
    } catch (error) {
      this.logout();
      return null;
    }
  },

  async isAdmin(): Promise<Boolean> {
    const user = await this.getCurrentUser();
    const isAdminUser = user?.user_type === "admin";
    return isAdminUser;
  },

  async isUser(): Promise<Boolean> {
    const user = await this.getCurrentUser();
    return user?.user_type === "user";
  },
};
