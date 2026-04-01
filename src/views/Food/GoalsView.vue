<template>
  <div class="goals-view">
    <h1>Nutrition Goals</h1>

    <div v-if="loading" class="loading-state">Loading...</div>

    <div v-else class="goals-content">
      <div v-if="!hasGoals && !editing" class="no-goals">
        <div class="no-goals-icon">&#127919;</div>
        <p>No goals set yet.</p>
        <p class="no-goals-desc">Set daily macro goals to track your progress on the dashboard.</p>
        <button class="btn btn-primary" @click="startEditing">Set Goals</button>
      </div>

      <!-- Display current goals -->
      <div v-if="hasGoals && !editing" class="goals-display">
        <div class="goals-grid">
          <div v-if="goals.calories" class="goal-card">
            <div class="goal-value primary-color">{{ goals.calories }}</div>
            <div class="goal-label">Calories (kcal)</div>
          </div>
          <div v-if="goals.protein_g" class="goal-card">
            <div class="goal-value success-color">{{ goals.protein_g }}g</div>
            <div class="goal-label">Protein</div>
          </div>
          <div v-if="goals.carbs_g" class="goal-card">
            <div class="goal-value accent-color">{{ goals.carbs_g }}g</div>
            <div class="goal-label">Carbs</div>
          </div>
          <div v-if="goals.fat_g" class="goal-card">
            <div class="goal-value fat-color">{{ goals.fat_g }}g</div>
            <div class="goal-label">Fat</div>
          </div>
          <div v-if="goals.fiber_g" class="goal-card">
            <div class="goal-value fiber-color">{{ goals.fiber_g }}g</div>
            <div class="goal-label">Fiber</div>
          </div>
        </div>

        <div class="goals-actions">
          <button class="btn btn-secondary" @click="startEditing">Edit Goals</button>
          <button class="btn btn-danger-outline" @click="showDeleteConfirm = true">Remove Goals</button>
        </div>
      </div>

      <!-- Edit / Create form -->
      <div v-if="editing" class="goals-form">
        <h2>{{ hasGoals ? 'Edit Goals' : 'Set Goals' }}</h2>
        <p class="form-hint">Leave fields empty or at 0 to not track that macro.</p>

        <div class="form-grid">
          <div class="form-field">
            <label>Calories (kcal)</label>
            <input v-model.number="form.calories" type="number" min="0" step="50" placeholder="e.g. 2000" />
          </div>
          <div class="form-field">
            <label>Protein (g)</label>
            <input v-model.number="form.protein_g" type="number" min="0" step="5" placeholder="e.g. 150" />
          </div>
          <div class="form-field">
            <label>Carbs (g)</label>
            <input v-model.number="form.carbs_g" type="number" min="0" step="5" placeholder="e.g. 250" />
          </div>
          <div class="form-field">
            <label>Fat (g)</label>
            <input v-model.number="form.fat_g" type="number" min="0" step="5" placeholder="e.g. 70" />
          </div>
          <div class="form-field">
            <label>Fiber (g)</label>
            <input v-model.number="form.fiber_g" type="number" min="0" step="1" placeholder="e.g. 30" />
          </div>
        </div>

        <div class="form-actions">
          <button class="btn btn-primary" :disabled="saving" @click="saveGoals">
            {{ saving ? 'Saving...' : 'Save Goals' }}
          </button>
          <button class="btn btn-secondary" @click="cancelEdit">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm -->
    <div v-if="showDeleteConfirm" class="confirm-overlay" @click.self="showDeleteConfirm = false">
      <div class="confirm-modal">
        <p>Remove all nutrition goals?</p>
        <div class="confirm-actions">
          <button class="btn btn-danger" @click="doDelete">Remove</button>
          <button class="btn btn-secondary" @click="showDeleteConfirm = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.ts";
import { getGoals, createGoals, updateGoals, deleteGoals } from "@/services/goalService.ts";
import type { UserGoals } from "@/types/foodType.ts";

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const saving = ref(false);
const editing = ref(false);
const showDeleteConfirm = ref(false);
const goals = ref<UserGoals>({});

