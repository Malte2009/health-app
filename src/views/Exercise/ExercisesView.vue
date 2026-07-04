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
        <tr v-for="exercise in exercises" :key="exercise.id">
          <td>{{ exercise.name }}</td>
          <td>
            <button class="button button-primary" @click="router.push({ name: 'exerciseDetails', params: { id: exercise.id } })">View</button>
            <button class="button button-secondary" @click="router.push({ name: 'editExercise', params: { id: exercise.id } })">Edit</button>
            <button
              class="button button-danger"
              @click="
                showConfirmDelete = true;
                deleteExerciseId = exercise.id;
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
        <p>Are you sure you want to delete this exercise?</p>
        <button class="button button-danger" @click="confirmDelete(deleteExerciseId)">Delete</button>
        <button class="button button-secondary" @click="cancelDelete()">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import { computed, onMounted, ref } from "vue";
import ExerciseService from "@/services/exercise/exercise.service.ts";
import { useExerciseStore } from "@/stores/exerciseStore.ts";

const exerciseStore = useExerciseStore();

const exercises = computed(() => exerciseStore.getExercises);

const showConfirmDelete = ref(false);
const deleteExerciseId = ref<string>("");

async function confirmDelete(id: string) {
  try {
    await ExerciseService.deleteExercise(id);
    exerciseStore.removeExercise(id);
    showConfirmDelete.value = false;
    deleteExerciseId.value = "";
  } catch (error) {
    console.error("Failed to delete exercise:", error);
    alert("Exercise could not be deleted.");
  }
}

function cancelDelete() {
  showConfirmDelete.value = false;
  deleteExerciseId.value = "";
}

onMounted(async () => {
  await exerciseStore.loadExercises();
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
