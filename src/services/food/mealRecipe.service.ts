import api from "@/services/api.ts";
import type {
  AddIngredientRequest,
  CreateMealRecipeRequest,
  FoodLog,
  LogMealRecipeRequest,
  MealRecipe,
  UpdateIngredientRequest,
  UpdateMealRecipeRequest,
} from "@/types/foodType.ts";

class MealRecipeService {
  async getMealRecipes(): Promise<MealRecipe[]> {
    return (await api.get("/meal-recipes")).data;
  }

  async getMealRecipeById(id: string): Promise<MealRecipe> {
    return (await api.get(`/meal-recipes/${id}`)).data;
  }

  async createMealRecipe(data: CreateMealRecipeRequest): Promise<MealRecipe> {
    return (await api.post("/meal-recipes", data)).data;
  }

  async updateMealRecipe(id: string, data: UpdateMealRecipeRequest): Promise<MealRecipe> {
    return (await api.patch(`/meal-recipes/${id}`, data)).data;
  }

  async deleteMealRecipe(id: string): Promise<void> {
    await api.delete(`/meal-recipes/${id}`);
  }

  async addIngredient(recipeId: string, data: AddIngredientRequest): Promise<void> {
    await api.post(`/meal-recipes/${recipeId}/ingredients`, data);
  }

  async updateIngredient(recipeId: string, ingredientId: string, data: UpdateIngredientRequest): Promise<void> {
    await api.patch(`/meal-recipes/${recipeId}/ingredients/${ingredientId}`, data);
  }

  async deleteIngredient(recipeId: string, ingredientId: string): Promise<void> {
    await api.delete(`/meal-recipes/${recipeId}/ingredients/${ingredientId}`);
  }

  async logMealRecipe(recipeId: string, data: LogMealRecipeRequest): Promise<FoodLog[]> {
    return (await api.post(`/meal-recipes/${recipeId}/log`, data)).data;
  }
}

export default new MealRecipeService();