const hasGoals = computed(() => goals.value?.calories || goals.value?.protein_g || goals.value?.carbs_g || goals.value?.fat_g || goals.value?.fiber_g);

const form = ref<Partial<UserGoals>>({});

function startEditing() {
  form.value = {
    calories: goals.value.calories ?? 0,
    protein_g: goals.value.protein_g ?? 0,
    carbs_g: goals.value.carbs_g ?? 0,
    fat_g: goals.value.fat_g ?? 0,
    fiber_g: goals.value.fiber_g ?? 0,
  };
  editing.value = true;
}

function cancelEdit() {
  editing.value = false;
}

async function saveGoals() {
  saving.value = true;
  const payload = {
    calories: form.value.calories || undefined,
    protein_g: form.value.protein_g || undefined,
    carbs_g: form.value.carbs_g || undefined,
    fat_g: form.value.fat_g || undefined,
    fiber_g: form.value.fiber_g || undefined,
  };

  let result;
  if (hasGoals.value) {
    result = await updateGoals(payload);
  } else {
    result = await createGoals(payload);
  }
  saving.value = false;

  if (result) {
    goals.value = result;
    editing.value = false;
  }
}

async function doDelete() {
  await deleteGoals();
  goals.value = {};
  showDeleteConfirm.value = false;
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await router.push({ name: "login" });
    return;
  }
  loading.value = true;
  const data = await getGoals();
  if (data) goals.value = data;
  loading.value = false;
});
</script>

<style scoped>
.goals-view {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

h1 { margin-bottom: 24px; }

.loading-state {
  text-align: center;
  color: var(--text-secondary);
  padding: 60px 0;
}

.no-goals {
  text-align: center;
  background: var(--bg-surface);
  border: 1px dashed var(--border);
  border-radius: 16px;
  padding: 48px 24px;
}

.no-goals-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.no-goals p {
  color: var(--text-main);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px;
}

.no-goals-desc {
  color: var(--text-secondary) !important;
  font-size: 0.9rem !important;
  font-weight: 400 !important;
  margin-bottom: 20px !important;
}

/* Goals Display */
.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
}

.goal-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px 16px;
  text-align: center;
}

.goal-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-main);
}

.goal-label {
  font-size: 0.82rem;
  color: var(--text-secondary);
  margin-top: 4px;
}

.primary-color { color: var(--primary); }
.success-color { color: var(--success); }
.accent-color { color: var(--accent); }
.fat-color { color: #f97316; }
.fiber-color { color: #38bdf8; }

.goals-actions {
  display: flex;
  gap: 12px;
}

/* Form */
.goals-form {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
}

.goals-form h2 {
  margin: 0 0 4px;
  font-size: 1.2rem;
}

.form-hint {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin: 0 0 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-field label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.form-field input {
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-main);
  font-size: 1.1rem;
  padding: 10px 12px;
  outline: none;
  transition: border-color 0.2s;
}

.form-field input:focus {
  border-color: var(--primary);
}

.form-actions {
  display: flex;
  gap: 12px;
}

/* Buttons */
.btn {
  padding: 10px 22px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: background 0.15s, transform 0.1s;
  min-height: 44px;
}

.btn:active { transform: scale(0.97); }

.btn-primary {
  background: var(--primary);
  color: #fff;
}

.btn-primary:hover:not(:disabled) { background: #00a495; }
.btn-primary:disabled { opacity: 0.6; cursor: default; }

.btn-secondary {
  background: var(--bg-surface-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.btn-secondary:hover { color: var(--text-main); }

.btn-danger {
  background: var(--danger);
  color: #fff;
}

.btn-danger:hover { background: #e83f60; }

.btn-danger-outline {
  background: none;
  border: 1px solid var(--danger);
  color: var(--danger);
}

.btn-danger-outline:hover {
  background: rgba(255, 100, 124, 0.1);
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
  padding: 28px;
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

@media (max-width: 480px) {
  .goals-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .goals-actions,
  .form-actions {
    flex-direction: column;
  }
}
</style>
