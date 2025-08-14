import api from "./api";

import { useAuthStore } from "@/stores/auth.ts";
import { setCookie } from "@/utility/cookie.ts";

export const isAuthenticated = async (): Promise<string | void> => {
  try {
    const response = await api.get("/users/isAuthenticated");
    if (response.status === 200) {
      return response.data;
    } else {
      return "";
    }
  } catch (error) {
    console.log(error);
  }
};

export const register = async (data: {
  email: string;
  name: string;
  password: string;
  birthYear: string;
  gender: string;
}): Promise<string | void> => {
  try {
    return api.post("/users/register", data);
  } catch (error) {
    console.log(error);
  }
};

export const login = async (email: string, password: string): Promise<string | void> => {
  const authStore = useAuthStore();
  try {
    const token = (await api.post("/users/login", { email, password })).data;
    authStore.setToken(token);
    setCookie("token", token, 1);
    return token;
  } catch (error) {
    console.log(error);
  }
};
