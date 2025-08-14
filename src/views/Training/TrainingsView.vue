<template>
  <div class="trainings-view">
    <h1>Trainings</h1>

    <table class="trainings-table">
      <thead>
        <tr>
          <th v-if="!isMobile">Training ID</th>
          <th>Date</th>
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
            <button class="button" @click="router.push({ name: 'createTraining' })">Create New Training</button>
          </td>
        </tr>
        <tr v-for="training in trainings" :key="training.id">
          <td v-if="!isMobile">{{ training.id }}</td>
          <td>{{ getDateString(training.createdAt) }}</td>
          <td>{{ training.type }}</td>
          <td>{{ training.duration || "" }}</td>
          <td>{{ training.avgHeartRate || "" }}</td>
          <td>{{ training.caloriesBurned || "" }}</td>
          <td>{{ training.notes || "" }}</td>
          <td>
            <button class="button button-primary" @click="router.push({ name: 'training', params: { id: training.id } })">View</button>
            <button class="button button-secondary" @click="router.push({ name: 'editTraining', params: { id: training.id } })">Edit</button>
            <button
              class="button button-danger"
              @click="
                showConfirmDelete = true;
                deleteTrainingId = training.id;
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
        <p>Are you sure you want to delete this training?</p>
        <button class="button button-danger" @click="confirmDelete(deleteTrainingId)">Delete</button>
        <button class="button button-secondary" @click="cancelDelete()">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import type { getTrainingResponseType } from "@/types/trainingType.ts";
import { deleteTrainingRequest, getTrainings } from "@/services/trainingService.ts";
import { useTrainingStore } from "@/stores/training.ts";
import { useAuthStore } from "@/stores/auth.ts";

const isMobile = window.innerWidth <= 768;
const showConfirmDelete = ref(false);
const deleteTrainingId = ref<string>("");
const router = useRouter();
const trainingsStore = useTrainingStore();
const authStore = useAuthStore();
const trainings = ref([] as getTrainingResponseType[]);

async function confirmDelete(id: string) {
  try {
    await deleteTrainingRequest(id);
    trainings.value = trainings.value.filter((training) => training.id !== id);
  } catch (error) {
    console.error("Error deleting training:", error);
  }

  showConfirmDelete.value = false;
  deleteTrainingId.value = "";
}

function cancelDelete() {
  showConfirmDelete.value = false;
  deleteTrainingId.value = "";
}

function getDateString(date: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
  }).format(new Date(date));
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await router.push({ name: "login" });
  } else {
    if (trainingsStore.trainings.length > 0) {
      trainings.value = trainingsStore.trainings;
    } else {
      trainings.value = await getTrainings();
      trainingsStore.setTrainings(trainings.value);
    }
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
