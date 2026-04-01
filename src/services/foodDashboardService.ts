import api from "./api";
import type { DailyDashboard } from "@/types/foodType.ts";

export const getDailyDashboard = async (date?: string): Promise<DailyDashboard | void> => {
  try {
    const query = date ? `?date=${date}` : "";
    return (await api.get(`/dashboard/daily${query}`)).data;
  } catch (error) {
    console.error(error);
  }
};

export const getWeeklyDashboard = async (startDate?: string): Promise<DailyDashboard[] | void> => {
  try {
    const query = startDate ? `?startDate=${startDate}` : "";
    return (await api.get(`/dashboard/weekly${query}`)).data;
  } catch (error) {
    console.error(error);
  }
};

export const getMonthlyDashboard = async (month: string): Promise<DailyDashboard[] | void> => {
  try {
    return (await api.get(`/dashboard/monthly?month=${month}`)).data;
  } catch (error) {
    console.error(error);
  }
};
