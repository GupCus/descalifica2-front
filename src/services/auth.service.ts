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
    birthDate,
  }: {
    email: string;
    password: string;
    username: string;
    birthDate: string;
  }) {
    try {
      const response = await apiClient.post<RegisterResponse>(
        "/auth/register",
        {
          mail: email,
          password: password,
          username: username,
          birthDate: birthDate,
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
        "/auth/verify",
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
      localStorage.setItem("authToken", token); // persiste en el navegador
    } else {
      sessionStorage.setItem("authToken", token); // se borra al cerrar la pestaña
    }
  },

  logout(): void {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  },

  getToken(): string | null {
    return (
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    );
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
    } catch {
      this.logout();
      return null;
    }
  },

  async isAdmin(): Promise<Boolean> {
    const user = await this.getCurrentUser();
    return user?.user_type === "admin";
  },

  async isUser(): Promise<Boolean> {
    const user = await this.getCurrentUser();
    return user?.user_type === "user";
  },
};
