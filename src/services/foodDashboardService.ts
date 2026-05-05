import api from "./api";
import type { DailyDashboard, MealLog, FoodLog, MealType, NutritionOverTimeResponse, NutritionOverTimeDay } from "@/types/foodType.ts";

type Obj = Record<string, unknown>;

function normalizeFoodLog(log: unknown): FoodLog {
  const src = (log ?? {}) as Obj;
  const food = (src.food ?? src.food_item ?? undefined) as FoodLog["food"];
  return {
    id: String(src.id ?? ""),
    mealLogId: String(src.mealLogId ?? src.meal_log_id ?? ""),
    foodId: String(src.foodId ?? src.food_id ?? ""),
    weight_g: Number(src.weight_g ?? src.weightG ?? 0),
    amount: src.amount != null ? Number(src.amount) : undefined,
    unit: typeof src.unit === "string"
      ? src.unit as FoodLog["unit"]
      : typeof src.portionUnit === "string"
        ? src.portionUnit as FoodLog["unit"]
        : typeof src.portion_unit === "string"
          ? src.portion_unit as FoodLog["unit"]
          : undefined,
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
    order: src.order ? Number(src.order) : 0,
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
    sugar_g: null,
    saturated_fat_g: null,
    unsaturated_fat_g: null,
    salt_g: null,
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

function normalizeNutritionOverTimeResponse(payload: unknown): NutritionOverTimeResponse | void {
  if (!payload || typeof payload !== "object") return;
  const src = payload as Obj;
  const wrapped = (src.data && typeof src.data === "object" ? src.data : src) as Obj;
  const rawDays = wrapped.days;
  const days: NutritionOverTimeDay[] = Array.isArray(rawDays)
    ? rawDays.map((day) => {
        const d = (day ?? {}) as Obj;
        return {
          date: String(d.date ?? ""),
          totals: (d.totals ?? {}) as NutritionOverTimeDay["totals"],
          nutrientTotals: (d.nutrientTotals ?? d.nutrient_totals ?? {}) as NutritionOverTimeDay["nutrientTotals"],
        };
      })
    : [];

  return {
    startDate: String(wrapped.startDate ?? wrapped.start_date ?? ""),
    endDate: String(wrapped.endDate ?? wrapped.end_date ?? ""),
    days,
  };
}

export const getNutritionOverTime = async (startDate: string, endDate: string): Promise<NutritionOverTimeResponse | void> => {
  try {
    const params = new URLSearchParams({ startDate, endDate });
    return normalizeNutritionOverTimeResponse((await api.get(`/dashboard/nutrition-over-time?${params.toString()}`)).data);
  } catch (error) {
    console.error(error);
  }
};

export const getTopFoods = async (days: number = 7): Promise<import("@/types/foodType").TopFoodsResponse | void> => {
  try {
    return (await api.get(`/dashboard/top-foods?days=${days}`)).data;
  } catch (error) {
    console.error(error);
  }
};
