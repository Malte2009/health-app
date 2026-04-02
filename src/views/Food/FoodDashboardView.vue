<template>
  <div class="food-dashboard">
    <!-- Date Navigation -->
    <div class="date-nav">
      <button class="date-btn" @click="changeDate(-1)">&#8592;</button>
      <div class="date-display">
        <span class="date-text">{{ formatDisplayDate(selectedDate) }}</span>
        <button v-if="selectedDate !== todayStr" class="today-btn" @click="goToToday">Today</button>
      </div>
      <button class="date-btn" :disabled="selectedDate >= todayStr" @click="changeDate(1)">&#8594;</button>
    </div>

    <div v-if="loading" class="loading-state">Loading...</div>

    <div v-else>
      <!-- Daily Summary -->
      <div class="summary-card">
        <!-- Calorie Ring -->
        <div class="calorie-ring-section">
          <svg class="calorie-ring" viewBox="0 0 128 128" width="120" height="120">
            <circle cx="64" cy="64" r="54" fill="none" stroke="var(--border)" stroke-width="10" />
            <circle
              cx="64" cy="64" r="54" fill="none"
              :stroke="calorieProgress > 1 ? 'var(--danger)' : 'var(--primary)'"
              stroke-width="10" stroke-linecap="round"
              :stroke-dasharray="ringCircumference"
              :stroke-dashoffset="ringDashoffset"
              transform="rotate(-90 64 64)"
            />
            <text x="64" y="58" text-anchor="middle" font-size="18" fill="var(--text-main)" font-weight="700">
              {{ dashboard?.totals.calories ?? 0 }}
            </text>
            <text x="64" y="76" text-anchor="middle" font-size="10" fill="var(--text-secondary)">kcal</text>
          </svg>
          <div class="calorie-goal-text">
            <span :class="calorieProgress > 1 ? 'over-goal' : ''">
              {{ calGoal?.achieved ?? 0 }} / {{ calGoal?.target ?? '—' }} kcal
            </span>
            <span class="goal-percent">{{ calGoal?.progress_percent != null ? Math.round(calGoal.progress_percent) + '%' : '' }}</span>
          </div>
        </div>

        <!-- Macro Goal Bars -->
        <div class="macro-bars">
          <div v-for="m in macroList" :key="m.key" class="macro-row">
            <span class="macro-label">{{ m.label }}</span>
            <div class="macro-bar-track">
              <div :class="['macro-bar', m.barClass]" :style="{ width: macroGoalWidth(m.key) }"></div>
            </div>
            <span :class="['macro-value', m.colorClass]">
              {{ round1(macroAchieved(m.key)) }}g
              <span v-if="macroTarget(m.key)" class="macro-target">/ {{ macroTarget(m.key) }}g</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Add Meal Row -->
      <div class="add-meal-row">
        <span class="section-label">Meals</span>
        <div class="meal-type-buttons">
          <button
            v-for="type in availableMealTypes" :key="type"
            class="add-meal-btn" :disabled="creatingMeal" @click="addMeal(type)"
          >{{ mealIcon(type) }} {{ formatMealType(type) }}</button>
        </div>
      </div>

      <!-- Meal Cards -->
      <div class="meals-section">
        <div v-for="meal in meals" :key="meal.id" class="meal-card">
          <div class="meal-header">
            <div class="meal-title">
              <span class="meal-icon">{{ mealIcon(meal.type) }}</span>
              <span class="meal-name">{{ formatMealType(meal.type) }}</span>
              <span class="meal-kcal">{{ mealCalories(meal) }} kcal</span>
            </div>
            <div class="meal-actions">
              <button class="add-food-btn" @click="openAddFood(meal.id)">+ Food</button>
              <button class="delete-meal-btn" @click="confirmDeleteMeal(meal.id)">&#10005;</button>
            </div>
          </div>

          <div v-if="hasMealFoods(meal)" class="food-logs-list">
            <div v-for="(fl, idx) in mealFoodLogs(meal)" :key="fl.id || `${meal.id}-${idx}`" class="food-log-item">
              <div class="food-log-left">
                <div class="food-log-name">{{ foodLogName(fl) }}</div>
                <div class="food-log-macros">
                  <span class="macro-pill weight-pill">{{ foodLogAmountDisplay(fl) }}</span>
                  <span class="macro-pill kcal-pill">{{ calcFoodLogCalories(fl) }} kcal</span>
                  <span class="macro-pill protein-pill">Protein {{ calcFoodLogMacro(fl, 'protein') }} g</span>
                  <span class="macro-pill carbs-pill">Carbs {{ calcFoodLogMacro(fl, 'carbs') }} g</span>
                  <span class="macro-pill fat-pill">Fats {{ calcFoodLogMacro(fl, 'fat') }} g</span>
                </div>
              </div>
              <button v-if="foodLogId(fl)" class="delete-food-log-btn" @click="deleteFoodLogItem(meal.id, foodLogId(fl) as string)">&#10005;</button>
            </div>
          </div>
          <div v-else class="meal-empty">No foods logged yet.</div>
        </div>

        <div v-if="meals.length === 0" class="no-meals">
          No meals logged for this day. Add a meal above to get started.
        </div>
      </div>

      <!-- Micronutrients Panel with NRV Progress -->
      <div class="micro-panel">
        <button class="micro-toggle" @click="toggleMicros">
          <span>Micronutrients</span>
          <span class="toggle-icon">{{ showMicros ? '▲' : '▼' }}</span>
        </button>

        <div v-if="showMicros" class="micro-content">
          <div v-for="group in nutrientGroups" :key="group.title" class="micro-group">
            <h4 class="micro-group-title">{{ group.title }}</h4>
            <div class="micro-grid">
              <div v-for="n in group.items" :key="n.key" class="micro-item">
                <div class="micro-top">
                  <span class="micro-name">{{ n.label }}</span>
                  <span class="micro-val" :class="{ 'micro-zero': !nutrientVal(n.key) }">
                    {{ nutrientVal(n.key) != null ? nutrientVal(n.key) + ' ' + n.unit : '—' }}
                  </span>
                </div>
                <!-- NRV bar -->
                <div v-if="nrvData[n.key]" class="nrv-bar-track">
                  <div
                    class="nrv-bar"
                    :style="{ width: Math.min(100, nrvData[n.key].progress_percent) + '%' }"
                    :class="{ 'nrv-full': nrvData[n.key].progress_percent >= 100 }"
                  ></div>
                  <span class="nrv-pct">{{ Math.round(nrvData[n.key].progress_percent) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Meal Confirm -->
    <div v-if="deleteMealId" class="confirm-overlay" @click.self="deleteMealId = null">
      <div class="confirm-modal">
        <p>Delete this meal and all its food logs?</p>
        <div class="confirm-actions">
          <button class="btn btn-danger" @click="doDeleteMeal">Delete</button>
          <button class="btn btn-secondary" @click="deleteMealId = null">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Add Food Modal -->
    <AddFoodLogModal
      v-if="addFoodMealId"
      :meal-log-id="addFoodMealId"
      :date="selectedDate"
      @close="addFoodMealId = null"
      @logged="onFoodLogged"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { isAuthenticated } from "@/services/authService.ts";
import { getDailyDashboard } from "@/services/foodDashboardService.ts";
import { getNrvProgress } from "@/services/nrvService.ts";
import { createMealLog, deleteMealLog, deleteFoodLog } from "@/services/mealLogService.ts";
import { toLocalIsoDate } from "@/utility/date.ts";
import type { DailyDashboard, MealLog, FoodLog, MealType, Nutrient, GoalProgress, NrvProgressItem, MacroTotals } from "@/types/foodType.ts";
import AddFoodLogModal from "@/components/Food/AddFoodLogModal.vue";

const router = useRouter();

const todayStr = toLocalIsoDate();
const selectedDate = ref(todayStr);
const dashboard = ref<DailyDashboard | null>(null);
const nrvData = ref<Record<string, NrvProgressItem>>({});
const loading = ref(false);
const showMicros = ref(false);
const addFoodMealId = ref<string | null>(null);
const deleteMealId = ref<string | null>(null);
const creatingMeal = ref(false);

const ALL_MEAL_TYPES: MealType[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK", "OTHER"];
type MacroKey = keyof Pick<MacroTotals, "protein_g" | "carbs_g" | "fat_g" | "fiber_g">;
type NutrientValueKey = Exclude<keyof Nutrient, "id" | "foodId">;

const meals = computed<MealLog[]>(() => dashboard.value?.meals ?? []);

const availableMealTypes = computed<MealType[]>(() => {
  const existing = new Set(meals.value.map((m) => m.type));
  return ALL_MEAL_TYPES.filter((t) => !existing.has(t));
});

// Goals (new format: { target, achieved, progress_percent } | null)
const calGoal = computed<GoalProgress | null>(() => dashboard.value?.goals?.calories ?? null);

function macroGoal(key: MacroKey): GoalProgress | null {
  const goals = dashboard.value?.goals;
  if (!goals) return null;
  return goals[key] ?? null;
}

function macroAchieved(key: MacroKey): number {
  const g = macroGoal(key);
  if (g) return g.achieved;
  const totals = dashboard.value?.totals;
  if (!totals) return 0;
  return totals[key] ?? 0;
}

function macroTarget(key: MacroKey): number | null {
  return macroGoal(key)?.target ?? null;
}

function macroGoalWidth(key: MacroKey): string {
  const g = macroGoal(key);
  if (g) return Math.min(100, g.progress_percent) + "%";
  // Fallback: proportion of calories
  const totals = dashboard.value?.totals;
  if (!totals) return "0%";
  const cal = totals?.calories ?? 0;
  if (!cal) return "0%";
  const val = totals[key] ?? 0;
  const kcalFactor = key === "fat_g" ? 9 : 4;
  return Math.min(100, Math.round(((val * kcalFactor) / Math.max(cal, 1)) * 100)) + "%";
}

const macroList: { key: MacroKey; label: string; barClass: string; colorClass: string }[] = [
  { key: "protein_g", label: "Protein", barClass: "protein-bar", colorClass: "protein-color" },
  { key: "carbs_g", label: "Carbs", barClass: "carbs-bar", colorClass: "carbs-color" },
  { key: "fat_g", label: "Fat", barClass: "fat-bar", colorClass: "fat-color" },
  { key: "fiber_g", label: "Fiber", barClass: "fiber-bar", colorClass: "fiber-color" },
];

const ringCircumference = 2 * Math.PI * 54;

const calorieProgress = computed(() => {
  const goal = calGoal.value?.target;
  if (!goal) return 0;
  return (calGoal.value?.achieved ?? 0) / goal;
});

const ringDashoffset = computed(() => {
  return ringCircumference * (1 - Math.min(1, calorieProgress.value));
});

function round1(val: number): number {
  return Math.round(val * 10) / 10;
}

function formatDisplayDate(d: string): string {
  return new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "long" }).format(new Date(d + "T12:00:00"));
}

function changeDate(delta: number) {
  const d = new Date(selectedDate.value + "T12:00:00");
  d.setDate(d.getDate() + delta);
  const newDate = toLocalIsoDate(d);
  if (newDate <= todayStr) selectedDate.value = newDate;
}

function goToToday() { selectedDate.value = todayStr; }

function mealIcon(type: MealType): string {
  return { BREAKFAST: "🌅", LUNCH: "☀️", DINNER: "🌙", SNACK: "🍎", OTHER: "🍽️" }[type];
}

function formatMealType(type: MealType): string {
  return type.charAt(0) + type.slice(1).toLowerCase();
}

function mealCalories(meal: MealLog): number {
  return Math.round(mealFoodLogs(meal).reduce((s, fl) => s + calcFoodLogCalories(fl), 0));
}

function mealFoodLogs(meal: MealLog): FoodLog[] {
  const raw = (meal as MealLog & { food_logs?: FoodLog[]; foods?: FoodLog[] }).foodLogs
    ?? (meal as MealLog & { food_logs?: FoodLog[]; foods?: FoodLog[] }).food_logs
    ?? (meal as MealLog & { food_logs?: FoodLog[]; foods?: FoodLog[] }).foods;
  return Array.isArray(raw) ? raw : [];
}

function hasMealFoods(meal: MealLog): boolean {
  return mealFoodLogs(meal).length > 0;
}

function calcFoodLogCalories(fl: FoodLog): number {
  const calories = Number(foodField(fl, "calories_per_100g", "caloriesPer100g"));
  return Math.round((calories * foodLogWeight(fl)) / 100);
}

function calcFoodLogMacro(fl: FoodLog, type: "protein" | "carbs" | "fat"): string {
  const base = type === "protein"
    ? Number(foodField(fl, "protein_g", "proteinG"))
    : type === "carbs"
      ? Number(foodField(fl, "carbs_g", "carbsG"))
      : Number(foodField(fl, "fat_g", "fatG"));
  return (Math.round((base * foodLogWeight(fl)) / 10) / 10).toString();
}

function foodLogId(fl: FoodLog): string | null {
  const id = (fl as FoodLog & { food_log_id?: unknown }).id ?? (fl as FoodLog & { food_log_id?: unknown }).food_log_id;
  if (id == null) return null;
  const normalized = String(id);
  return normalized.length > 0 ? normalized : null;
}

function foodLogWeight(fl: FoodLog): number {
  const rawWeight = (fl as FoodLog & { weightG?: number; weight?: number }).weight_g
    ?? (fl as FoodLog & { weightG?: number; weight?: number }).weightG
    ?? (fl as FoodLog & { weightG?: number; weight?: number }).weight;
  const weight = Number(rawWeight ?? 0);
  if (Number.isFinite(weight) && weight > 0) return weight;

  const amountRaw = (fl as FoodLog & { amount?: number }).amount;
  const unitRaw = (fl as FoodLog & { unit?: string }).unit;
  const amount = Number(amountRaw ?? 0);
  const unit = typeof unitRaw === "string" ? unitRaw.toUpperCase() : "";

  if (amount > 0 && unit === "G") return amount;
  if (amount > 0 && unit === "ML") {
    const density = Number(foodField(fl, "density_g_per_ml", "densityGPerMl"));
    if (density > 0) return amount * density;
  }

  const defaultAmount = Number(foodField(fl, "default_amount", "defaultAmount"));
  const defaultUnitRaw = foodTextField(fl, "defaultUnit", "defaultUnit");
  const defaultUnit = defaultUnitRaw.toUpperCase();
  if (defaultAmount > 0 && defaultUnit === "G") return defaultAmount;
  if (defaultAmount > 0 && defaultUnit === "ML") {
    const density = Number(foodField(fl, "density_g_per_ml", "densityGPerMl"));
    if (density > 0) return defaultAmount * density;
  }

  return 0;
}

function foodField(fl: FoodLog, snake: string, camel: string): number {
  const withFoodItem = fl as FoodLog & { food_item?: Record<string, unknown> };
  const foodObj = (fl.food ?? withFoodItem.food_item ?? null) as Record<string, unknown> | null;
  if (foodObj) {
    const nested = Number(foodObj[snake] ?? foodObj[camel] ?? 0);
    if (Number.isFinite(nested)) return nested;
  }
  const top = fl as unknown as Record<string, unknown>;
  const direct = Number(top[snake] ?? top[camel] ?? 0);
  return Number.isFinite(direct) ? direct : 0;
}

function foodTextField(fl: FoodLog, snake: string, camel: string): string {
  const withFoodItem = fl as FoodLog & { food_item?: Record<string, unknown> };
  const foodObj = (fl.food ?? withFoodItem.food_item ?? null) as Record<string, unknown> | null;
  if (foodObj) {
    const nested = foodObj[snake] ?? foodObj[camel];
    if (typeof nested === "string") return nested;
  }
  const top = fl as unknown as Record<string, unknown>;
  const direct = top[snake] ?? top[camel];
  return typeof direct === "string" ? direct : "";
}

function foodLogAmountDisplay(fl: FoodLog): string {
  const amount = Number((fl as FoodLog & { amount?: number }).amount ?? 0);
  const unit = ((fl as FoodLog & { unit?: string }).unit ?? "").toString().toUpperCase();
  if (amount > 0 && (unit === "G" || unit === "ML")) {
    return `${Math.round(amount * 10) / 10} ${unit === "G" ? "g" : "ml"}`;
  }
  return `${Math.round(foodLogWeight(fl) * 10) / 10} g`;
}

function foodLogName(fl: FoodLog): string {
  const withFoodItem = fl as FoodLog & { food_item?: { name?: string } };
  return fl.food?.name ?? withFoodItem.food_item?.name ?? "Unknown";
}

function nutrientVal(key: NutrientValueKey): number | null {
  const v = dashboard.value?.nutrientTotals?.[key];
  if (v == null || v === 0) return null;
  return Math.round(v * 10) / 10;
}

function openAddFood(mealId: string) { addFoodMealId.value = mealId; }
function confirmDeleteMeal(id: string) { deleteMealId.value = id; }

async function doDeleteMeal() {
  if (!deleteMealId.value) return;
  await deleteMealLog(deleteMealId.value);
  deleteMealId.value = null;
  await loadDashboard();
}

async function deleteFoodLogItem(mealLogId: string, foodLogId: string) {
  await deleteFoodLog(mealLogId, foodLogId);
  await loadDashboard();
}

async function addMeal(type: MealType) {
  creatingMeal.value = true;
  await createMealLog({ type, date: selectedDate.value });
  creatingMeal.value = false;
  await loadDashboard();
}

async function onFoodLogged() { await loadDashboard(); }

async function toggleMicros() {
  showMicros.value = !showMicros.value;
  if (showMicros.value && Object.keys(nrvData.value).length === 0) {
    await loadNrv();
  }
}

async function loadNrv() {
  const nt = dashboard.value?.nutrientTotals;
  if (!nt) return;
  const cleaned: Record<string, number> = {};
  for (const [k, v] of Object.entries(nt) as [NutrientValueKey, number | undefined][]) {
    if (typeof v === "number" && v > 0) cleaned[k] = v;
  }
  if (Object.keys(cleaned).length === 0) return;
  const result = await getNrvProgress(cleaned);
  if (result) nrvData.value = result;
}

async function loadDashboard() {
  loading.value = true;
  const data = await getDailyDashboard(selectedDate.value);
  dashboard.value = data ?? null;
  nrvData.value = {};
  loading.value = false;
}

watch(selectedDate, loadDashboard);

onMounted(async () => {
  if (!(await isAuthenticated())) {
    await router.push({ name: "login" });
    return;
  }
  await loadDashboard();
});

// Nutrient definitions grouped
type NutrientDef = { key: NutrientValueKey; label: string; unit: string };

const nutrientGroups: { title: string; items: NutrientDef[] }[] = [
  {
    title: "Vitamins",
    items: [
      { key: "vitamin_a", label: "Vitamin A", unit: "µg" }, { key: "vitamin_d", label: "Vitamin D", unit: "µg" },
      { key: "vitamin_e", label: "Vitamin E", unit: "mg" }, { key: "vitamin_k", label: "Vitamin K", unit: "µg" },
      { key: "vitamin_c", label: "Vitamin C", unit: "mg" }, { key: "vitamin_b1", label: "B1", unit: "mg" },
      { key: "vitamin_b2", label: "B2", unit: "mg" }, { key: "vitamin_b3", label: "B3", unit: "mg" },
      { key: "vitamin_b5", label: "B5", unit: "mg" }, { key: "vitamin_b6", label: "B6", unit: "mg" },
      { key: "vitamin_b7", label: "B7", unit: "µg" }, { key: "vitamin_b9", label: "B9", unit: "µg" },
      { key: "vitamin_b12", label: "B12", unit: "µg" }, { key: "choline", label: "Choline", unit: "mg" },
      { key: "caffeine", label: "Caffeine", unit: "mg" },
    ],
  },
  {
    title: "Minerals",
    items: [
      { key: "calcium", label: "Calcium", unit: "mg" }, { key: "phosphorus", label: "Phosphorus", unit: "mg" },
      { key: "magnesium", label: "Magnesium", unit: "mg" }, { key: "sodium", label: "Sodium", unit: "mg" },
      { key: "potassium", label: "Potassium", unit: "mg" }, { key: "chloride", label: "Chloride", unit: "mg" },
      { key: "sulfur", label: "Sulfur", unit: "mg" }, { key: "iron", label: "Iron", unit: "mg" },
      { key: "zinc", label: "Zinc", unit: "mg" }, { key: "selenium", label: "Selenium", unit: "µg" },
      { key: "iodine", label: "Iodine", unit: "µg" }, { key: "copper", label: "Copper", unit: "mg" },
      { key: "manganese", label: "Manganese", unit: "mg" }, { key: "chromium", label: "Chromium", unit: "µg" },
      { key: "molybdenum", label: "Molybdenum", unit: "µg" }, { key: "fluoride", label: "Fluoride", unit: "mg" },
    ],
  },
  {
    title: "Fatty Acids",
    items: [
      { key: "omega_3", label: "Omega-3", unit: "mg" }, { key: "omega_6", label: "Omega-6", unit: "mg" },
      { key: "omega_9", label: "Omega-9", unit: "mg" },
    ],
  },
];
</script>

<style scoped>
.food-dashboard {
  max-width: 860px;
  margin: 0 auto;
  padding: 20px 12px 48px;
}

/* Date Nav */
.date-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.date-btn {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-main);
  border-radius: 8px;
  width: 44px;
  height: 44px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}

