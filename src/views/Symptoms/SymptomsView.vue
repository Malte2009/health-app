<template>
  <div class="symptoms-view">
    <div v-if="showAddModal" class="modal-overlay">
      <AddSymptomLog @close="showAddModal = false" @reload="handleReload" />
    </div>
    <div v-if="showEditModal" class="modal-overlay"></div>

    <h1>Symptoms</h1>

    <div class="control-panel"></div>

    <table class="symptoms-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Date</th>
          <th>Type</th>
          <th>Name</th>
          <th>Severity</th>
          <th>ICP-Trigger</th>
          <th>Pulsatile</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="9">
            <button class="button" @click="showAddModal = true">Add Symptom</button>
          </td>
        </tr>
        <tr v-for="symptom in loadedSymptoms" :key="symptom.id">
          <td>{{ symptom.id }}</td>
          <td>{{ formatDateTime(symptom.timestamp) }}</td>
          <td v-if="symptom.type == 'SYMPTOM'">Symptom</td>
          <td v-if="symptom.type == 'SYNCOPE'">Syncope</td>
          <td>{{ symptom.name }}</td>
          <td>{{ symptom.severity }}</td>
          <td v-if="symptom.type == 'SYMPTOM' && symptom.worseOnBendingForward">Worse Bend</td>
          <td v-else-if="symptom.type == 'SYMPTOM' && symptom.worseOnLyingDown">Worse Lying</td>
          <td v-else-if="symptom.type == 'SYMPTOM' && symptom.betterOnLyingDown">Better Lying</td>
          <td v-else>-</td>
          <td v-if="symptom.type == 'SYMPTOM' && symptom.pulsatile">Yes</td>
          <td v-else-if="symptom.type == 'SYMPTOM' && !symptom.pulsatile">No</td>
          <td v-else>-</td>
          <td>
            <div class="action-buttons">
              <button class="button view-btn" @click="viewSymptomLog(symptom.id || '')">View</button>
              <button class="button edit-btn" @click="editSymptomLog(symptom.id || '')">Edit</button>
              <button class="button delete-btn" @click="deleteSymptomLog(symptom.id || '')">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { SymptomLog } from "@/types/symptoms/symptomType.ts";
import type { SyncopeLog } from "@/types/symptoms/syncopeType.ts";
import AddSymptomLog from "@/components/Symptoms/AddSymptomLog.vue";
import SymptomService from "@/services/symptomService.ts";
import { formatDateTime } from "@/utility/date.ts";
import SyncopeService from "@/services/syncopeService.ts";
const showAddModal = ref(false);
const showEditModal = ref(false);

const loadedSymptoms = ref<(SymptomLog| SyncopeLog)[]>([]);

async function viewSymptomLog(id: string) {}

async function editSymptomLog(id: string) {}

async function deleteSymptomLog(id: string) {}

async function handleReload() {}

onMounted(async () => {
  loadedSymptoms.value = [...await SymptomService.getSymptoms(), ...await SyncopeService.getSyncopes()]

  loadedSymptoms.value.sort((a, b) => (new Date(b.timestamp || "").getTime()) - (new Date(a.timestamp || "").getTime()));
});
</script>

<style scoped>
.symptoms-table {
  width: fit-content;
  border-collapse: collapse;
  margin-top: 20px;
  text-align: center;
  background: var(--bg-surface);
}

.symptoms-table td {
  padding: 10px;
  border: 1px solid var(--border);
}

.symptoms-table th {
  padding: 10px;
  border: 1px solid var(--border);
  background: var(--bg-surface-secondary);
}

.symptoms-table tbody tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.05);
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

.button:hover {
  background-color: #00a495; /* etwas dunklerer Ton von --primary */
}

.action-buttons {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.view-btn {
  background-color: var(--primary);
}

.edit-btn {
  background-color: var(--bg-surface-secondary);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.edit-btn:hover {
  background-color: var(--bg-surface);
  color: var(--text-main);
}

.delete-btn {
  background-color: var(--danger);
  box-shadow: 0 2px 5px rgba(232, 63, 96, 0.2);
  color: var(--text-main);
}

.delete-btn:hover {
  background-color: #e83f60;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
