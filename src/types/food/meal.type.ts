import type { Food } from "@/types/food/food.type.ts";

export type Meal = {
  id: string;
  userId: string;
  createdAt: string;
  changedAt: string | null;
  name: string;
  servingSize: number | null;
  ingredients?: MealIngredient[];
};

export type MealIngredient = {
  id: string;
  mealId: string;
  foodId: string;
  weight_g: number;
  meal?: Meal;
  food?: Food;
};

export type CreateMealRequest = Omit<Meal, "id" | "userId" | "createdAt" | "changedAt" | "ingredients">;
export type UpdateMealRequest = Partial<CreateMealRequest>;
export type CreateMealIngredientRequest = Omit<MealIngredient, "id" | "meal" | "food">;
export type UpdateMealIngredientRequest = Partial<CreateMealIngredientRequest>;
