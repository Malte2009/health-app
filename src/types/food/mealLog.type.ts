import type { FoodLog } from "@/types/food/foodLog.type.ts";

export type MealType = "SUPPLEMENTS" | "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "OTHER";

export type MealLog = {
  id: string;
  userId: string;
  healthDayId: string | null;
  createdAt: string;
  changedAt: string | null;
  type: MealType;
  order: number;
  foodLogs?: FoodLog[];
};

export type CreateMealLogRequest = Omit<MealLog, "id" | "userId" | "createdAt" | "changedAt" | "foodLogs">;
export type UpdateMealLogRequest = Partial<CreateMealLogRequest>;
