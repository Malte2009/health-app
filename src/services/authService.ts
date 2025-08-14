import api from "./api";

export const isAuthenticated = async (): Promise<string> => {
  try {
    const response = await api.get("/users/isAuthenticated");
    if (response.status === 200) {
      return response.data;
    } else {
      return "";
    }
  } catch (error) {
    return "";
  }
};

export const register = async (data: { email: string; name: string; password: string; birthYear: string; gender: string }): Promise<string> => {
  return api.post("/users/register", data);
};

export const login = async (email: string, password: string): Promise<string> => {
  return (await api.post("/users/login", { email, password })).data;
};

export const getUserAge = async (): Promise<number | void> => {
  try {
    return (await api.get("/users/getUserAge")).data;
  } catch (error) {
    return console.error(error);
  }
};
