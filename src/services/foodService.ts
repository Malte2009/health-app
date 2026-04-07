import api from "./api";
import type { Food, CreateFoodRequest, Nutrient } from "@/types/foodType.ts";

function normalizeFood(item: unknown): Food {
  const src = (item ?? {}) as Record<string, unknown>;
  const nutrients = (src.nutrients ?? src.nutrientFacts ?? src.nutrient_facts ?? undefined) as Record<string, unknown> | undefined;

  return {
    id: String(src.id ?? ""),
    userId: typeof src.userId === "string" ? src.userId : typeof src.user_id === "string" ? src.user_id : undefined,
    name: String(src.name ?? ""),
    calories_per_100g: Number(src.calories_per_100g ?? src.caloriesPer100g ?? 0),
    protein_g: Number(src.protein_g ?? src.proteinG ?? 0),
    carbs_g: Number(src.carbs_g ?? src.carbsG ?? 0),
    fat_g: Number(src.fat_g ?? src.fatG ?? 0),
    fiber_g: Number(src.fiber_g ?? src.fiberG ?? 0),
    sugar_g: src.sugar_g != null ? Number(src.sugar_g) : src.sugarG != null ? Number(src.sugarG) : undefined,
    saturated_fat_g: src.saturated_fat_g != null ? Number(src.saturated_fat_g) : src.saturatedFatG != null ? Number(src.saturatedFatG) : undefined,
    unsaturated_fat_g: src.unsaturated_fat_g != null ? Number(src.unsaturated_fat_g) : src.unsaturatedFatG != null ? Number(src.unsaturatedFatG) : undefined,
    salt_g: src.salt_g != null ? Number(src.salt_g) : src.saltG != null ? Number(src.saltG) : undefined,
    defaultAmount: src.defaultAmount != null ? Number(src.defaultAmount) : src.default_amount != null ? Number(src.default_amount) : undefined,
    defaultUnit: typeof src.defaultUnit === "string"
      ? src.defaultUnit as Food["defaultUnit"]
      : typeof src.default_unit === "string"
        ? src.default_unit as Food["defaultUnit"]
        : undefined,
    density_g_per_ml: src.density_g_per_ml != null
      ? Number(src.density_g_per_ml)
      : src.densityGPerMl != null
        ? Number(src.densityGPerMl)
        : undefined,
    g_per_portion: src.g_per_portion != null
      ? Number(src.g_per_portion)
      : src.gPerPortion != null
        ? Number(src.gPerPortion)
        : undefined,
    nutrients: nutrients ? (nutrients as Partial<Nutrient>) : undefined,
  };
}

function normalizeFoodsResponse(payload: unknown): Food[] {
  if (Array.isArray(payload)) return payload.map((item) => normalizeFood(item));
  if (!payload || typeof payload !== "object") return [];

  const wrapped = payload as { data?: unknown; foods?: unknown; items?: unknown };
  if (Array.isArray(wrapped.data)) return wrapped.data.map((item) => normalizeFood(item));
  if (Array.isArray(wrapped.foods)) return wrapped.foods.map((item) => normalizeFood(item));
  if (Array.isArray(wrapped.items)) return wrapped.items.map((item) => normalizeFood(item));
  return [];
}

function normalizeNutrientResponse(payload: unknown): Nutrient | void {
  if (!payload || typeof payload !== "object") return;

  const src = payload as Record<string, unknown>;
  const wrapped = (src.data && typeof src.data === "object" ? src.data : src) as Record<string, unknown>;
  const facts = (wrapped.nutrientFacts && typeof wrapped.nutrientFacts === "object"
    ? wrapped.nutrientFacts
    : wrapped.nutrients && typeof wrapped.nutrients === "object"
      ? wrapped.nutrients
      : wrapped) as Record<string, unknown>;

  return {
    ...(facts as Partial<Nutrient>),
    id: typeof facts.id === "string" ? facts.id : undefined,
    foodId: typeof facts.foodId === "string"
      ? facts.foodId
      : typeof facts.food_id === "string"
        ? facts.food_id
        : undefined,
  };
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
    return normalizeFood((await api.get(`/foods/${id}`)).data);
  } catch (error) {
    console.error(error);
  }
};

export const createFood = async (food: CreateFoodRequest): Promise<Food | void> => {
  try {
    return normalizeFood((await api.post("/foods", food)).data);
  } catch (error) {
    console.error(error);
  }
};

export const updateFood = async (id: string, food: Partial<CreateFoodRequest>): Promise<Food | void> => {
  try {
    return normalizeFood((await api.patch(`/foods/${id}`, food)).data);
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

export const getFoodNutrients = async (foodId: string): Promise<Nutrient | void> => {
  try {
    return normalizeNutrientResponse((await api.get(`/foods/${foodId}/nutrients`)).data);
  } catch (error) {
    console.error(error);
  }
};

export const createFoodNutrients = async (foodId: string, nutrients: Partial<Nutrient>): Promise<Nutrient | void> => {
  try {
    return normalizeNutrientResponse((await api.post(`/foods/${foodId}/nutrients`, nutrients)).data);
  } catch (error) {
    console.error(error);
  }
};

export const updateFoodNutrients = async (foodId: string, nutrients: Partial<Nutrient>): Promise<Nutrient | void> => {
  try {
    return normalizeNutrientResponse((await api.patch(`/foods/${foodId}/nutrients`, nutrients)).data);
  } catch (error) {
    console.error(error);
  }
};

export const deleteFoodNutrients = async (foodId: string): Promise<void> => {
  try {
    await api.delete(`/foods/${foodId}/nutrients`);
  } catch (error) {
    console.error(error);
  }
};

