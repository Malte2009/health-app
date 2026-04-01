<template>
  <div class="home-view">
    <div class="home-header">
      <h1 class="home-title">Health Tracker</h1>
      <p class="home-subtitle">Choose a section to get started</p>
    </div>

    <div class="section-cards">
      <div class="section-card training-card" @click="goToSection('training')">
        <div class="card-icon">&#127947;</div>
        <div class="card-content">
          <h2 class="card-title">Training</h2>
          <p class="card-desc">Track workouts, exercises, body measurements, and progression over time</p>
        </div>
        <div class="card-features">
          <span class="feature-chip">Workouts</span>
          <span class="feature-chip">Exercises</span>
          <span class="feature-chip">Body Logs</span>
          <span class="feature-chip">Progression</span>
        </div>
        <div class="card-arrow">&#8594;</div>
      </div>

      <div class="section-card nutrition-card" @click="goToSection('food')">
        <div class="card-icon">&#129367;</div>
        <div class="card-content">
          <h2 class="card-title">Nutrition</h2>
          <p class="card-desc">Log meals, track macros & micronutrients, manage recipes, and set goals</p>
        </div>
        <div class="card-features">
          <span class="feature-chip">Meal Logging</span>
          <span class="feature-chip">Macros</span>
          <span class="feature-chip">Recipes</span>
          <span class="feature-chip">Goals</span>
        </div>
        <div class="card-arrow">&#8594;</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { isAuthenticated } from "@/services/authService.ts";

const router = useRouter();

function goToSection(section: string) {
  localStorage.setItem("lastSection", section);
  router.push({ name: section });
}

onMounted(async () => {
  if (!(await isAuthenticated())) {
    await router.push({ name: "login" });
    return;
  }
  // Redirect to last visited section
  const lastRoute = localStorage.getItem("lastRoute");
  if (lastRoute) {
    router.push({ name: lastRoute }).catch(() => {});
  }
});
</script>

<style scoped>
.home-view {
  min-height: calc(100vh - 20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.home-header {
  text-align: center;
  margin-bottom: 40px;
}

.home-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0 0 8px;
}

.home-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
}

.section-cards {
  display: flex;
  gap: 24px;
  max-width: 800px;
  width: 100%;
}

.section-card {
  flex: 1;
  background: var(--bg-surface);
  border: 2px solid var(--border);
  border-radius: 20px;
  padding: 32px 28px;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  overflow: hidden;
}

.section-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 20px 20px 0 0;
}

.training-card::before {
  background: linear-gradient(90deg, #90caf9, #42a5f5);
}

.nutrition-card::before {
  background: linear-gradient(90deg, var(--accent), #f97316);
}

.training-card:hover {
  border-color: #42a5f5;
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(66, 165, 245, 0.15);
}

.nutrition-card:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(255, 209, 102, 0.15);
}

.card-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.card-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-main);
}

.card-desc {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.card-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.feature-chip {
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: 20px;
  background: var(--bg-surface-secondary);
  color: var(--text-secondary);
  font-weight: 500;
}

.training-card:hover .feature-chip {
  background: rgba(66, 165, 245, 0.12);
  color: #90caf9;
}

.nutrition-card:hover .feature-chip {
  background: rgba(255, 209, 102, 0.12);
  color: var(--accent);
}

.card-arrow {
  align-self: flex-end;
  font-size: 1.5rem;
  color: var(--text-secondary);
  transition: transform 0.2s, color 0.2s;
}

.section-card:hover .card-arrow {
  transform: translateX(4px);
}

.training-card:hover .card-arrow {
  color: #42a5f5;
}

.nutrition-card:hover .card-arrow {
  color: var(--accent);
}

/* Mobile */
@media (max-width: 640px) {
  .home-view {
    justify-content: flex-start;
    padding-top: 48px;
  }

  .home-title {
    font-size: 1.6rem;
  }

  .section-cards {
    flex-direction: column;
    gap: 16px;
  }

  .section-card {
    padding: 24px 20px;
  }

  .card-icon {
    font-size: 2rem;
  }

  .card-title {
    font-size: 1.25rem;
  }
}
</style>
