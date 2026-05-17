<template>
  <div v-if="currentSection" class="navbar">
    <div class="nav-inner">
      <button class="home-btn" title="Back to sections" @click="goHome">
        <span class="home-icon">&#9776;</span>
      </button>

      <div :class="['section-pill', currentSection]">
        {{ currentSection === 'training' ? 'Training' : currentSection === 'food' ? 'Nutrition' : 'Health' }}
      </div>

      <div class="nav-scroll">
        <template v-if="currentSection === 'training'">
          <button :class="{ active: route.name === 'progression' }" @click="router.push({ name: 'progression' })">Progression</button>
          <button :class="{ active: route.name === 'training' || route.name === 'trainingDetails' || route.name === 'editTraining' || route.name === 'createTraining' }" @click="router.push({ name: 'training' })">Trainings</button>
          <button :class="{ active: route.name === 'body' || route.name === 'createBodyLog' || route.name === 'editBodyLog' }" @click="router.push({ name: 'body' })">Body</button>
        </template>

        <template v-if="currentSection === 'food'">
          <button :class="{ 'active-food': route.name === 'food' }" @click="router.push({ name: 'food' })">Dashboard</button>
          <button :class="{ 'active-food': route.name === 'foodProgress' }" @click="router.push({ name: 'foodProgress' })">Progress</button>
          <button :class="{ 'active-food': route.name === 'foodManage' }" @click="router.push({ name: 'foodManage' })">Foods</button>
          <button :class="{ 'active-food': route.name === 'foodRecipes' }" @click="router.push({ name: 'foodRecipes' })">Recipes</button>
          <button :class="{ 'active-food': route.name === 'foodGoals' }" @click="router.push({ name: 'foodGoals' })">Goals</button>
        </template>

        <template v-if="currentSection === 'health'">
          <button :class="{ 'active-health': route.name === 'daily-tracking' }" @click="router.push({ name: 'daily-tracking' })">Daily</button>
          <button :class="{ 'active-health': route.name === 'intake-log' }" @click="router.push({ name: 'intake-log' })">Intake</button>
          <button :class="{ 'active-health': route.name === 'sleep-tracker' }" @click="router.push({ name: 'sleep-tracker' })">Sleep</button>
          <button :class="{ 'active-health': route.name === 'vitals' }" @click="router.push({ name: 'vitals' })">Vitals</button>
          <button :class="{ 'active-health': route.name === 'hrv' }" @click="router.push({ name: 'hrv' })">HRV</button>
          <button :class="{ 'active-health': route.name === 'symptoms' }" @click="router.push({ name: 'symptoms' })">Symptoms</button>
          <button :class="{ 'active-health': route.name === 'mcas' }" @click="router.push({ name: 'mcas' })">MCAS</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const TRAINING_ROUTES = new Set([
  "progression", "training", "trainingDetails", "editTraining", "createTraining",
  "body", "createBodyLog", "editBodyLog",
  "exercise", "exerciseDetails", "editExercise",
]);

const FOOD_ROUTES = new Set([
  "food", "foodProgress", "foodManage", "foodRecipes", "foodGoals",
]);

const HEALTH_ROUTES = new Set([
  "daily-tracking", "intake-log", "sleep-tracker", "vitals", "hrv", "symptoms", "mcas",
]);

function goHome() {
  localStorage.removeItem("lastRoute");
  router.push({ name: "home" });
}

const currentSection = computed<"training" | "food" | "health" | null>(() => {
  const name = route.name as string;
  if (TRAINING_ROUTES.has(name)) return "training";
  if (FOOD_ROUTES.has(name)) return "food";
  if (HEALTH_ROUTES.has(name)) return "health";
  return null;
});
</script>

<style scoped>
.navbar {
  width: 100%;
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 52px;
  max-width: 1100px;
  margin: 0 auto;
}

.home-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}

.home-btn:hover {
  background: var(--bg-surface-secondary);
  color: var(--text-main);
}

.section-pill {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 10px;
  border-radius: 20px;
  flex-shrink: 0;
  user-select: none;
}

.section-pill.training {
  background: rgba(66, 165, 245, 0.12);
  color: #90caf9;
}

.section-pill.food {
  background: rgba(255, 209, 102, 0.12);
  color: var(--accent);
}

.section-pill.health {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

.nav-scroll {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  flex: 1;
  padding: 4px 0;
}

.nav-scroll::-webkit-scrollbar {
  display: none;
}

.nav-scroll button {
  background: #32363a;
  color: #e0e0e0;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 14px;
  height: 34px;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  outline: none;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 44px;
}

.nav-scroll button:hover {
  background: #3d4347;
}

/* Training active */
.active {
  background: #1c2839 !important;
  color: #90caf9 !important;
  box-shadow: 0 2px 8px 0 rgba(70, 130, 230, 0.18) !important;
}

/* Food active */
.active-food {
  background: #2a2418 !important;
  color: var(--accent) !important;
  box-shadow: 0 2px 8px 0 rgba(255, 209, 102, 0.2) !important;
}

/* Health active */
.active-health {
  background: #2e1c1c !important;
  color: #ef4444 !important;
  box-shadow: 0 2px 8px 0 rgba(239, 68, 68, 0.2) !important;
}

@media (max-width: 640px) {
  .nav-inner {
    padding: 0 8px;
    height: 48px;
    gap: 6px;
  }

  .section-pill {
    font-size: 0.6rem;
    padding: 3px 8px;
  }

  .nav-scroll button {
    font-size: 0.78rem;
    padding: 5px 10px;
    height: 30px;
  }

  .home-btn {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
}
</style>
