<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h2>Add Food</h2>
        <button class="close-btn" @click="$emit('close')">&#10005;</button>
      </div>

      <!-- Tabs -->
      <div class="modal-tabs">
        <button :class="{ active: tab === 'search' }" @click="tab = 'search'">Search</button>
        <button :class="{ active: tab === 'recipes' }" @click="tab = 'recipes'; loadRecipes()">Recipes</button>
      </div>

      <!-- Search Tab -->
      <div v-if="tab === 'search'">
        <div class="search-section">
          <input v-model="searchQuery" class="search-input" type="text" placeholder="Search foods..." @input="onSearchInput" />
        </div>

        <div v-if="!selectedFood">
          <div v-if="loading" class="status-msg">Searching...</div>
          <div v-else-if="searchResults.length === 0 && searchQuery.length >= 1" class="status-msg">No foods found.</div>
          <div v-else class="results-list">
            <div v-for="food in searchResults" :key="food.id" class="result-item" @click="selectFood(food)">
              <div class="result-name">{{ food.name }}</div>
              <div class="result-macros">
                <span class="macro-badge kcal">{{ food.calories_per_100g }} kcal</span>
                <span class="macro-badge protein">P {{ food.protein_g }}g</span>
                <span class="macro-badge carbs">C {{ food.carbs_g }}g</span>
                <span class="macro-badge fat">F {{ food.fat_g }}g</span>
                <span class="macro-badge muted">per 100g</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedFood" class="selected-section">
          <div class="selected-header">
            <button class="back-btn" @click="selectedFood = null">&#8592; Back</button>
            <span class="selected-name">{{ selectedFood.name }}</span>
          </div>

          <div class="weight-row">
            <label class="weight-label">Amount</label>
            <input v-model.number="amount" class="weight-input" type="number" min="0.1" step="0.1" />
            <select v-model="unit" class="unit-select">
              <option value="G">g</option>
              <option value="ML">ml</option>
              <option value="PORTION">portion</option>
            </select>
          </div>
          <div v-if="unit === 'ML' && !selectedFood?.density_g_per_ml" class="status-msg density-hint">
            This food has no density (g/ml). Weight will fallback to backend defaults.
          </div>
          <div v-if="unit === 'PORTION' && !selectedFood?.g_per_portion" class="status-msg density-hint">
            This food has no grams-per-portion data. Weight will fallback to backend defaults.
          </div>

          <div class="calculated-macros">
            <div class="calc-row">
              <div class="calc-item"><div class="calc-value kcal-color">{{ calcCalories }}</div><div class="calc-label">kcal</div></div>
              <div class="calc-item"><div class="calc-value protein-color">{{ calcProtein }}g</div><div class="calc-label">Protein</div></div>
              <div class="calc-item"><div class="calc-value carbs-color">{{ calcCarbs }}g</div><div class="calc-label">Carbs</div></div>
              <div class="calc-item"><div class="calc-value fat-color">{{ calcFat }}g</div><div class="calc-label">Fat</div></div>
              <div class="calc-item"><div class="calc-value fiber-color">{{ calcFiber }}g</div><div class="calc-label">Fiber</div></div>
            </div>
            <button class="details-toggle" @click="showAdvancedMacros = !showAdvancedMacros">
              {{ showAdvancedMacros ? "Hide details" : "Show details" }}
            </button>
            <div v-if="showAdvancedMacros" class="calc-row details-row">
              <div class="calc-item"><div class="calc-value sugar-color">{{ calcSugar }}g</div><div class="calc-label">Sugar</div></div>
              <div class="calc-item"><div class="calc-value sat-fat-color">{{ calcSatFat }}g</div><div class="calc-label">Sat Fat</div></div>
              <div class="calc-item"><div class="calc-value unsat-fat-color">{{ calcUnsatFat }}g</div><div class="calc-label">Unsat Fat</div></div>
              <div class="calc-item"><div class="calc-value salt-color">{{ calcSalt }}g</div><div class="calc-label">Salt</div></div>
            </div>
          </div>

          <button class="log-btn" :disabled="saving" @click="logFood">
            {{ saving ? 'Logging...' : 'Log Food' }}
          </button>
        </div>
      </div>

      <!-- Recipes Tab -->
      <div v-if="tab === 'recipes'">
        <div v-if="recipesLoading" class="status-msg">Loading recipes...</div>
        <div v-else-if="recipes.length === 0" class="status-msg">No recipes saved. Create one in the Recipes page.</div>
        <div v-else class="recipe-list">
          <div v-for="recipe in recipes" :key="recipe.id" class="recipe-item">
            <div class="recipe-info">
              <div class="recipe-name">{{ recipe.name }}</div>
              <div class="recipe-macros" v-if="recipe.nutrition">
                <span class="macro-badge kcal">{{ Math.round(recipe.nutrition.calories) }} kcal</span>
                <span class="macro-badge protein">P {{ Math.round(recipe.nutrition.protein_g) }}g</span>
                <span class="macro-badge carbs">C {{ Math.round(recipe.nutrition.carbs_g) }}g</span>
                <span class="macro-badge fat">F {{ Math.round(recipe.nutrition.fat_g) }}g</span>
              </div>
              <div class="recipe-ings">
                {{ recipe.ingredients.length }} ingredient{{ recipe.ingredients.length !== 1 ? 's' : '' }}
              </div>
            </div>

            <div v-if="selectedRecipe?.id === recipe.id" class="recipe-log-form">
              <div class="weight-row">
                <label class="weight-label">Scale</label>
                <input v-model.number="recipeScale" class="weight-input" type="number" min="0.1" step="0.1" />
              </div>
              <div class="recipe-log-actions">
                <button class="log-btn" :disabled="saving" @click="logRecipe">{{ saving ? 'Logging...' : 'Log Recipe' }}</button>
                <button class="back-btn" @click="selectedRecipe = null">Cancel</button>
              </div>
            </div>
            <button v-else class="recipe-select-btn" @click="selectRecipe(recipe)">Log</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Food, MealRecipe, PortionUnit } from "@/types/foodType.ts";
