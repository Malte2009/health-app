export interface Nutrient {
  id?: string;
  foodId?: string;
  vitamin_a?: number;
  vitamin_d?: number;
  vitamin_e?: number;
  vitamin_k?: number;
  vitamin_c?: number;
  vitamin_b1?: number;
  vitamin_b2?: number;
  vitamin_b3?: number;
  vitamin_b5?: number;
  vitamin_b6?: number;
  vitamin_b7?: number;
  vitamin_b9?: number;
  vitamin_b12?: number;
  choline?: number;
  calcium?: number;
  phosphorus?: number;
  magnesium?: number;
  sodium?: number;
  potassium?: number;
  chloride?: number;
  sulfur?: number;
  iron?: number;
  zinc?: number;
  selenium?: number;
  iodine?: number;
  copper?: number;
  manganese?: number;
  chromium?: number;
  molybdenum?: number;
  fluoride?: number;
  omega_3?: number;
  omega_6?: number;
  omega_9?: number;
  caffeine?: number;
}

export type PortionUnit = "G" | "ML" | "PORTION";

export interface Food {
  id: string;
  userId?: string;
  name: string;
  calories_per_100g: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g?: number;
  saturated_fat_g?: number;
  unsaturated_fat_g?: number;
  salt_g?: number;
  defaultAmount?: number;
  defaultUnit?: PortionUnit;
  density_g_per_ml?: number;
  g_per_portion?: number;
  nutrients?: Nutrient;
}

export type MealType = "SUPPLEMENTS" | "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "OTHER";

export interface FoodLog {
  id: string;
  mealLogId: string;
  foodId: string;
  weight_g: number;
  amount?: number;
  unit?: PortionUnit;
  date: string;
  food?: Food;
}

export interface MealLog {
  id: string;
  userId?: string;
  type: MealType;
  date?: string;
  foodLogs?: FoodLog[];
}

export interface MacroTotals {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  saturated_fat_g: number;
  unsaturated_fat_g: number;
  salt_g: number;
}

// New goal format from API
export interface GoalProgress {
  target: number;
  achieved: number;
  progress_percent: number;
}

export interface DashboardGoals {
  calories: GoalProgress | null;
  protein_g: GoalProgress | null;
  carbs_g: GoalProgress | null;
  fat_g: GoalProgress | null;
  fiber_g: GoalProgress | null;
  sugar_g: GoalProgress | null;
  saturated_fat_g: GoalProgress | null;
  unsaturated_fat_g: GoalProgress | null;
  salt_g: GoalProgress | null;
}

export interface DailyDashboard {
  date: string;
  totals: MacroTotals;
  nutrientTotals: Partial<Nutrient>;
  meals: MealLog[];
  goals: DashboardGoals;
}

export interface NutritionOverTimeDay {
  date: string;
  totals: MacroTotals;
  nutrientTotals: Partial<Nutrient>;
}

export interface NutritionOverTimeResponse {
  startDate: string;
  endDate: string;
  days: NutritionOverTimeDay[];
}

// User goals CRUD
export interface UserGoals {
  id?: string;
  userId?: string;
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
  sugar_g?: number;
  saturated_fat_g?: number;
  unsaturated_fat_g?: number;
  salt_g?: number;
}

// NRV
export interface NrvValues {
  [key: string]: number;
}

export interface NrvProgressItem {
  nrv: number;
  achieved: number;
  progress_percent: number;
}

export interface NrvProgressResponse {
  [key: string]: NrvProgressItem;
}

// Meal Recipes
export interface MealRecipeIngredient {
  id: string;
  mealRecipeId: string;
  foodId: string;
  weight_g: number;
  food?: Food;
}

export interface MealRecipe {
  id: string;
  userId?: string;
  name: string;
  servingSize?: number;
  ingredients: MealRecipeIngredient[];
  nutrition?: MacroTotals;
}

export interface CreateFoodRequest {
  name: string;
  calories_per_100g: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g?: number;
  saturated_fat_g?: number;
  unsaturated_fat_g?: number;
  salt_g?: number;
  defaultAmount?: number;
  defaultUnit?: PortionUnit;
  density_g_per_ml?: number;
  g_per_portion?: number;
  nutrients?: Partial<Nutrient>;
}

export interface CreateMealLogRequest {
  type: MealType;
  date?: string;
}

export interface CreateFoodLogRequest {
  foodId: string;
  weight_g?: number;
  amount?: number;
  unit?: PortionUnit;
  date?: string;
}
