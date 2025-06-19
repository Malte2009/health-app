import api from "./api";

export const register = async (data: {
  email: string;
  name: string;
  password: string;
  birthYear: number;
}): Promise<string> => {
  return api.post("/users/register", data);
};

export const login = async (email: string, password: string): Promise<string> => {
  return api.post("/users/login", { email, password });
};
