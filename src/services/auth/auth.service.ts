import api from "@/services/api.ts";
import type { LoginRequest, RegisterRequest } from "@/types/authType.ts";

class AuthService {
  async isAuthenticated(): Promise<string> {
    try {
      return (await api.get("/users/isAuthenticated")).data;
    } catch (error) {
      console.error(error);
      return "";
    }
  }

  async register(data: RegisterRequest): Promise<string | void> {
    try {
      return (await api.post("/users/register", data)).data;
    } catch (error) {
      console.error(error);
    }
  }

  async login(data: LoginRequest): Promise<string | void> {
    try {
      return (await api.post("/users/login", data)).data;
    } catch (error) {
      console.error(error);
    }
  }

  async getUserAge(): Promise<number | void> {
    try {
      return (await api.get("/users/getUserAge")).data;
    } catch (error) {
      console.error(error);
    }
  }
}

export default new AuthService();
