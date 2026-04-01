<template>
  <div class="recipes-view">
    <h1>Meal Recipes</h1>

    <!-- Create Recipe -->
    <div class="create-section">
      <button class="toggle-create-btn" @click="showCreate = !showCreate">
        {{ showCreate ? "Cancel" : "+ New Recipe" }}
      </button>

      <div v-if="showCreate" class="create-form">
        <div class="form-row">
          <div class="form-field full">
            <label>Recipe Name *</label>
            <input v-model="newName" type="text" placeholder="e.g. Protein Smoothie" />
          </div>
          <div class="form-field">
            <label>Serving Size</label>
            <input v-model.number="newServingSize" type="number" min="1" step="1" placeholder="1" />
          </div>
        </div>
        <button class="btn btn-primary" :disabled="!newName.trim() || saving" @click="doCreate">
          {{ saving ? "Creating..." : "Create Recipe" }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">Loading...</div>

    <div v-else-if="recipes.length === 0 && !showCreate" class="empty-state">
      No recipes yet. Create one to quickly log frequent meals.
    </div>

    <!-- Recipe list -->
    <div class="recipe-list">
      <div v-for="recipe in recipes" :key="recipe.id" class="recipe-card">
        <div class="recipe-header">
          <div class="recipe-title">
            <span class="recipe-icon">&#127858;</span>
            <span class="recipe-name">{{ recipe.name }}</span>
            <span v-if="recipe.servingSize" class="recipe-serving">{{ recipe.servingSize }} serving{{ recipe.servingSize > 1 ? 's' : '' }}</span>
          </div>
          <div class="recipe-macros" v-if="recipe.nutrition">
            <span class="macro-badge kcal">{{ Math.round(recipe.nutrition.calories) }} kcal</span>
            <span class="macro-badge protein">P {{ Math.round(recipe.nutrition.protein_g) }}g</span>
            <span class="macro-badge carbs">C {{ Math.round(recipe.nutrition.carbs_g) }}g</span>
            <span class="macro-badge fat">F {{ Math.round(recipe.nutrition.fat_g) }}g</span>
          </div>
        </div>

        <!-- Ingredients -->
        <div class="ingredients-section">
          <div class="ingredients-label">Ingredients</div>
          <div v-if="recipe.ingredients.length === 0" class="no-ingredients">No ingredients added yet.</div>
          <div v-for="ing in recipe.ingredients" :key="ing.id" class="ingredient-row">
            <span class="ing-name">{{ ing.food?.name ?? "Unknown" }}</span>
            <span class="ing-weight">{{ ing.weight_g }}g</span>
            <span class="ing-kcal">{{ ing.food ? Math.round(ing.food.calories_per_100g * ing.weight_g / 100) : 0 }} kcal</span>
            <button class="ing-delete" @click="doDeleteIngredient(recipe.id, ing.id)">&#10005;</button>
          </div>

          <!-- Add ingredient -->
          <div v-if="addingTo === recipe.id" class="add-ingredient-form">
            <input
              v-model="ingredientSearch"
              class="ing-search"
              type="text"
              placeholder="Search food..."
              @input="onIngredientSearch"
            />
            <div v-if="ingredientResults.length > 0" class="ing-results">
              <div v-for="food in ingredientResults" :key="food.id" class="ing-result-item" @click="selectIngredientFood(food)">
                {{ food.name }} ({{ food.calories_per_100g }} kcal/100g)
              </div>
            </div>
            <div v-if="selectedIngFood" class="ing-confirm">
              <span class="ing-selected-name">{{ selectedIngFood.name }}</span>
              <input v-model.number="ingredientWeight" class="ing-weight-input" type="number" min="1" placeholder="g" />
              <button class="btn btn-primary btn-sm" :disabled="!ingredientWeight || saving" @click="doAddIngredient(recipe.id)">Add</button>
              <button class="btn btn-secondary btn-sm" @click="clearIngredientForm">Cancel</button>
            </div>
          </div>

          <button v-if="addingTo !== recipe.id" class="add-ing-btn" @click="startAddIngredient(recipe.id)">+ Add Ingredient</button>
        </div>

        <!-- Recipe actions -->
        <div class="recipe-actions">
          <button class="btn btn-primary btn-sm" @click="openLogModal(recipe)">Log Meal</button>
          <button class="btn btn-danger btn-sm" @click="confirmDelete(recipe.id)">Delete</button>
        </div>
      </div>
    </div>

    <!-- Log Recipe Modal -->
    <div v-if="logRecipe" class="confirm-overlay" @click.self="logRecipe = null">
      <div class="log-modal">
        <h3>Log "{{ logRecipe.name }}"</h3>
        <div class="log-form">
          <div class="form-field">
            <label>Meal</label>
            <select v-model="logMealId" class="log-select">
              <option value="" disabled>Select a meal...</option>
              <option v-for="meal in todayMeals" :key="meal.id" :value="meal.id">
                {{ formatMealType(meal.type) }}
              </option>
            </select>
          </div>
          <div class="form-field">
            <label>Scale Factor</label>
            <input v-model.number="logScale" type="number" min="0.1" step="0.1" />
            <span class="form-hint-inline">1.0 = full portion, 0.5 = half</span>
          </div>
        </div>
        <div class="log-actions">
          <button class="btn btn-primary" :disabled="!logMealId || saving" @click="doLog">
            {{ saving ? "Logging..." : "Log Recipe" }}
          </button>
          <button class="btn btn-secondary" @click="logRecipe = null">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm -->
    <div v-if="deleteId" class="confirm-overlay" @click.self="deleteId = null">
      <div class="confirm-modal">
        <p>Delete this recipe?</p>
        <div class="confirm-actions">
          <button class="btn btn-danger" @click="doDeleteRecipe">Delete</button>
          <button class="btn btn-secondary" @click="deleteId = null">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.ts";
import { getMealRecipes, createMealRecipe, deleteMealRecipe, addIngredient, deleteIngredient, logMealRecipe } from "@/services/mealRecipeService.ts";
import { getMealLogs } from "@/services/mealLogService.ts";
import { searchFoods } from "@/services/foodService.ts";
import type { MealRecipe, MealLog, Food, MealType } from "@/types/foodType.ts";

const router = useRouter();
const authStore = useAuthStore();

const recipes = ref<MealRecipe[]>([]);
const todayMeals = ref<MealLog[]>([]);
const loading = ref(false);
const saving = ref(false);

// Create
const showCreate = ref(false);
const newName = ref("");
const newServingSize = ref(1);

// Add ingredient
const addingTo = ref<string | null>(null);
const ingredientSearch = ref("");
const ingredientResults = ref<Food[]>([]);
const selectedIngFood = ref<Food | null>(null);
const ingredientWeight = ref(100);

// Log
const logRecipe = ref<MealRecipe | null>(null);
const logMealId = ref("");
const logScale = ref(1.0);

// Delete
const deleteId = ref<string | null>(null);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function formatMealType(type: MealType): string {
  return type.charAt(0) + type.slice(1).toLowerCase();
}

async function doCreate() {
  if (!newName.value.trim()) return;
  saving.value = true;
  const result = await createMealRecipe({ name: newName.value.trim(), servingSize: newServingSize.value || 1 });
  saving.value = false;
  if (result) {
    recipes.value.unshift(result);
    newName.value = "";
    newServingSize.value = 1;
    showCreate.value = false;
  }
}

function startAddIngredient(recipeId: string) {
  addingTo.value = recipeId;
  ingredientSearch.value = "";
  ingredientResults.value = [];
  selectedIngFood.value = null;
  ingredientWeight.value = 100;
}

function clearIngredientForm() {
  addingTo.value = null;
  selectedIngFood.value = null;
}

function onIngredientSearch() {
  if (debounceTimer) clearTimeout(debounceTimer);
  selectedIngFood.value = null;
  if (ingredientSearch.value.length < 2) {
    ingredientResults.value = [];
    return;
  }
  debounceTimer = setTimeout(async () => {
    ingredientResults.value = await searchFoods(ingredientSearch.value);
  }, 350);
}

function selectIngredientFood(food: Food) {
  selectedIngFood.value = food;
  ingredientResults.value = [];
  ingredientSearch.value = food.name;
}

async function doAddIngredient(recipeId: string) {
  if (!selectedIngFood.value || !ingredientWeight.value) return;
  saving.value = true;
  await addIngredient(recipeId, { foodId: selectedIngFood.value.id, weight_g: ingredientWeight.value });
  saving.value = false;
  // Reload recipes to get updated ingredient list
  await loadRecipes();
  addingTo.value = null;
}

async function doDeleteIngredient(recipeId: string, ingredientId: string) {
  await deleteIngredient(recipeId, ingredientId);
  await loadRecipes();
}

function confirmDelete(id: string) {
  deleteId.value = id;
}

async function doDeleteRecipe() {
  if (!deleteId.value) return;
  await deleteMealRecipe(deleteId.value);
  recipes.value = recipes.value.filter((r) => r.id !== deleteId.value);
  deleteId.value = null;
}

function openLogModal(recipe: MealRecipe) {
  logRecipe.value = recipe;
  logMealId.value = "";
  logScale.value = 1.0;
}

async function doLog() {
  if (!logRecipe.value || !logMealId.value) return;
  saving.value = true;
  await logMealRecipe(logRecipe.value.id, {
    mealLogId: logMealId.value,
    scaleFactor: logScale.value,
  });
  saving.value = false;
  logRecipe.value = null;
}

async function loadRecipes() {
  recipes.value = await getMealRecipes();
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await router.push({ name: "login" });
    return;
  }
  loading.value = true;
  const today = new Date().toISOString().split("T")[0];
  [recipes.value, todayMeals.value] = await Promise.all([
    getMealRecipes(),
    getMealLogs(today),
  ]);
  loading.value = false;
});
</script>

