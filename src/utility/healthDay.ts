import type { HealthDay, HealthDayIncludeValue } from "@/types/daily/healthDay.type.ts";
import type { FoodLog } from "@/types/food/foodLog.type.ts";
import type { NutrientFacts } from "@/types/food/nutrientFacts.type.ts";

export const HEALTH_DAY_SUMMARY_INCLUDES: HealthDayIncludeValue[] = [
  "dailyLog",
  "workouts",
  "mealLogs.foodLogs",
  "mealLogs.food",
  "intakeLogs",
  "sleepLogs",
  "bloodPressureLogs",
  "symptomLogs",
  "syncopeLogs",
  "hrvRecordings",
];

export const MICRONUTRIENT_KEYS = [
  "vitamin_a",
  "vitamin_d",
  "vitamin_e",
  "vitamin_k",
  "vitamin_b1",
  "vitamin_b2",
  "vitamin_b3",
  "vitamin_b5",
  "vitamin_b6",
  "vitamin_b7",
  "vitamin_b9",
  "vitamin_b12",
  "choline",
  "caffeine",
  "calcium",
  "phosphorus",
  "magnesium",
  "sodium",
  "potassium",
  "chloride",
  "sulfur",
  "iron",
  "zinc",
  "selenium",
  "iodine",
  "copper",
  "manganese",
  "chromium",
  "molybdenum",
  "fluoride",
  "vitamin_c",
  "omega_3",
  "omega_6",
  "omega_9",
] as const satisfies readonly (keyof NutrientFacts)[];

export type MicronutrientKey = (typeof MICRONUTRIENT_KEYS)[number];
export type MicronutrientTotals = Partial<Record<MicronutrientKey, number>>;

export type FoodSummary = {
  name: string;
  totalWeight_g: number | null;
};

export function getHealthDayFoodLogs(healthDay?: HealthDay): FoodLog[] {
  return (healthDay?.mealLogs ?? []).flatMap((meal) => meal.foodLogs ?? []);
}

export function summarizeFoodLogs(foodLogs: FoodLog[]): FoodSummary[] {
  const summaries = new Map<string, FoodSummary>();

  for (const foodLog of foodLogs) {
    const name = foodLog.food?.name;
    if (!name) continue;

    const current = summaries.get(name) ?? { name, totalWeight_g: null };
    if (foodLog.weight_g !== null) {
      current.totalWeight_g = (current.totalWeight_g ?? 0) + foodLog.weight_g;
    }
    summaries.set(name, current);
  }

  return [...summaries.values()].sort((left, right) => left.name.localeCompare(right.name));
}

export function calculateMicronutrientTotals(foodLogs: FoodLog[]): MicronutrientTotals {
  const totals: MicronutrientTotals = {};

  for (const foodLog of foodLogs) {
    const nutrients = foodLog.food?.nutrients;
    if (!nutrients || foodLog.weight_g === null) continue;

    const amountFactor = foodLog.weight_g / 100;
    for (const key of MICRONUTRIENT_KEYS) {
      const valuePer100g = nutrients[key];
      if (valuePer100g === null || !Number.isFinite(valuePer100g)) continue;
      totals[key] = (totals[key] ?? 0) + valuePer100g * amountFactor;
    }
  }

  for (const key of MICRONUTRIENT_KEYS) {
    if (totals[key] !== undefined) totals[key] = Math.round(totals[key] * 100) / 100;
  }

  return totals;
}
