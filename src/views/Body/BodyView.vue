<template>
  <div class="body-view">
    <h1>Body</h1>

    <table class="body-table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Date</th>
        <th>Weight (kg)</th>
        <th>Height (cm)</th>
        <th>Body Fat (%)</th>
        <th>Body Fat (kg)</th>
        <th>Muscle Mass (kg)</th>
        <th>Water Mass (kg)</th>
        <th>BMI</th>
        <th>BMR</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td colspan="11">
          <button class="button" @click="router.push({ name: 'createBodyLog' })">Add New Body Log</button>
        </td>
      </tr>
      <tr v-for="bodyLog in bodyLogs" :key="bodyLog.id">
        <td>{{ bodyLog.id }}</td>
        <td>{{ getDateString(bodyLog.createdAt) }}</td>
        <td>{{ bodyLog.weight || "" }}</td>
        <td>{{ bodyLog.height || "" }}</td>
        <td>{{ bodyLog.fatPercentage || "" }}</td>
        <td>{{ bodyLog.fatMass || "" }}</td>
        <td>{{ bodyLog.muscleMass || "" }}</td>
        <td>{{ bodyLog.waterMass || "" }}</td>
        <td>{{ roundTo(bodyLog.BMI, 1) || "" }}</td>
        <td>{{ roundTo(bodyLog.BMR, 0) || "" }}</td>
        <td>
          <button class="button button-primary" @click="router.push({ name: 'editBodyLog', params: { id: bodyLog.id } })">Edit</button>
          <button
            class="button button-danger"
            @click="
              showConfirmDelete = true;
              deleteBodyLogId = bodyLog.id;
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
        <p>Are you sure you want to delete this body log?</p>
        <button class="button button-danger" @click="confirmDelete(deleteBodyLogId)">Delete</button>
        <button class="button button-secondary" @click="cancelDelete">Cancel</button>
      </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { useBodyStore } from "@/stores/bodyStore.ts";
import { onMounted, ref } from "vue";
import type { bodyLog } from "@/types/bodyType.ts";
import router from "@/router";
import { roundTo } from "@/utility/math.ts";
import { getDateString } from "@/utility/date.ts";
import { deleteBodyLog } from "@/services/bodyService.ts";


const bodyStore = useBodyStore();

const bodyLogs = ref([] as bodyLog[]);

const showConfirmDelete = ref(false);
const deleteBodyLogId = ref<string>("");

async function confirmDelete(id: string) {
  try {
    await deleteBodyLog(id);
    bodyStore.deleteBodyLog(id);
    bodyLogs.value = bodyStore.getBodyLogs();
  } catch (error) {
    console.error("Error deleting body log:", error);
  }

  showConfirmDelete.value = false;
  deleteBodyLogId.value = "";
}

function cancelDelete() {
  showConfirmDelete.value = false;
  deleteBodyLogId.value = "";
}

onMounted(async () => {
  bodyLogs.value = await bodyStore.loadBodyLogs();
})
</script>

<style scoped>

.body-table {
  width: fit-content;
  border-collapse: collapse;
  margin-top: 20px;
  text-align: center;
  background: var(--bg-surface);
}

.body-table td {
  padding: 10px;
  border: 1px solid var(--border);
}

.body-table th {
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