.date-btn:hover:not(:disabled) { background: var(--bg-surface-secondary); }
.date-btn:disabled { opacity: 0.3; cursor: default; }

.date-display {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 1;
  min-width: 0;
}

.date-text {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-main);
  text-align: center;
  white-space: nowrap;
}

.today-btn {
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
  min-height: 32px;
}

.today-btn:hover { background: #00a495; }

.loading-state {
  text-align: center;
  color: var(--text-secondary);
  padding: 60px 0;
}

/* Summary Card */
.summary-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  gap: 24px;
  align-items: center;
  margin-bottom: 20px;
}

.calorie-ring-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.calorie-ring {
  filter: drop-shadow(0 0 6px rgba(0, 191, 174, 0.2));
}

.calorie-goal-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.over-goal { color: var(--danger); font-weight: 600; }
.goal-percent { font-size: 0.75rem; }

/* Macro Bars */
.macro-bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.macro-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.macro-label {
  min-width: 48px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.macro-bar-track {
  flex: 1;
  height: 8px;
  background: var(--bg-surface-secondary);
  border-radius: 4px;
  overflow: hidden;
  min-width: 0;
}

.macro-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
  min-width: 2px;
}

.protein-bar { background: var(--success); }
.carbs-bar { background: var(--accent); }
.fat-bar { background: #f97316; }
.fiber-bar { background: #38bdf8; }

.macro-value {
  font-size: 0.82rem;
  font-weight: 600;
  text-align: right;
  white-space: nowrap;
  flex-shrink: 0;
}

.macro-target {
  font-weight: 400;
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.protein-color { color: var(--success); }
.carbs-color { color: var(--accent); }
.fat-color { color: #f97316; }
.fiber-color { color: #38bdf8; }
.kcal-color { color: var(--primary); }

/* Add Meal Row */
.add-meal-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.section-label {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  flex-shrink: 0;
}

.meal-type-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.add-meal-btn {
  background: var(--bg-surface);
  border: 1px dashed var(--border);
  color: var(--text-secondary);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.82rem;
  cursor: pointer;
  min-height: 36px;
  transition: border-color 0.15s, color 0.15s;
}

.add-meal-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); }
.add-meal-btn:disabled { opacity: 0.5; cursor: default; }

/* Meals */
.meals-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.no-meals {
  text-align: center;
  color: var(--text-secondary);
  padding: 28px;
  background: var(--bg-surface);
  border-radius: 12px;
  border: 1px dashed var(--border);
}

.meal-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: var(--bg-surface-secondary);
  border-bottom: 1px solid var(--border);
  gap: 8px;
}

.meal-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  min-width: 0;
}

.meal-icon { font-size: 1.1rem; }
.meal-name { font-weight: 700; font-size: 0.95rem; color: var(--text-main); }
.meal-kcal { font-size: 0.82rem; color: var(--primary); font-weight: 600; }

.meal-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.add-food-btn {
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 6px 12px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 34px;
  transition: background 0.15s;
}

.add-food-btn:hover { background: #00a495; }

.delete-meal-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  border-radius: 7px;
  width: 34px;
  height: 34px;
  cursor: pointer;
  font-size: 0.82rem;
  transition: border-color 0.15s, color 0.15s;
}

.delete-meal-btn:hover { border-color: var(--danger); color: var(--danger); }

/* Food Logs */
.food-logs-list { padding: 4px 0; }

.food-log-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  gap: 8px;
  border-bottom: 1px solid var(--border);
}

