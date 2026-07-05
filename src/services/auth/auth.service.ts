import api from "@/services/api.ts";
import axios from "axios";
import type { LoginRequest, RegisterRequest } from "@/types/authType.ts";

class AuthService {
  async isAuthenticated(): Promise<string> {
    try {
      return (await api.get("/users/isAuthenticated")).data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) return "";
      throw error;
    }
  }

  async register(data: RegisterRequest): Promise<string> {
    return (await api.post("/users/register", data)).data;
  }

  async login(data: LoginRequest): Promise<string> {
    try {
      return (await api.post("/users/login", data)).data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) return "";
      throw error;
    }
  }

  async getUserAge(): Promise<number> {
    return (await api.get("/users/getUserAge")).data;
  }
}

export default new AuthService();
