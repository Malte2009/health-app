import api from "./api";
import type { Food, CreateFoodRequest } from "@/types/foodType.ts";

function normalizeFoodsResponse(payload: unknown): Food[] {
  if (Array.isArray(payload)) return payload as Food[];
  if (!payload || typeof payload !== "object") return [];

  const wrapped = payload as { data?: unknown; foods?: unknown; items?: unknown };
  if (Array.isArray(wrapped.data)) return wrapped.data as Food[];
  if (Array.isArray(wrapped.foods)) return wrapped.foods as Food[];
  if (Array.isArray(wrapped.items)) return wrapped.items as Food[];
  return [];
}

export const getFoods = async (): Promise<Food[]> => {
  try {
    return normalizeFoodsResponse((await api.get("/foods")).data);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const searchFoods = async (query: string): Promise<Food[]> => {
  try {
    return normalizeFoodsResponse((await api.get(`/foods/search?q=${encodeURIComponent(query)}`)).data);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getMyFoods = async (): Promise<Food[]> => {
  try {
    return normalizeFoodsResponse((await api.get("/foods/my-foods")).data);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getFoodById = async (id: string): Promise<Food | void> => {
  try {
    return (await api.get(`/foods/${id}`)).data;
  } catch (error) {
    console.error(error);
  }
};

export const createFood = async (food: CreateFoodRequest): Promise<Food | void> => {
  try {
    return (await api.post("/foods", food)).data;
  } catch (error) {
    console.error(error);
  }
};

export const updateFood = async (id: string, food: Partial<CreateFoodRequest>): Promise<Food | void> => {
  try {
    return (await api.patch(`/foods/${id}`, food)).data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteFood = async (id: string): Promise<void> => {
  try {
    await api.delete(`/foods/${id}`);
  } catch (error) {
    console.error(error);
  }
};
