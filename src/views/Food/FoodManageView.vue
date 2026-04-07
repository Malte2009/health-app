<template>
  <div class="food-manage">
    <h1>Manage Foods</h1>

    <!-- Search + Filter Row -->
    <div class="toolbar">
      <input
        v-model="searchQuery"
        class="search-input"
        type="text"
        placeholder="Search foods..."
        @input="onSearchInput"
      />
      <div class="filter-toggle">
        <button :class="{ active: filter === 'all' }" @click="setFilter('all')">All Foods</button>
        <button :class="{ active: filter === 'mine' }" @click="setFilter('mine')">My Foods</button>
      </div>
    </div>

    <!-- Create Food Toggle -->
    <div class="create-section">
      <button class="toggle-create-btn" @click="showCreateForm = !showCreateForm">
        {{ showCreateForm ? "▲ Cancel" : "+ Create New Food" }}
      </button>

      <div v-if="showCreateForm" class="create-form">
        <h3>New Food</h3>
        <div class="form-grid">
          <div class="form-field full">
            <label>Name *</label>
            <input v-model="newFood.name" type="text" placeholder="e.g. Chicken Breast" />
          </div>
          <div class="form-field">
            <label>Calories (per 100g) *</label>
            <input v-model.number="newFood.calories_per_100g" type="number" min="0" step="0.1" />
          </div>
          <div class="form-field">
            <label>Protein (g per 100g) *</label>
            <input v-model.number="newFood.protein_g" type="number" min="0" step="0.1" />
          </div>
          <div class="form-field">
            <label>Carbs (g per 100g) *</label>
            <input v-model.number="newFood.carbs_g" type="number" min="0" step="0.1" />
          </div>
          <div class="form-field">
            <label>Fat (g per 100g) *</label>
            <input v-model.number="newFood.fat_g" type="number" min="0" step="0.1" />
          </div>
          <div class="form-field">
            <label>Fiber (g per 100g)</label>
            <input v-model.number="newFood.fiber_g" type="number" min="0" step="0.1" />
          </div>
          <div class="form-field">
            <label>Sugar (g per 100g)</label>
            <input v-model.number="newFood.sugar_g" type="number" min="0" step="0.1" />
          </div>
          <div class="form-field">
            <label>Saturated Fat (g per 100g)</label>
            <input v-model.number="newFood.saturated_fat_g" type="number" min="0" step="0.1" />
          </div>
          <div class="form-field">
            <label>Unsaturated Fat (g per 100g)</label>
            <input v-model.number="newFood.unsaturated_fat_g" type="number" min="0" step="0.1" />
          </div>
          <div class="form-field">
            <label>Salt (g per 100g)</label>
            <input v-model.number="newFood.salt_g" type="number" min="0" step="0.01" />
          </div>
          <div class="form-field">
            <label>Default Amount</label>
            <input v-model.number="newFood.defaultAmount" type="number" min="0" step="0.1" placeholder="e.g. 250" />
          </div>
          <div class="form-field">
            <label>Default Unit</label>
            <select v-model="newFood.defaultUnit">
              <option :value="undefined">None</option>
              <option value="G">g</option>
              <option value="ML">ml</option>
              <option value="PORTION">portion</option>
            </select>
          </div>
          <div class="form-field">
            <label>Density (g/ml)</label>
            <input v-model.number="newFood.density_g_per_ml" type="number" min="0" step="0.001" :disabled="newFood.defaultUnit !== 'ML'" />
          </div>
          <div class="form-field">
            <label>Grams per Portion (g/portion)</label>
            <input v-model.number="newFood.g_per_portion" type="number" min="0" step="0.1" :disabled="newFood.defaultUnit !== 'PORTION'" />
          </div>
        </div>

        <!-- Nutrient Toggle -->
        <button class="nutrient-toggle-btn" @click="showNutrients = !showNutrients">
          {{ showNutrients ? "▲ Hide Micronutrients" : "▼ Add Micronutrients (optional)" }}
        </button>

        <div v-if="showNutrients" class="nutrient-form">
          <div class="nutrient-group">
            <h4>Vitamins</h4>
            <div class="form-grid">
              <div v-for="v in vitamins" :key="v.key" class="form-field">
                <label>{{ v.label }} ({{ v.unit }})</label>
                <input v-model.number="newNutrients[v.key]" type="number" min="0" step="0.01" />
              </div>
            </div>
          </div>
          <div class="nutrient-group">
            <h4>Minerals</h4>
            <div class="form-grid">
              <div v-for="m in minerals" :key="m.key" class="form-field">
                <label>{{ m.label }} ({{ m.unit }})</label>
                <input v-model.number="newNutrients[m.key]" type="number" min="0" step="0.01" />
              </div>
            </div>
          </div>
          <div class="nutrient-group">
            <h4>Fatty Acids</h4>
            <div class="form-grid">
              <div v-for="f in fattyAcids" :key="f.key" class="form-field">
                <label>{{ f.label }} ({{ f.unit }})</label>
                <input v-model.number="newNutrients[f.key]" type="number" min="0" step="0.01" />
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn btn-primary" :disabled="saving" @click="submitCreate">
            {{ saving ? "Saving..." : "Create Food" }}
          </button>
          <span v-if="createError" class="error-msg">{{ createError }}</span>
        </div>
      </div>
    </div>

    <!-- Food List -->
    <div v-if="loadingFoods" class="loading-state">Loading...</div>

    <div v-else-if="displayedFoods.length === 0" class="empty-state">
      {{ searchQuery ? "No foods match your search." : "No foods found." }}
    </div>

    <div v-else class="food-list">
      <div v-for="food in displayedFoods" :key="food.id" class="food-card">
        <div class="food-card-main">
          <div class="food-card-name">{{ food.name }}</div>
          <div class="food-card-macros">
            <span class="macro-badge kcal">{{ food.calories_per_100g }} kcal</span>
            <span class="macro-badge protein">P {{ food.protein_g }}g</span>
            <span class="macro-badge carbs">C {{ food.carbs_g }}g</span>
            <span class="macro-badge fat">F {{ food.fat_g }}g</span>
            <span class="macro-badge fiber">Fi {{ food.fiber_g }}g</span>
            <span class="macro-badge muted">per 100g</span>
          </div>
        </div>

        <div v-if="expandedNutritionId === food.id" class="extended-macros">
          <span v-if="food.sugar_g != null" class="macro-badge sugar">Sugar {{ food.sugar_g }}g</span>
          <span v-if="food.saturated_fat_g != null" class="macro-badge sat-fat">Sat Fat {{ food.saturated_fat_g }}g</span>
          <span v-if="food.unsaturated_fat_g != null" class="macro-badge unsat-fat">Unsat Fat {{ food.unsaturated_fat_g }}g</span>
          <span v-if="food.salt_g != null" class="macro-badge salt">Salt {{ food.salt_g }}g</span>
        </div>

        <div v-if="food.nutrients" class="nutrient-preview">
          <span v-for="n in topNutrients(food)" :key="n.label" class="nutrient-chip">
            {{ n.label }}: {{ n.value }}{{ n.unit }}
          </span>
        </div>

        <div v-if="food.defaultAmount && food.defaultUnit" class="portion-preview">
          Default portion: {{ food.defaultAmount }} {{ food.defaultUnit === "G" ? "g" : food.defaultUnit === "ML" ? "ml" : "portion" }}
          <span v-if="food.defaultUnit === 'ML' && food.density_g_per_ml">(density {{ food.density_g_per_ml }} g/ml)</span>
          <span v-if="food.defaultUnit === 'PORTION' && food.g_per_portion">({{ food.g_per_portion }} g/portion)</span>
        </div>

        <div class="food-card-actions">
          <button
            v-if="editingId !== food.id"
            class="btn btn-secondary btn-sm"
            @click="startEdit(food)"
          >Edit</button>
          <button
            v-if="editingId !== food.id"
            class="btn btn-secondary btn-sm"
            @click="toggleNutritionDetails(food.id)"
          >{{ expandedNutritionId === food.id ? 'Hide details' : 'Show details' }}</button>
          <button
            v-if="editingId !== food.id"
            class="btn btn-danger btn-sm"
            @click="confirmDelete(food.id)"
          >Delete</button>
        </div>

        <!-- Inline Edit Form -->
        <div v-if="editingId === food.id" class="edit-form">
          <div class="form-grid">
            <div class="form-field full">
              <label>Name</label>
              <input v-model="editData.name" type="text" />
            </div>
            <div class="form-field">
              <label>Calories/100g</label>
              <input v-model.number="editData.calories_per_100g" type="number" min="0" step="0.1" />
            </div>
            <div class="form-field">
              <label>Protein (g)</label>
              <input v-model.number="editData.protein_g" type="number" min="0" step="0.1" />
            </div>
            <div class="form-field">
              <label>Carbs (g)</label>
              <input v-model.number="editData.carbs_g" type="number" min="0" step="0.1" />
            </div>
            <div class="form-field">
              <label>Fat (g)</label>
              <input v-model.number="editData.fat_g" type="number" min="0" step="0.1" />
            </div>
            <div class="form-field">
              <label>Fiber (g)</label>
              <input v-model.number="editData.fiber_g" type="number" min="0" step="0.1" />
            </div>
            <div class="form-field">
              <label>Sugar (g)</label>
              <input v-model.number="editData.sugar_g" type="number" min="0" step="0.1" />
            </div>
            <div class="form-field">
              <label>Saturated Fat (g)</label>
              <input v-model.number="editData.saturated_fat_g" type="number" min="0" step="0.1" />
            </div>
            <div class="form-field">
              <label>Unsaturated Fat (g)</label>
              <input v-model.number="editData.unsaturated_fat_g" type="number" min="0" step="0.1" />
            </div>
            <div class="form-field">
              <label>Salt (g)</label>
              <input v-model.number="editData.salt_g" type="number" min="0" step="0.01" />
            </div>
            <div class="form-field">
              <label>Default Amount</label>
              <input v-model.number="editData.defaultAmount" type="number" min="0" step="0.1" />
            </div>
            <div class="form-field">
              <label>Default Unit</label>
              <select v-model="editData.defaultUnit">
                <option :value="undefined">None</option>
                <option value="G">g</option>
                <option value="ML">ml</option>
                <option value="PORTION">portion</option>
              </select>
            </div>
            <div class="form-field">
              <label>Density (g/ml)</label>
              <input v-model.number="editData.density_g_per_ml" type="number" min="0" step="0.001" :disabled="editData.defaultUnit !== 'ML'" />
            </div>
            <div class="form-field">
              <label>Grams per Portion (g/portion)</label>
              <input v-model.number="editData.g_per_portion" type="number" min="0" step="0.1" :disabled="editData.defaultUnit !== 'PORTION'" />
            </div>
          </div>

          <button class="nutrient-toggle-btn" @click="showEditNutrients = !showEditNutrients">
            {{ showEditNutrients ? "▲ Hide Micronutrients" : "▼ Edit Micronutrients" }}
          </button>

          <div v-if="showEditNutrients" class="nutrient-form">
            <div class="nutrient-group">
              <h4>Vitamins</h4>
              <div class="form-grid">
                <div v-for="v in vitamins" :key="v.key" class="form-field">
                  <label>{{ v.label }} ({{ v.unit }})</label>
                  <input v-model.number="editNutrients[v.key]" type="number" min="0" step="0.01" />
                </div>
              </div>
            </div>
            <div class="nutrient-group">
              <h4>Minerals</h4>
              <div class="form-grid">
                <div v-for="m in minerals" :key="m.key" class="form-field">
                  <label>{{ m.label }} ({{ m.unit }})</label>
                  <input v-model.number="editNutrients[m.key]" type="number" min="0" step="0.01" />
                </div>
              </div>
            </div>
            <div class="nutrient-group">
              <h4>Fatty Acids</h4>
              <div class="form-grid">
                <div v-for="f in fattyAcids" :key="f.key" class="form-field">
                  <label>{{ f.label }} ({{ f.unit }})</label>
                  <input v-model.number="editNutrients[f.key]" type="number" min="0" step="0.01" />
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn btn-primary btn-sm" :disabled="saving" @click="submitEdit(food.id)">
              {{ saving ? "Saving..." : "Save" }}
            </button>
            <button class="btn btn-secondary btn-sm" @click="cancelEdit">Cancel</button>
            <span v-if="editError" class="error-msg">{{ editError }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Delete -->
    <div v-if="deleteId" class="confirm-overlay" @click.self="deleteId = null">
      <div class="confirm-modal">
        <p>Delete this food?</p>
        <div class="confirm-actions">
          <button class="btn btn-danger" @click="doDelete">Delete</button>
          <button class="btn btn-secondary" @click="deleteId = null">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { isAuthenticated } from "@/services/authService.ts";
import {
  getFoods,
  getMyFoods,
  searchFoods,
  createFood,
  updateFood,
  deleteFood,
  getFoodNutrients,
  createFoodNutrients,
  updateFoodNutrients,
  deleteFoodNutrients,
} from "@/services/foodService.ts";
import type { Food, CreateFoodRequest, Nutrient, PortionUnit } from "@/types/foodType.ts";

type NutrientValueKey = Exclude<keyof Nutrient, "id" | "foodId">;
type NutrientField = { key: NutrientValueKey; label: string; unit: string };

const router = useRouter();

const foods = ref<Food[]>([]);
const myFoods = ref<Food[]>([]);
const searchResults = ref<Food[]>([]);
const searchQuery = ref("");
const filter = ref<"all" | "mine">("all");
const loadingFoods = ref(false);
const showCreateForm = ref(false);
const showNutrients = ref(false);
const saving = ref(false);
const createError = ref("");
const editError = ref("");
const editingId = ref<string | null>(null);
const deleteId = ref<string | null>(null);
const expandedNutritionId = ref<string | null>(null);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const defaultFood = (): CreateFoodRequest => ({
  name: "",
  calories_per_100g: 0,
  protein_g: 0,
  carbs_g: 0,
  fat_g: 0,
  fiber_g: 0,
  sugar_g: 0,
  saturated_fat_g: 0,
  unsaturated_fat_g: 0,
  salt_g: 0,
});

const newFood = ref<CreateFoodRequest>(defaultFood());
const newNutrients = ref<Partial<Record<NutrientValueKey, number>>>({});
const editData = ref<Partial<CreateFoodRequest>>({});
const editNutrients = ref<Partial<Record<NutrientValueKey, number>>>({});
const showEditNutrients = ref(false);

const displayedFoods = computed<Food[]>(() => {
  if (searchQuery.value.length >= 1) return searchResults.value;
  return filter.value === "mine" ? myFoods.value : foods.value;
});

function setFilter(f: "all" | "mine") {
  filter.value = f;
  searchQuery.value = "";
}

function normalizePortionFields(payload: Partial<CreateFoodRequest>): Partial<CreateFoodRequest> {
  const out = { ...payload };
  const amount = typeof out.defaultAmount === "number" ? out.defaultAmount : undefined;
  const unit = out.defaultUnit as PortionUnit | undefined;
  const density = typeof out.density_g_per_ml === "number" ? out.density_g_per_ml : undefined;
  const gramsPerPortion = typeof out.g_per_portion === "number" ? out.g_per_portion : undefined;

  out.defaultAmount = amount && amount > 0 ? amount : undefined;
  out.defaultUnit = unit;
  out.density_g_per_ml = density && density > 0 ? density : undefined;
  out.g_per_portion = gramsPerPortion && gramsPerPortion > 0 ? gramsPerPortion : undefined;

  if (out.defaultUnit === "ML") {
    out.g_per_portion = undefined;
  } else if (out.defaultUnit === "PORTION") {
    out.density_g_per_ml = undefined;
  } else {
    out.density_g_per_ml = undefined;
    out.g_per_portion = undefined;
  }
  return out;
}

function validatePortionFields(payload: Partial<CreateFoodRequest>): string | null {
  const amount = payload.defaultAmount;
  const unit = payload.defaultUnit;
  const density = payload.density_g_per_ml;
  const gramsPerPortion = payload.g_per_portion;

  if ((amount == null) !== (unit == null)) {
    return "Default amount and unit must be set together.";
  }
  if (unit === "ML" && (density == null || density <= 0)) {
    return "Density (g/ml) is required when default unit is ml.";
  }
  if (unit === "PORTION" && (gramsPerPortion == null || gramsPerPortion <= 0)) {
    return "Grams per portion (g/portion) is required when default unit is portion.";
  }
  return null;
}

function validateFatSplitFields(payload: Partial<CreateFoodRequest>): string | null {
  const saturated = Number(payload.saturated_fat_g ?? 0);
  const unsaturated = Number(payload.unsaturated_fat_g ?? 0);
  const fat = Number(payload.fat_g ?? 0);
  if (saturated + unsaturated > fat + 0.001) {
    return "Saturated fat + unsaturated fat must be less than or equal to total fat.";
  }
  return null;
}

function onSearchInput() {
  if (debounceTimer) clearTimeout(debounceTimer);
  if (searchQuery.value.length < 1) {
    searchResults.value = [];
    return;
  }
  debounceTimer = setTimeout(async () => {
    searchResults.value = await searchFoods(searchQuery.value);
  }, 350);
}

async function startEdit(food: Food) {
  editingId.value = food.id;
  showEditNutrients.value = false;
  editError.value = "";
  editData.value = {
    name: food.name,
    calories_per_100g: food.calories_per_100g,
    protein_g: food.protein_g,
    carbs_g: food.carbs_g,
    fat_g: food.fat_g,
    fiber_g: food.fiber_g,
    sugar_g: food.sugar_g,
    saturated_fat_g: food.saturated_fat_g,
    unsaturated_fat_g: food.unsaturated_fat_g,
    salt_g: food.salt_g,
    defaultAmount: food.defaultAmount,
    defaultUnit: food.defaultUnit,
    density_g_per_ml: food.density_g_per_ml,
    g_per_portion: food.g_per_portion,
  };

  const nutrients = food.nutrients ?? (await getFoodNutrients(food.id));
  editNutrients.value = extractEditableNutrients(nutrients);
}

async function submitCreate() {
  if (!newFood.value.name.trim()) {
    createError.value = "Name is required.";
    return;
  }
  createError.value = "";
  saving.value = true;

  const hasNutrients = Object.values(newNutrients.value).some((v) => v != null && v !== 0);
  const payload = normalizePortionFields({
    ...newFood.value,
    ...(hasNutrients ? { nutrients: newNutrients.value } : {}),
  }) as CreateFoodRequest;

  const portionError = validatePortionFields(payload);
  if (portionError) {
    createError.value = portionError;
    saving.value = false;
    return;
  }
  const fatSplitError = validateFatSplitFields(payload);
  if (fatSplitError) {
    createError.value = fatSplitError;
    saving.value = false;
    return;
  }

  const result = await createFood(payload);
  saving.value = false;
  if (result) {
    foods.value.unshift(result);
    myFoods.value.unshift(result);
    newFood.value = defaultFood();
    newNutrients.value = {};
    showCreateForm.value = false;
    showNutrients.value = false;
  }
}

async function submitEdit(id: string) {
  editError.value = "";
  saving.value = true;
  const foodPayload = normalizePortionFields(editData.value);
  const portionError = validatePortionFields(foodPayload);
  if (portionError) {
    editError.value = portionError;
    saving.value = false;
    return;
  }
  const fatSplitError = validateFatSplitFields(foodPayload);
  if (fatSplitError) {
    editError.value = fatSplitError;
    saving.value = false;
    return;
  }

  const result = await updateFood(id, foodPayload);

  let nextNutrients: Nutrient | undefined;
  const nutrientPayload = sanitizeNutrients(editNutrients.value);
  const hasNutrientValues = Object.keys(nutrientPayload).length > 0;
  const currentFood = foods.value.find((f) => f.id === id) ?? myFoods.value.find((f) => f.id === id);
  const hadNutrients = !!currentFood?.nutrients;

  if (hasNutrientValues) {
    nextNutrients = (await updateFoodNutrients(id, nutrientPayload)) || undefined;
    if (!nextNutrients) {
      nextNutrients = (await createFoodNutrients(id, nutrientPayload)) || undefined;
    }
    if (!nextNutrients) {
      nextNutrients = nutrientPayload as Nutrient;
    }
  } else if (hadNutrients) {
    await deleteFoodNutrients(id);
  }

  saving.value = false;
  if (result) {
    const mergedFood: Food = {
      ...(result as Food),
      nutrients: hasNutrientValues ? nextNutrients : undefined,
    };

    const update = (list: Food[]) => {
      const idx = list.findIndex((f) => f.id === id);
      if (idx !== -1) list[idx] = mergedFood;
    };
    update(foods.value);
    update(myFoods.value);
    editingId.value = null;
    showEditNutrients.value = false;
    editNutrients.value = {};
  }
}

function extractEditableNutrients(nutrients: Nutrient | void): Partial<Record<NutrientValueKey, number>> {
  if (!nutrients) return {};
  const allFields = [...vitamins, ...minerals, ...fattyAcids];
  const source = nutrients as Record<string, unknown>;
  const extracted: Partial<Record<NutrientValueKey, number>> = {};

  for (const field of allFields) {
    const key = field.key as string;
    const camelKey = key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
    const raw = source[key] ?? source[camelKey];
    const value = Number(raw);
    if (Number.isFinite(value) && value >= 0) {
      extracted[field.key] = value;
    }
  }

  return extracted;
}

function sanitizeNutrients(values: Partial<Record<NutrientValueKey, number>>): Partial<Nutrient> {
  const cleaned: Partial<Nutrient> = {};
  for (const [key, value] of Object.entries(values) as [NutrientValueKey, number | undefined][]) {
    if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

function confirmDelete(id: string) {
  deleteId.value = id;
}

function toggleNutritionDetails(id: string) {
  expandedNutritionId.value = expandedNutritionId.value === id ? null : id;
}

function cancelEdit() {
  editingId.value = null;
  showEditNutrients.value = false;
  editNutrients.value = {};
  editError.value = "";
}

async function doDelete() {
  if (!deleteId.value) return;
  await deleteFood(deleteId.value);
  const id = deleteId.value;
  foods.value = foods.value.filter((f) => f.id !== id);
  myFoods.value = myFoods.value.filter((f) => f.id !== id);
  deleteId.value = null;
}

function topNutrients(food: Food): { label: string; value: number; unit: string }[] {
  if (!food.nutrients) return [];
  const map: NutrientField[] = [
    { key: "vitamin_c", label: "Vit C", unit: "mg" },
    { key: "caffeine", label: "Caffeine", unit: "mg" },
    { key: "iron", label: "Iron", unit: "mg" },
    { key: "calcium", label: "Ca", unit: "mg" },
    { key: "omega_3", label: "ω3", unit: "mg" },
  ];
  return map
    .map((n) => ({ ...n, value: food.nutrients?.[n.key] }))
    .filter((n): n is NutrientField & { value: number } => typeof n.value === "number" && n.value > 0)
    .map((n) => ({ label: n.label, value: n.value, unit: n.unit }))
    .slice(0, 4);
}

onMounted(async () => {
  if (!(await isAuthenticated())) {
    await router.push({ name: "login" });
    return;
  }
  loadingFoods.value = true;
  [foods.value, myFoods.value] = await Promise.all([getFoods(), getMyFoods()]);
  loadingFoods.value = false;
});

// Nutrient definitions (shared)
const vitamins: NutrientField[] = [
  { key: "vitamin_a", label: "Vitamin A", unit: "µg" },
  { key: "vitamin_d", label: "Vitamin D", unit: "µg" },
  { key: "vitamin_e", label: "Vitamin E", unit: "mg" },
  { key: "vitamin_k", label: "Vitamin K", unit: "µg" },
  { key: "vitamin_c", label: "Vitamin C", unit: "mg" },
  { key: "vitamin_b1", label: "B1 Thiamine", unit: "mg" },
  { key: "vitamin_b2", label: "B2 Riboflavin", unit: "mg" },
  { key: "vitamin_b3", label: "B3 Niacin", unit: "mg" },
  { key: "vitamin_b5", label: "B5 Pantothenic", unit: "mg" },
  { key: "vitamin_b6", label: "B6", unit: "mg" },
  { key: "vitamin_b7", label: "B7 Biotin", unit: "µg" },
  { key: "vitamin_b9", label: "B9 Folate", unit: "µg" },
  { key: "vitamin_b12", label: "B12", unit: "µg" },
  { key: "choline", label: "Choline", unit: "mg" },
  { key: "caffeine", label: "Caffeine", unit: "mg" },
];

const minerals: NutrientField[] = [
  { key: "calcium", label: "Calcium", unit: "mg" },
  { key: "phosphorus", label: "Phosphorus", unit: "mg" },
  { key: "magnesium", label: "Magnesium", unit: "mg" },
  { key: "sodium", label: "Sodium", unit: "mg" },
  { key: "potassium", label: "Potassium", unit: "mg" },
  { key: "chloride", label: "Chloride", unit: "mg" },
  { key: "sulfur", label: "Sulfur", unit: "mg" },
  { key: "iron", label: "Iron", unit: "mg" },
  { key: "zinc", label: "Zinc", unit: "mg" },
  { key: "selenium", label: "Selenium", unit: "µg" },
  { key: "iodine", label: "Iodine", unit: "µg" },
  { key: "copper", label: "Copper", unit: "mg" },
  { key: "manganese", label: "Manganese", unit: "mg" },
  { key: "chromium", label: "Chromium", unit: "µg" },
  { key: "molybdenum", label: "Molybdenum", unit: "µg" },
  { key: "fluoride", label: "Fluoride", unit: "mcg" },
];

const fattyAcids: NutrientField[] = [
  { key: "omega_3", label: "Omega-3", unit: "mg" },
  { key: "omega_6", label: "Omega-6", unit: "mg" },
  { key: "omega_9", label: "Omega-9", unit: "mg" },
];
</script>

<style scoped>
.food-manage {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

h1 {
  margin-bottom: 20px;
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-main);
  font-size: 1rem;
  padding: 10px 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: var(--primary);
}

.filter-toggle {
  display: flex;
  gap: 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.filter-toggle button {
  background: var(--bg-surface);
  border: none;
  color: var(--text-secondary);
  padding: 10px 18px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.filter-toggle button:first-child {
  border-right: 1px solid var(--border);
}

.filter-toggle button.active {
  background: var(--bg-surface-secondary);
  color: var(--primary);
}

/* Create Section */
.create-section {
  margin-bottom: 24px;
}

.toggle-create-btn {
  background: none;
  border: 1px dashed var(--primary);
  color: var(--primary);
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
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

.create-form h3 {
  margin: 0 0 16px;
  color: var(--text-main);
  font-size: 1.05rem;
}

/* Form Layout */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-field.full {
  grid-column: 1 / -1;
}

.form-field label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.form-field input {
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 7px;
  color: var(--text-main);
  font-size: 0.95rem;
  padding: 8px 12px;
  outline: none;
  transition: border-color 0.2s;
}

.form-field select {
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 7px;
  color: var(--text-main);
  font-size: 0.95rem;
  padding: 8px 12px;
  outline: none;
  transition: border-color 0.2s;
}

.form-field input:focus,
.form-field select:focus {
  border-color: var(--primary);
}

.nutrient-toggle-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  border-radius: 7px;
  padding: 8px 16px;
  font-size: 0.85rem;
  cursor: pointer;
  margin-bottom: 12px;
  transition: color 0.15s;
}

.nutrient-toggle-btn:hover {
  color: var(--text-main);
}

.nutrient-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.nutrient-group h4 {
  margin: 0 0 10px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.form-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.error-msg {
  color: var(--danger);
  font-size: 0.85rem;
}

/* Food List */
.loading-state,
.empty-state {
  text-align: center;
  color: var(--text-secondary);
  padding: 40px 0;
}

.food-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.food-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 20px;
}

.food-card-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.food-card-name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-main);
  flex: 1;
}

.food-card-macros {
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

.macro-badge.kcal {
  background: rgba(0, 191, 174, 0.15);
  color: var(--primary);
}

.macro-badge.protein {
  background: rgba(47, 213, 114, 0.15);
  color: var(--success);
}

.macro-badge.carbs {
  background: rgba(255, 209, 102, 0.15);
  color: var(--accent);
}

.macro-badge.fat {
  background: rgba(249, 115, 22, 0.15);
  color: #f97316;
}

.macro-badge.fiber {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
}

.macro-badge.sugar {
  background: rgba(255, 95, 109, 0.15);
  color: #ff5f6d;
}

.macro-badge.sat-fat {
  background: rgba(251, 146, 60, 0.2);
  color: #ea580c;
}

.macro-badge.unsat-fat {
  background: rgba(234, 179, 8, 0.2);
  color: #ca8a04;
}

.macro-badge.salt {
  background: rgba(148, 163, 184, 0.2);
  color: #64748b;
}

.macro-badge.muted {
  background: transparent;
  color: var(--text-secondary);
  font-weight: 400;
}

.nutrient-preview {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.nutrient-chip {
  font-size: 0.75rem;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2px 8px;
  color: var(--text-secondary);
}

.portion-preview {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.food-card-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.extended-macros {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.edit-form {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}

/* Buttons */
.btn {
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.15s, transform 0.1s;
}

.btn:active {
  transform: scale(0.97);
}

.btn.btn-sm {
  padding: 5px 12px;
  font-size: 0.82rem;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #00a495;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: default;
}

.btn-secondary {
  background: var(--bg-surface-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  color: var(--text-main);
}

.btn-danger {
  background: var(--danger);
  color: #fff;
}

.btn-danger:hover {
  background: #e83f60;
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
  border-radius: 12px;
  padding: 24px;
  min-width: 280px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.confirm-modal p {
  color: var(--text-main);
  margin-bottom: 20px;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
