import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    token: "",
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    clearAuth() {
      this.token = "";
    },
  },
});
