import api from "./api";
import type { MealRecipe, FoodLog } from "@/types/foodType.ts";

export const getMealRecipes = async (): Promise<MealRecipe[]> => {
  try {
    return (await api.get("/meal-recipes")).data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getMealRecipeById = async (id: string): Promise<MealRecipe | void> => {
  try {
    return (await api.get(`/meal-recipes/${id}`)).data;
  } catch (error) {
    console.error(error);
  }
};

export const createMealRecipe = async (data: { name: string; servingSize?: number; ingredients?: { foodId: string; weight_g: number }[] }): Promise<MealRecipe | void> => {
  try {
    return (await api.post("/meal-recipes", data)).data;
  } catch (error) {
    console.error(error);
  }
};

export const updateMealRecipe = async (id: string, data: { name?: string; servingSize?: number }): Promise<MealRecipe | void> => {
  try {
    return (await api.patch(`/meal-recipes/${id}`, data)).data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteMealRecipe = async (id: string): Promise<void> => {
  try {
    await api.delete(`/meal-recipes/${id}`);
  } catch (error) {
    console.error(error);
  }
};

export const addIngredient = async (recipeId: string, data: { foodId: string; weight_g: number }): Promise<void> => {
  try {
    await api.post(`/meal-recipes/${recipeId}/ingredients`, data);
  } catch (error) {
    console.error(error);
  }
};

export const updateIngredient = async (recipeId: string, ingredientId: string, data: { weight_g: number }): Promise<void> => {
  try {
    await api.patch(`/meal-recipes/${recipeId}/ingredients/${ingredientId}`, data);
  } catch (error) {
    console.error(error);
  }
};

export const deleteIngredient = async (recipeId: string, ingredientId: string): Promise<void> => {
  try {
    await api.delete(`/meal-recipes/${recipeId}/ingredients/${ingredientId}`);
  } catch (error) {
    console.error(error);
  }
};

export const logMealRecipe = async (recipeId: string, data: { mealLogId: string; scaleFactor?: number; date?: string }): Promise<FoodLog[] | void> => {
  try {
    return (await api.post(`/meal-recipes/${recipeId}/log`, data)).data;
  } catch (error) {
    console.error(error);
  }
};
