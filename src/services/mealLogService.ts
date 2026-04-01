import api from "./api";
import type { MealLog, FoodLog, CreateMealLogRequest, CreateFoodLogRequest } from "@/types/foodType.ts";

export const getMealLogs = async (date?: string, startDate?: string, endDate?: string): Promise<MealLog[]> => {
  try {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    const query = params.toString() ? `?${params.toString()}` : "";
    return (await api.get(`/meal-logs${query}`)).data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getMealLogById = async (id: string): Promise<MealLog | void> => {
  try {
    return (await api.get(`/meal-logs/${id}`)).data;
  } catch (error) {
    console.error(error);
  }
};

export const createMealLog = async (data: CreateMealLogRequest): Promise<MealLog | void> => {
  try {
    return (await api.post("/meal-logs", data)).data;
  } catch (error) {
    console.error(error);
  }
};

export const updateMealLog = async (id: string, data: Partial<CreateMealLogRequest>): Promise<MealLog | void> => {
  try {
    return (await api.patch(`/meal-logs/${id}`, data)).data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteMealLog = async (id: string): Promise<void> => {
  try {
    await api.delete(`/meal-logs/${id}`);
  } catch (error) {
    console.error(error);
  }
};

export const getFoodLogs = async (mealLogId: string): Promise<FoodLog[]> => {
  try {
    return (await api.get(`/meal-logs/${mealLogId}/food-logs`)).data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createFoodLog = async (mealLogId: string, data: CreateFoodLogRequest): Promise<FoodLog | void> => {
  try {
    return (await api.post(`/meal-logs/${mealLogId}/food-logs`, data)).data;
  } catch (error) {
    console.error(error);
  }
};

export const updateFoodLog = async (mealLogId: string, id: string, data: { weight_g?: number; date?: string }): Promise<FoodLog | void> => {
  try {
    return (await api.patch(`/meal-logs/${mealLogId}/food-logs/${id}`, data)).data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteFoodLog = async (mealLogId: string, id: string): Promise<void> => {
  try {
    await api.delete(`/meal-logs/${mealLogId}/food-logs/${id}`);
  } catch (error) {
    console.error(error);
  }
};
