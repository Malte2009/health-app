import type { Food } from "@/types/food/food.type.ts";
import type { MealLog } from "@/types/food/mealLog.type.ts";
import type { SymptomLog } from "@/types/symptoms/symptomType.ts";

export type FoodLog = {
  id: string;
  userId: string;
  foodId: string;
  mealLogId: string;
  createdAt: string;
  changedAt: string | null;
  date: string;
  weight_g: number | null;
  food?: Food;
  mealLog?: MealLog;
  symptomLogs?: SymptomLog[];
};

export type CreateFoodLogRequest = Omit<FoodLog, "id" | "userId" | "createdAt" | "changedAt" | "food" | "mealLog" | "symptomLogs">;
export type UpdateFoodLogRequest = Partial<CreateFoodLogRequest>;
