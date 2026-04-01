import { defineStore } from "pinia";
import type { DailyDashboard, Food } from "@/types/foodType.ts";
import { getDailyDashboard } from "@/services/foodDashboardService.ts";

export const useFoodStore = defineStore("foodStore", {
  state: () => ({
    dailyDashboard: null as DailyDashboard | null,
    selectedDate: new Date().toISOString().split("T")[0],
    searchResults: [] as Food[],
  }),
  getters: {
    getDailyDashboard: (state) => state.dailyDashboard,
    getSelectedDate: (state) => state.selectedDate,
  },
  actions: {
    async loadDailyDashboard(date?: string) {
      const d = date ?? this.selectedDate;
      const data = await getDailyDashboard(d);
      if (data) {
        this.dailyDashboard = data;
      }
    },
    setSelectedDate(date: string) {
      this.selectedDate = date;
    },
    setSearchResults(foods: Food[]) {
      this.searchResults = foods;
    },
    clearDashboard() {
      this.dailyDashboard = null;
    },
  },
});
