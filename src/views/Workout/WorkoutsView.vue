<template>
  <div class="workouts-view">
    <h1>Workouts</h1>

    <table class="workouts-table">
      <thead>
        <tr>
          <th v-if="!isMobile">Workout ID</th>
          <th>Date</th>
          <th>Name</th>
          <th>Type</th>
          <th>Duration (min)</th>
          <th>Avg Heart Rate (bpm)</th>
          <th>Burned Calories</th>
          <th>Notes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="9">
            <button class="button" @click="router.push({ name: 'createWorkout' })">Create New Workout</button>
          </td>
        </tr>
        <tr v-for="workout in workouts" :key="workout.id">
          <td v-if="!isMobile">{{ workout.id }}</td>
          <td>{{ getDateString(workout.createdAt) }}</td>
          <td>{{ workout.name }}</td>
          <td>{{ workout.type }}</td>
          <td>{{ workout.duration || "" }}</td>
          <td>{{ workout.avgHeartRate || "" }}</td>
          <td>{{ workout.caloriesBurned || "" }}</td>
          <td>{{ workout.notes || "" }}</td>
          <td>
            <button class="button button-primary" @click="router.push({ name: 'workoutDetails', params: { id: workout.id } })">View</button>
            <button class="button button-secondary" @click="router.push({ name: 'editWorkout', params: { id: workout.id } })">Edit</button>
            <button
              class="button button-danger"
              @click="
                showConfirmDelete = true;
                deleteWorkoutId = workout.id;
              "
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="showConfirmDelete" id="confirmDeleteModal" class="modal">
      <div class="modal-content">
        <p>Are you sure you want to delete this workout?</p>
        <button class="button button-danger" @click="confirmDelete(deleteWorkoutId)">Delete</button>
        <button class="button button-secondary" @click="cancelDelete()">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import type { Workout } from "@/types/workout/workout.type.ts";
import WorkoutService from "@/services/workout/workout.service";
import { useWorkoutStore } from "@/stores/workoutStore.ts";
import { getDateString } from "@/utility/date.ts";
import { isAuthenticated } from "@/services/authService.ts";

const isMobile = window.innerWidth <= 768;
const showConfirmDelete = ref(false);
const deleteWorkoutId = ref<string>("");
const router = useRouter();
const workoutsStore = useWorkoutStore();
const workouts = ref([] as Workout[]);

async function confirmDelete(id: string) {
  try {
    await WorkoutService.deleteWorkout(id);
    workouts.value = workouts.value.filter((workout) => workout.id !== id);
  } catch (error) {
    console.error("Error deleting workout:", error);
  }

  showConfirmDelete.value = false;
  deleteWorkoutId.value = "";
}

function cancelDelete() {
  showConfirmDelete.value = false;
  deleteWorkoutId.value = "";
}

onMounted(async () => {
  if (await isAuthenticated()) {
    workouts.value = await WorkoutService.getWorkouts(false, false);
    workoutsStore.setWorkouts(workouts.value);
  } else {
    await router.push({ name: "login" });
  }
});
</script>

<style scoped>
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

.workouts-table {
  width: fit-content;
  border-collapse: collapse;
  margin-top: 20px;
  text-align: center;
  background: var(--bg-surface);
}

.workouts-table td {
  padding: 10px;
  border: 1px solid var(--border);
}

.workouts-table th {
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
</style>
