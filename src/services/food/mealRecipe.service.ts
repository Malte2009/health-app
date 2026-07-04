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
    try {
      return (await api.get("/meal-recipes")).data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getMealRecipeById(id: string): Promise<MealRecipe | void> {
    try {
      return (await api.get(`/meal-recipes/${id}`)).data;
    } catch (error) {
      console.error(error);
    }
  }

  async createMealRecipe(data: CreateMealRecipeRequest): Promise<MealRecipe | void> {
    try {
      return (await api.post("/meal-recipes", data)).data;
    } catch (error) {
      console.error(error);
    }
  }

  async updateMealRecipe(id: string, data: UpdateMealRecipeRequest): Promise<MealRecipe | void> {
    try {
      return (await api.patch(`/meal-recipes/${id}`, data)).data;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteMealRecipe(id: string): Promise<void> {
    try {
      await api.delete(`/meal-recipes/${id}`);
    } catch (error) {
      console.error(error);
    }
  }

  async addIngredient(recipeId: string, data: AddIngredientRequest): Promise<void> {
    try {
      await api.post(`/meal-recipes/${recipeId}/ingredients`, data);
    } catch (error) {
      console.error(error);
    }
  }

  async updateIngredient(recipeId: string, ingredientId: string, data: UpdateIngredientRequest): Promise<void> {
    try {
      await api.patch(`/meal-recipes/${recipeId}/ingredients/${ingredientId}`, data);
    } catch (error) {
      console.error(error);
    }
  }

  async deleteIngredient(recipeId: string, ingredientId: string): Promise<void> {
    try {
      await api.delete(`/meal-recipes/${recipeId}/ingredients/${ingredientId}`);
    } catch (error) {
      console.error(error);
    }
  }

  async logMealRecipe(recipeId: string, data: LogMealRecipeRequest): Promise<FoodLog[] | void> {
    try {
      return (await api.post(`/meal-recipes/${recipeId}/log`, data)).data;
    } catch (error) {
      console.error(error);
    }
  }
}

export default new MealRecipeService();
