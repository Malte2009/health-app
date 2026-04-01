import api from "./api";
import type { Food, CreateFoodRequest } from "@/types/foodType.ts";

export const getFoods = async (): Promise<Food[]> => {
  try {
    return (await api.get("/foods")).data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const searchFoods = async (query: string): Promise<Food[]> => {
  try {
    return (await api.get(`/foods/search?q=${encodeURIComponent(query)}`)).data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getMyFoods = async (): Promise<Food[]> => {
  try {
    return (await api.get("/foods/my-foods")).data;
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
