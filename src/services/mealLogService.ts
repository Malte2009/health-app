import api from "./api";
import type { MealLog, FoodLog, CreateMealLogRequest, CreateFoodLogRequest } from "@/types/foodType.ts";

function normalizeFoodLog(log: unknown): FoodLog {
  const src = (log ?? {}) as Record<string, unknown>;
  return {
    id: String(src.id ?? ""),
    mealLogId: String(src.mealLogId ?? src.meal_log_id ?? ""),
    foodId: String(src.foodId ?? src.food_id ?? ""),
    weight_g: Number(src.weight_g ?? src.weightG ?? 0),
    amount: src.amount != null ? Number(src.amount) : undefined,
    unit: (src.unit ?? src.portionUnit ?? src.portion_unit ?? undefined) as FoodLog["unit"],
    date: String(src.date ?? ""),
    food: (src.food ?? src.food_item ?? undefined) as FoodLog["food"],
  };
}

function normalizeMealLog(log: unknown): MealLog {
  const src = (log ?? {}) as Record<string, unknown>;
  const rawFoodLogs = src.foodLogs ?? src.food_logs ?? src.foods;
  const foodLogs = Array.isArray(rawFoodLogs) ? rawFoodLogs.map((item) => normalizeFoodLog(item)) : [];

  return {
    id: String(src.id ?? ""),
    userId: src.userId ? String(src.userId) : src.user_id ? String(src.user_id) : undefined,
    type: String(src.type ?? "OTHER") as MealLog["type"],
    date: src.date ? String(src.date) : undefined,
    order: src.order ? Number(src.order) : 0,
    foodLogs,
  };
}

function normalizeMealLogsResponse(payload: unknown): MealLog[] {
  if (Array.isArray(payload)) return payload.map((item) => normalizeMealLog(item));
  if (!payload || typeof payload !== "object") return [];

  const wrapped = payload as { data?: unknown; mealLogs?: unknown; items?: unknown };
  if (Array.isArray(wrapped.data)) return wrapped.data.map((item) => normalizeMealLog(item));
  if (Array.isArray(wrapped.mealLogs)) return wrapped.mealLogs.map((item) => normalizeMealLog(item));
  if (Array.isArray(wrapped.items)) return wrapped.items.map((item) => normalizeMealLog(item));
  return [];
}

export const getMealLogs = async (date?: string, startDate?: string, endDate?: string): Promise<MealLog[]> => {
  try {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    const query = params.toString() ? `?${params.toString()}` : "";
    return normalizeMealLogsResponse((await api.get(`/meal-logs${query}`)).data);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getMealLogById = async (id: string): Promise<MealLog | void> => {
  try {
    return normalizeMealLog((await api.get(`/meal-logs/${id}`)).data);
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
    const payload = (await api.get(`/meal-logs/${mealLogId}/food-logs`)).data;
    if (!Array.isArray(payload)) return [];
    return payload.map((item) => normalizeFoodLog(item));
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

export const updateFoodLog = async (mealLogId: string, id: string, data: { weight_g?: number; amount?: number; unit?: FoodLog["unit"]; date?: string }): Promise<FoodLog | void> => {
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
