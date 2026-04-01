<template>
  <div class="exercise-view-container">
    <h1>Exercise View</h1>

    <table class="exercise-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="5">
            <button class="button" @click="router.push({ name: 'createExercise' })">Add New Exercise</button>
          </td>
        </tr>
        <tr v-for="exercise in exercises" :key="exercise.name">
          <td>{{ exercise.name }}</td>
          <td>
            <button class="button button-primary" @click="router.push({ name: 'exerciseDetails', params: { name: exercise.name } })">View</button>
            <button class="button button-secondary" @click="router.push({ name: 'editExercise', params: { name: exercise.name } })">Edit</button>
            <button
              class="button button-danger"
              @click="
                showConfirmDelete = true;
                deleteExerciseName = exercise.name;
              "
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import { onMounted, ref } from "vue";
import type { exerciseType } from "@/types/exerciseType.ts";
import { getExercises } from "@/services/exerciseService.ts";
import { useExerciseStore } from "@/stores/exerciseStore.ts";

const exerciseStore = useExerciseStore();

const exercises = ref([] as exerciseType[]);

const showConfirmDelete = ref(false);
const deleteExerciseName = ref<string>("");

onMounted(async () => {
  const exerciseData = await getExercises();

  if (exerciseData) {
    exercises.value = exerciseData;
    exerciseStore.setExercises(exerciseData);
  }
});
</script>

<style scoped>
.exercise-table {
  width: fit-content;
  border-collapse: collapse;
  margin-top: 20px;
  text-align: center;
  background: var(--bg-surface);
}

.exercise-table td {
  padding: 10px;
  border: 1px solid var(--border);
}

.exercise-table th {
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
  margin: 4px;
}

.button-primary {
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
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.button-secondary:hover {
  background-color: var(--bg-surface);
  color: var(--text-main);
}

.button-danger {
  background-color: var(--danger);
  box-shadow: 0 2px 5px rgba(232, 63, 96, 0.2);
  color: var(--text-main);
}

.button-danger:hover {
  background-color: #e83f60;
}

.modal-content {
  background-color: var(--bg-surface);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

#confirmDeleteModal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