<style scoped>
.recipes-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

h1 { margin-bottom: 20px; }

.loading-state,
.empty-state {
  text-align: center;
  color: var(--text-secondary);
  padding: 48px 0;
}

/* Create */
.create-section { margin-bottom: 24px; }

.toggle-create-btn {
  background: none;
  border: 1px dashed var(--primary);
  color: var(--primary);
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  min-height: 44px;
}

.toggle-create-btn:hover {
  background: rgba(0, 191, 174, 0.08);
}

.create-form {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-top: 12px;
}

.form-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-field.full { flex: 1; }

.form-field label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.form-field input,
.form-field select {
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-main);
  font-size: 0.95rem;
  padding: 10px 12px;
  outline: none;
  transition: border-color 0.2s;
  min-height: 44px;
}

.form-field input:focus,
.form-field select:focus { border-color: var(--primary); }

.form-hint-inline {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Recipe List */
.recipe-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recipe-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
}

.recipe-header {
  padding: 16px 20px;
  background: var(--bg-surface-secondary);
  border-bottom: 1px solid var(--border);
}

.recipe-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.recipe-icon { font-size: 1.2rem; }

.recipe-name {
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--text-main);
}

.recipe-serving {
  font-size: 0.8rem;
  color: var(--text-secondary);
  background: var(--bg-main);
  padding: 2px 8px;
  border-radius: 12px;
}

