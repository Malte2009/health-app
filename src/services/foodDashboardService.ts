import api from "./api";
import type { DailyDashboard, MealLog, FoodLog, MealType } from "@/types/foodType.ts";

type Obj = Record<string, unknown>;

function normalizeFoodLog(log: unknown): FoodLog {
  const src = (log ?? {}) as Obj;
  const food = (src.food ?? src.food_item ?? undefined) as FoodLog["food"];
  return {
    id: String(src.id ?? ""),
    mealLogId: String(src.mealLogId ?? src.meal_log_id ?? ""),
    foodId: String(src.foodId ?? src.food_id ?? ""),
    weight_g: Number(src.weight_g ?? src.weightG ?? 0),
    date: String(src.date ?? ""),
    food,
  };
}

function normalizeMealLog(log: unknown): MealLog {
  const src = (log ?? {}) as Obj;
  const rawFoodLogs = src.foodLogs ?? src.food_logs ?? src.foods;
  return {
    id: String(src.id ?? ""),
    userId: src.userId ? String(src.userId) : src.user_id ? String(src.user_id) : undefined,
    type: String(src.type ?? "OTHER") as MealType,
    date: src.date ? String(src.date) : undefined,
    foodLogs: Array.isArray(rawFoodLogs) ? rawFoodLogs.map((item) => normalizeFoodLog(item)) : [],
  };
}

function normalizeDailyDashboardResponse(payload: unknown): DailyDashboard | void {
  if (!payload || typeof payload !== "object") return;

  const src = payload as Obj;
  const wrapped = (src.data && typeof src.data === "object" ? src.data : src) as Obj;
  const rawMeals = wrapped.meals ?? wrapped.meal_logs;
  const defaultGoals: DailyDashboard["goals"] = {
    calories: null,
    protein_g: null,
    carbs_g: null,
    fat_g: null,
    fiber_g: null,
  };

  return {
    date: String(wrapped.date ?? ""),
    totals: (wrapped.totals ?? {}) as DailyDashboard["totals"],
    nutrientTotals: (wrapped.nutrientTotals ?? wrapped.nutrient_totals ?? {}) as DailyDashboard["nutrientTotals"],
    meals: Array.isArray(rawMeals) ? rawMeals.map((item) => normalizeMealLog(item)) : [],
    goals: (wrapped.goals ?? defaultGoals) as DailyDashboard["goals"],
  };
}

export const getDailyDashboard = async (date?: string): Promise<DailyDashboard | void> => {
  try {
    const query = date ? `?date=${date}` : "";
    return normalizeDailyDashboardResponse((await api.get(`/dashboard/daily${query}`)).data);
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
