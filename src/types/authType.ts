export type RegisterRequest = {
  email: string;
  name: string;
  password: string;
  birthYear: number;
  gender: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};