.recipe-macros {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.macro-badge {
  font-size: 0.78rem;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 600;
}

.macro-badge.kcal { background: rgba(0, 191, 174, 0.15); color: var(--primary); }
.macro-badge.protein { background: rgba(47, 213, 114, 0.15); color: var(--success); }
.macro-badge.carbs { background: rgba(255, 209, 102, 0.15); color: var(--accent); }
.macro-badge.fat { background: rgba(249, 115, 22, 0.15); color: #f97316; }

/* Ingredients */
.ingredients-section {
  padding: 14px 20px;
}

.ingredients-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}

.no-ingredients {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.ingredient-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
}

.ingredient-row:last-of-type { border-bottom: none; }

.ing-name {
  flex: 1;
  font-size: 0.9rem;
  color: var(--text-main);
}

.ing-weight {
  font-size: 0.82rem;
  color: var(--text-secondary);
}

.ing-kcal {
  font-size: 0.82rem;
  color: var(--primary);
  font-weight: 600;
}

.ing-delete {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 4px;
  transition: color 0.15s;
  min-width: 28px;
  min-height: 28px;
}

.ing-delete:hover { color: var(--danger); }

/* Add Ingredient Form */
.add-ingredient-form {
  margin-top: 10px;
}

.ing-search {
  width: 100%;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-main);
  font-size: 0.9rem;
  padding: 8px 12px;
  outline: none;
  box-sizing: border-box;
  min-height: 44px;
}

