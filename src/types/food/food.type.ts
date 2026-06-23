import type { FoodLog } from "@/types/food/foodLog.type.ts";
import type { MealIngredient } from "@/types/food/meal.type.ts";
import type { NutrientFacts } from "@/types/food/nutrientFacts.type.ts";

export type PortionUnit = "G" | "ML" | "PORTION";

export type Food = {
  id: string;
  userId: string;
  createdAt: string;
  changedAt: string | null;
  name: string;
  calories_per_100g: number | null;
  carbs_g: number | null;
  protein_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  sugar_g: number | null;
  saturated_fat_g: number | null;
  unsaturated_fat_g: number | null;
  salt_g: number | null;
  defaultAmount: number | null;
  defaultUnit: PortionUnit | null;
  density_g_per_ml: number | null;
  g_per_portion: number | null;
  foodLogs?: FoodLog[];
  nutrients?: NutrientFacts | null;
  mealIngredients?: MealIngredient[];
};

export type CreateFoodRequest = Omit<Food, "id" | "userId" | "createdAt" | "changedAt" | "foodLogs" | "nutrients" | "mealIngredients">;
export type UpdateFoodRequest = Partial<CreateFoodRequest>;
