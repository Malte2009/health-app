import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    token: "",
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    getToken: (state) => state.token,
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    clearAuth() {
      this.token = "";
    },
  },
});
