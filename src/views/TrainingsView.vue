<template>
  <div class="trainings-view">
    <h1>Trainings</h1>

    <table class="trainings-table">
      <thead>
        <tr>
          <th>Training ID</th>
          <th>Date</th>
          <th>Time</th>
          <th>Type</th>
          <th>Duration (min)</th>
          <th>Avg Heart Rate (bpm)</th>
          <th>Burned Calories</th>
          <th>Notes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="training in trainings" :key="training.id">
          <td>{{ training.id }}</td>
          <td>{{ training.date }}</td>
          <td>{{ training.time }}</td>
          <td>{{ training.type }}</td>
          <td>{{ training.durationMinutes }}</td>
          <td>{{ training.avgHeartRate }}</td>
          <td>{{ training.caloriesBurned }}</td>
          <td>{{ training.notes }}</td>
          <td>
            <button
              class="button"
              @click="router.push({ name: 'training', params: { id: training.id } })"
            >
              View
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="9">
            <button class="button" @click="router.push({ name: 'create-training' })">
              Create New Training
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth.ts";
import { useTrainingStore } from "@/stores/training.ts";
import type { getTrainingResponseType } from "@/types/trainingType.ts";
import { getTrainings } from "@/services/trainingService.ts";

const authStore = useAuthStore();
const trainingStore = useTrainingStore();

const router = useRouter();

const trainings = ref([] as getTrainingResponseType[]);

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await router.push({ name: "login" });
  } else {
    trainings.value = await getTrainings();
  }

  console.log(trainings);
});
</script>

<style scoped>
.trainings-table {
  width: fit-content;
  border-collapse: collapse;
  margin-top: 20px;
  text-align: center;
  background: var(--bg-surface);
}

.trainings-table td {
  padding: 10px;
  border: 1px solid var(--border);
}

.trainings-table th {
  padding: 10px;
  border: 1px solid var(--border);
  background-color: var(--bg-surface-secondary);
}

.button {
  background-color: var(--primary);
  color: var(--text-main);
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition:
    background-color 0.2s,
    transform 0.1s;
  box-shadow: 0 2px 5px rgba(0, 191, 174, 0.2);
}

.button:hover {
  background-color: #00a495; /* etwas dunklerer Ton von --primary */
}

.button:active {
  transform: scale(0.97);
}

.button-secondary {
  background-color: var(--bg-surface-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.button-secondary:hover {
  background-color: var(--bg-surface);
  color: var(--text-main);
}

.button-danger {
  background-color: var(--danger);
  color: var(--text-main);
}

.button-danger:hover {
  background-color: #e0556f;
}
</style>
