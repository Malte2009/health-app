import { defineStore } from "pinia";
import AuthService from "@/services/auth/auth.service.ts";

type AuthState = {
  authenticated: boolean | null;
  loadingPromise: Promise<boolean> | null;
};

export const useAuthStore = defineStore("authStore", {
  state: (): AuthState => ({
    authenticated: null,
    loadingPromise: null,
  }),
  getters: {
    isAuthenticated: (state) => state.authenticated === true,
  },
  actions: {
    async checkAuthenticated(force = false): Promise<boolean> {
      if (!force && this.authenticated !== null) return this.authenticated;
      if (!force && this.loadingPromise) return this.loadingPromise;

      this.loadingPromise = AuthService.isAuthenticated()
        .then((token) => {
          this.authenticated = Boolean(token);
          return this.authenticated;
        })
        .finally(() => {
          this.loadingPromise = null;
        });

      return this.loadingPromise;
    },
    markAuthenticated() {
      this.authenticated = true;
      this.loadingPromise = null;
    },
    clearAuthenticated() {
      this.authenticated = false;
      this.loadingPromise = null;
    },
  },
});