import { searchFoods } from "@/services/foodService.ts";
import { createFoodLog } from "@/services/mealLogService.ts";
import { getMealRecipes, logMealRecipe } from "@/services/mealRecipeService.ts";

const props = defineProps<{
  mealLogId: string;
  date: string;
}>();

const emit = defineEmits<{
  close: [];
  logged: [];
}>();

const tab = ref<"search" | "recipes">("search");
const searchQuery = ref("");
const searchResults = ref<Food[]>([]);
const selectedFood = ref<Food | null>(null);
const amount = ref<number>(100);
const unit = ref<PortionUnit>("G");
const loading = ref(false);
const saving = ref(false);
const showAdvancedMacros = ref(false);

// Recipes
const recipes = ref<MealRecipe[]>([]);
const recipesLoading = ref(false);
const recipesLoaded = ref(false);
const selectedRecipe = ref<MealRecipe | null>(null);
const recipeScale = ref(1.0);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function onSearchInput() {
  if (debounceTimer) clearTimeout(debounceTimer);
  if (searchQuery.value.length < 1) { searchResults.value = []; return; }
  debounceTimer = setTimeout(async () => {
    loading.value = true;
    searchResults.value = await searchFoods(searchQuery.value);
    loading.value = false;
  }, 350);
}

function selectFood(food: Food) {
  selectedFood.value = food;
  amount.value = food.defaultAmount && food.defaultAmount > 0 ? food.defaultAmount : 100;
  unit.value = food.defaultUnit ?? "G";
  showAdvancedMacros.value = false;
}

const effectiveWeight = computed(() => {
  if (!selectedFood.value) return 0;
  if (unit.value === "G") return amount.value;
  if (unit.value === "ML") {
    const density = selectedFood.value.density_g_per_ml;
    if (!density || density <= 0) return 0;
    return amount.value * density;
  }
  const gramsPerPortion = selectedFood.value.g_per_portion;
  if (!gramsPerPortion || gramsPerPortion <= 0) return 0;
  return amount.value * gramsPerPortion;
});

