import api from "./api";

export const isAuthenticated = async (): Promise<string> => {
  try {
    const response = await api.get("/users/isAuthenticated");

    return response.data;
  } catch (error) {
    return "";
  }
};

export const register = async (data: { email: string; name: string; password: string; birthYear: number; gender: string }): Promise<string | void> => {
  try {
    return (await api.post("/users/register", data)).data;
  } catch (error) {
    return;
  }
};

export const login = async (email: string, password: string): Promise<string | void> => {
  try {
    return (await api.post("/users/login", { email, password })).data;
  } catch (error) {
    return;
  }
};

export const getUserAge = async (): Promise<number | void> => {
  try {
    return (await api.get("/users/getUserAge")).data;
  } catch (error) {
    return;
  }
};