.food-log-item:last-child { border-bottom: none; }

.food-log-left {
  flex: 1;
  min-width: 0;
}

.food-log-name {
  font-weight: 500;
  color: var(--text-main);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.food-log-macros {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 2px;
}

.macro-pill {
  font-size: 0.74rem;
  font-weight: 600;
  border-radius: 999px;
  padding: 3px 9px;
  display: inline-flex;
  align-items: center;
  line-height: 1.2;
  border: 1px solid transparent;
}

.weight-pill {
  color: var(--text-secondary);
  background: var(--bg-surface-secondary);
  border-color: var(--border);
}

.kcal-pill {
  color: var(--primary);
  background: rgba(0, 191, 174, 0.12);
}

.protein-pill {
  color: var(--success);
  background: rgba(47, 213, 114, 0.14);
}

.carbs-pill {
  color: var(--accent);
  background: rgba(255, 209, 102, 0.16);
}

.fat-pill {
  color: #f97316;
  background: rgba(249, 115, 22, 0.14);
}

.delete-food-log-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 6px;
  border-radius: 4px;
  transition: color 0.15s;
  flex-shrink: 0;
  min-width: 32px;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-food-log-btn:hover { color: var(--danger); }

.meal-empty {
  padding: 12px 14px;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

/* Micronutrients */
.micro-panel {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.micro-toggle {
  width: 100%;
  background: none;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  color: var(--text-main);
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  min-height: 48px;
  transition: background 0.15s;
}

.micro-toggle:hover { background: var(--bg-surface-secondary); }

.toggle-icon { font-size: 0.75rem; color: var(--text-secondary); }

.micro-content {
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.micro-group-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 8px;
}

.micro-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 6px;
}

.micro-item {
  padding: 6px 10px;
  background: var(--bg-surface-secondary);
  border-radius: 6px;
}

.micro-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.micro-name { font-size: 0.78rem; color: var(--text-secondary); }
.micro-val { font-size: 0.78rem; font-weight: 600; color: var(--primary); }
.micro-zero { color: var(--text-secondary); font-weight: 400; }

/* NRV Progress Bar */
.nrv-bar-track {
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  margin-top: 3px;
}

.nrv-bar {
  height: 100%;
  background: var(--primary);
  border-radius: 2px;
  transition: width 0.4s ease;
}

.nrv-bar.nrv-full { background: var(--success); }

.nrv-pct {
  position: absolute;
  right: 0;
  top: -13px;
  font-size: 0.65rem;
  color: var(--text-secondary);
}

/* Confirm */
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.confirm-modal {
  background: var(--bg-surface);
  border-radius: 14px;
  padding: 24px;
  min-width: 260px;
  max-width: 90vw;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.confirm-modal p { color: var(--text-main); margin-bottom: 20px; }
.confirm-actions { display: flex; gap: 12px; justify-content: center; }

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.15s;
  min-height: 44px;
}

.btn-danger { background: var(--danger); color: #fff; }
.btn-danger:hover { background: #e83f60; }
.btn-secondary { background: var(--bg-surface-secondary); color: var(--text-secondary); border: 1px solid var(--border); }
.btn-secondary:hover { color: var(--text-main); }

/* Mobile */
@media (max-width: 640px) {
  .food-dashboard { padding: 12px 8px 36px; }

  .summary-card {
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }

  .calorie-ring-section { align-items: center; }

  .date-text { font-size: 0.88rem; }

  .micro-grid {
    grid-template-columns: 1fr;
  }

  .meal-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .meal-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .food-log-macros {
    gap: 6px;
  }
}
</style>