const calcCalories = computed(() => selectedFood.value ? Math.round((selectedFood.value.calories_per_100g * effectiveWeight.value) / 100) : 0);
const calcProtein = computed(() => selectedFood.value ? Math.round(((selectedFood.value.protein_g * effectiveWeight.value) / 100) * 10) / 10 : 0);
const calcCarbs = computed(() => selectedFood.value ? Math.round(((selectedFood.value.carbs_g * effectiveWeight.value) / 100) * 10) / 10 : 0);
const calcFat = computed(() => selectedFood.value ? Math.round(((selectedFood.value.fat_g * effectiveWeight.value) / 100) * 10) / 10 : 0);
const calcFiber = computed(() => selectedFood.value ? Math.round(((selectedFood.value.fiber_g * effectiveWeight.value) / 100) * 10) / 10 : 0);
const calcSugar = computed(() => selectedFood.value ? Math.round((((selectedFood.value.sugar_g ?? 0) * effectiveWeight.value) / 100) * 10) / 10 : 0);
const calcSatFat = computed(() => selectedFood.value ? Math.round((((selectedFood.value.saturated_fat_g ?? 0) * effectiveWeight.value) / 100) * 10) / 10 : 0);
const calcUnsatFat = computed(() => selectedFood.value ? Math.round((((selectedFood.value.unsaturated_fat_g ?? 0) * effectiveWeight.value) / 100) * 10) / 10 : 0);
const calcSalt = computed(() => selectedFood.value ? Math.round((((selectedFood.value.salt_g ?? 0) * effectiveWeight.value) / 100) * 100) / 100 : 0);

async function logFood() {
  if (!selectedFood.value || amount.value <= 0) return;
  saving.value = true;
  const result = await createFoodLog(props.mealLogId, {
    foodId: selectedFood.value.id,
    amount: amount.value,
    unit: unit.value,
    weight_g: effectiveWeight.value > 0 ? effectiveWeight.value : undefined,
    date: props.date,
  });
  saving.value = false;
  if (result) { emit("logged"); emit("close"); }
}

// Recipe functions
async function loadRecipes() {
  if (recipesLoaded.value) return;
  recipesLoading.value = true;
  recipes.value = await getMealRecipes();
  recipesLoading.value = false;
  recipesLoaded.value = true;
}

function selectRecipe(recipe: MealRecipe) {
  selectedRecipe.value = recipe;
  recipeScale.value = 1.0;
}

async function logRecipe() {
  if (!selectedRecipe.value) return;
  saving.value = true;
  const result = await logMealRecipe(selectedRecipe.value.id, {
    mealLogId: props.mealLogId,
    scaleFactor: recipeScale.value,
    date: props.date,
  });
  saving.value = false;
  if (result) { emit("logged"); emit("close"); }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
}

.modal {
  background: var(--bg-surface);
  border-radius: 18px 18px 0 0;
  width: 100%;
  max-width: 500px;
  max-height: 92vh;
  overflow-y: auto;
  padding: 20px;
  box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.4);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-header h2 { margin: 0; font-size: 1.2rem; color: var(--text-main); }

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  min-width: 36px;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover { background: var(--bg-surface-secondary); color: var(--text-main); }

/* Tabs */
.modal-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  background: var(--bg-surface-secondary);
  border-radius: 10px;
  padding: 3px;
}

.modal-tabs button {
  flex: 1;
  background: none;
  border: none;
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  padding: 8px;
  cursor: pointer;
  min-height: 40px;
  transition: all 0.15s;
}

.modal-tabs button.active {
  background: var(--bg-surface);
  color: var(--text-main);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.search-input {
  width: 100%;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text-main);
  font-size: 1rem;
  padding: 12px 14px;
  outline: none;
  box-sizing: border-box;
  min-height: 48px;
  transition: border-color 0.2s;
}

.search-input:focus { border-color: var(--primary); }

.status-msg {
  text-align: center;
  color: var(--text-secondary);
  padding: 24px 0;
  font-size: 0.9rem;
}