.ing-search:focus { border-color: var(--primary); }

.ing-results {
  max-height: 160px;
  overflow-y: auto;
  margin-top: 4px;
  border: 1px solid var(--border);
  border-radius: 8px;
}

.ing-result-item {
  padding: 8px 12px;
  font-size: 0.85rem;
  color: var(--text-main);
  cursor: pointer;
  transition: background 0.12s;
}

.ing-result-item:hover {
  background: var(--bg-surface-secondary);
}

.ing-confirm {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.ing-selected-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-main);
}

.ing-weight-input {
  width: 80px;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-main);
  font-size: 0.9rem;
  padding: 6px 10px;
  outline: none;
  min-height: 36px;
}

.add-ing-btn {
  background: none;
  border: 1px dashed var(--border);
  color: var(--text-secondary);
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 0.85rem;
  cursor: pointer;
  margin-top: 10px;
  min-height: 40px;
  transition: border-color 0.15s, color 0.15s;
}

.add-ing-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* Actions */
.recipe-actions {
  display: flex;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid var(--border);
}

/* Buttons */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.15s, transform 0.1s;
  min-height: 44px;
}

.btn.btn-sm {
  padding: 7px 14px;
  font-size: 0.82rem;
  min-height: 36px;
}

.btn:active { transform: scale(0.97); }

.btn-primary { background: var(--primary); color: #fff; }
.btn-primary:hover:not(:disabled) { background: #00a495; }
.btn-primary:disabled { opacity: 0.6; cursor: default; }

.btn-secondary {
  background: var(--bg-surface-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}
.btn-secondary:hover { color: var(--text-main); }

.btn-danger { background: var(--danger); color: #fff; }
.btn-danger:hover { background: #e83f60; }

/* Modals */
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.confirm-modal,
.log-modal {
  background: var(--bg-surface);
  border-radius: 14px;
  padding: 28px;
  min-width: 280px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.confirm-modal { text-align: center; }
.confirm-modal p { color: var(--text-main); margin-bottom: 20px; }
.confirm-actions { display: flex; gap: 12px; justify-content: center; }

.log-modal h3 {
  margin: 0 0 16px;
  color: var(--text-main);
}

.log-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
}

.log-select {
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-main);
  font-size: 0.95rem;
  padding: 10px 12px;
  outline: none;
  min-height: 44px;
}

.log-actions {
  display: flex;
  gap: 12px;
}

@media (max-width: 480px) {
  .form-row {
    flex-direction: column;
  }

  .recipe-actions {
    flex-direction: column;
  }

  .ing-confirm {
    flex-direction: column;
    align-items: stretch;
  }

  .log-actions {
    flex-direction: column;
  }
}
</style>