.results-list {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 45vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.result-item {
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
  cursor: pointer;
  transition: border-color 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.result-item:hover, .result-item:active { border-color: var(--primary); }

.result-name { font-weight: 600; color: var(--text-main); margin-bottom: 6px; font-size: 0.95rem; }

.result-macros { display: flex; gap: 5px; flex-wrap: wrap; }

.macro-badge { font-size: 0.75rem; padding: 2px 7px; border-radius: 20px; font-weight: 600; }
.macro-badge.kcal { background: rgba(0, 191, 174, 0.15); color: var(--primary); }
.macro-badge.protein { background: rgba(47, 213, 114, 0.15); color: var(--success); }
.macro-badge.carbs { background: rgba(255, 209, 102, 0.15); color: var(--accent); }
.macro-badge.fat { background: rgba(249, 115, 22, 0.15); color: #f97316; }
.macro-badge.muted { background: transparent; color: var(--text-secondary); font-weight: 400; }

.selected-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 14px 0 16px;
}

.back-btn {
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 0.88rem;
  min-height: 38px;
  transition: color 0.15s;
}

.back-btn:hover { color: var(--text-main); }

.selected-name { font-weight: 700; font-size: 1.05rem; color: var(--text-main); }

.weight-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.weight-label { color: var(--text-secondary); font-size: 0.9rem; min-width: 70px; }

.weight-input {
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text-main);
  font-size: 1.1rem;
  padding: 10px 14px;
  width: 120px;
  outline: none;
  min-height: 48px;
  transition: border-color 0.2s;
}

.weight-input:focus { border-color: var(--primary); }

.unit-select {
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text-main);
  font-size: 1rem;
  padding: 10px 12px;
  min-height: 48px;
}

.unit-select:focus { border-color: var(--primary); outline: none; }

.density-hint {
  padding-top: 0;
  text-align: left;
}

.calculated-macros {
  background: var(--bg-surface-secondary);
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 16px;
}

.calc-row { display: flex; justify-content: space-between; gap: 6px; }
.details-row { margin-top: 10px; }
.calc-item { text-align: center; flex: 1; }
.calc-value { font-size: 1.15rem; font-weight: 700; color: var(--text-main); }
.calc-label { font-size: 0.72rem; color: var(--text-secondary); margin-top: 2px; }
.kcal-color { color: var(--primary); }
.protein-color { color: var(--success); }
.carbs-color { color: var(--accent); }
.fat-color { color: #f97316; }
.fiber-color { color: #38bdf8; }
.sugar-color { color: #ff5f6d; }
.sat-fat-color { color: #ea580c; }
.unsat-fat-color { color: #ca8a04; }
.salt-color { color: #64748b; }

.details-toggle {
  margin-top: 10px;
  width: 100%;
  background: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 0.82rem;
  padding: 7px 10px;
  cursor: pointer;
}

.details-toggle:hover { color: var(--text-main); }

.log-btn {
  width: 100%;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  min-height: 52px;
  transition: background 0.2s, transform 0.1s;
}

.log-btn:hover:not(:disabled) { background: #00a495; }
.log-btn:active:not(:disabled) { transform: scale(0.98); }
.log-btn:disabled { opacity: 0.6; cursor: default; }

/* Recipes Tab */
.recipe-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 50vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.recipe-item {
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
}

.recipe-info { margin-bottom: 8px; }

.recipe-name { font-weight: 700; color: var(--text-main); font-size: 0.95rem; margin-bottom: 4px; }
.recipe-macros { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 4px; }
.recipe-ings { font-size: 0.78rem; color: var(--text-secondary); }

.recipe-select-btn {
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 40px;
  transition: background 0.15s;
}

.recipe-select-btn:hover { background: #00a495; }

.recipe-log-form {
  border-top: 1px solid var(--border);
  padding-top: 10px;
  margin-top: 4px;
}

.recipe-log-actions {
  display: flex;
  gap: 8px;
}

.recipe-log-actions .log-btn {
  flex: 1;
}

/* Desktop: center modal */
@media (min-width: 641px) {
  .modal-overlay {
    align-items: center;
  }

  .modal {
    border-radius: 18px;
    max-height: 85vh;
  }
}
</style>
