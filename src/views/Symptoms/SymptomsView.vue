<template>
  <div class="symptoms-view">
        <div v-if="showAddModal" class="modal-overlay">
          <AddSymptomLog @close="showAddModal = false" @reload="handleReload" />
        </div>

        <div v-if="showEditModal" class="modal-overlay">
          <AddSymptomLog :initialData="selectedEditSymptom" @close="closeEditModal" @reload="handleReload" />
        </div>

        <div v-if="showViewModal" class="modal-overlay">
          <div class="modal-content">
            <div class="close" @click="showViewModal = false">x</div>
            <h3>Details</h3>
            <div v-if="selectedViewSymptom">
              <div v-if="selectedViewSymptom.type === 'SYMPTOM'">
                <p><strong>Id:</strong> {{ selectedViewSymptom.id }}</p>
                <p><strong>Date:</strong> {{ formatDateTime(selectedViewSymptom.timestamp) }}</p>
                <p><strong>Name:</strong> {{ selectedViewSymptom.name }}</p>
                <p><strong>Trigger:</strong> {{ selectedViewSymptom.trigger || '-' }}</p>
                <p><strong>Position:</strong> {{ selectedViewSymptom.position || '-' }}</p>
                <p><strong>Severity:</strong> {{ selectedViewSymptom.severity }}</p>
                <p><strong>ICP Trigger:</strong>
                  <span v-if="selectedViewSymptom.worseOnBendingForward">Worse Bend</span>
                  <span v-else-if="selectedViewSymptom.worseOnLyingDown">Worse Lying</span>
                  <span v-else-if="selectedViewSymptom.betterOnLyingDown">Better Lying</span>
                  <span v-else>-</span>
                </p>
                <p><strong>Pulsatile:</strong> {{ selectedViewSymptom.pulsatile ? 'Yes' : 'No' }}</p>
                <p><strong>Notes:</strong> {{ selectedViewSymptom.notes || '-' }}</p>
              </div>
              <div v-else-if="selectedViewSymptom.type === 'SYNCOPE'">
                <p><strong>Id:</strong> {{ selectedViewSymptom.id }}</p>
                <p><strong>Date:</strong> {{ formatDateTime(selectedViewSymptom.timestamp) }}</p>
                <p><strong>Name:</strong> {{ selectedViewSymptom.name }}</p>
                <p><strong>Outcome:</strong> {{ selectedViewSymptom.outcome || '-' }}</p>
                <p><strong>Amnesia:</strong> {{ selectedViewSymptom.amnesia ? (selectedViewSymptom.amnesiaDurationMinutes || '-') : 'No' }}</p>
                <p><strong>Trigger:</strong> {{ selectedViewSymptom.trigger || '-' }}</p>
                <p><strong>Position:</strong> {{ selectedViewSymptom.position || '-' }}</p>
                <p><strong>Activity Before:</strong> {{ selectedViewSymptom.activityBefore || '-' }}</p>
                <p><strong>Injuries:</strong> {{ selectedViewSymptom.injuries || '-' }}</p>
                <p><strong>Notes:</strong> {{ selectedViewSymptom.notes || '-' }}</p>
              </div>
            </div>
            <div style="display:flex; justify-content:flex-end; gap: 8px; margin-top: 12px;">
              <button class="button edit-btn" @click="editSymptomLog(selectedViewSymptom?.id || '')">Edit</button>
              <button class="button delete-btn" @click="deleteSymptomLog(selectedViewSymptom?.id || '')">Delete</button>
              <button class="button" @click="showViewModal = false">Close</button>
            </div>
          </div>
        </div>

    <h1>Symptoms</h1>

    <div class="control-panel"></div>

    <table class="symptoms-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Date</th>
          <th>Type</th>
          <th>Name</th>
          <th>Trigger</th>
          <th>Positon</th>
          <th>Severity</th>
          <th>ICP-Trigger</th>
          <th>Pulsatile</th>
          <th>Notes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="12">
            <button class="button" @click="showAddModal = true">Add Symptom</button>
          </td>
        </tr>
        <tr v-for="symptom in loadedSymptoms" :key="symptom.id">
          <td>{{ symptom.id }}</td>
          <td>{{ formatDateTime(symptom.timestamp) }}</td>
          <td v-if="symptom.type == 'SYMPTOM'">Symptom</td>
          <td v-if="symptom.type == 'SYNCOPE' && symptom.outcome == 'SYNCOPE' && !symptom.amnesia">Syncope</td>
          <td v-if="symptom.type == 'SYNCOPE' && symptom.outcome == 'SYNCOPE' && symptom.amnesia">Amnesia</td>
          <td v-if="symptom.type == 'SYNCOPE' && symptom.outcome == 'PRESYNCOPE'">Presyncope</td>
          <td>{{ symptom.name }}</td>
          <td>{{ symptom.trigger || "-" }}</td>
          <td>{{ symptom.position || "-" }}</td>
          <td>{{ symptom.severity }}</td>
          <td v-if="symptom.type == 'SYMPTOM' && symptom.worseOnBendingForward">Worse Bend</td>
          <td v-else-if="symptom.type == 'SYMPTOM' && symptom.worseOnLyingDown">Worse Lying</td>
          <td v-else-if="symptom.type == 'SYMPTOM' && symptom.betterOnLyingDown">Better Lying</td>
          <td v-else>-</td>
          <td v-if="symptom.type == 'SYMPTOM' && symptom.pulsatile">Yes</td>
          <td v-else-if="symptom.type == 'SYMPTOM' && !symptom.pulsatile">No</td>
          <td v-else>-</td>
          <td>{{ symptom.notes || "-" }}</td>
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
const showViewModal = ref(false);

const selectedEditSymptom = ref<SymptomLog | SyncopeLog | null>(null);
const selectedViewSymptom = ref<SymptomLog | SyncopeLog | null>(null);

const loadedSymptoms = ref<(SymptomLog | SyncopeLog)[]>([]);

function closeEditModal() {
  showEditModal.value = false;
  selectedEditSymptom.value = null;
}

async function viewSymptomLog(id: string) {
  if (!id) return;
  const item = loadedSymptoms.value.find((s) => s.id === id);
  if (!item) return;
  selectedViewSymptom.value = item;
  showViewModal.value = true;
}

async function editSymptomLog(id: string) {
  if (!id) return;
  const item = loadedSymptoms.value.find((s) => s.id === id);
  if (!item) return;
  selectedEditSymptom.value = item;
  showEditModal.value = true;
}

async function deleteSymptomLog(id: string) {
  if (!id) return;
  if (!confirm("Delete this symptom log?")) return;
  try {
    const item = loadedSymptoms.value.find((s) => s.id === id);
    if (!item) {
      await handleReload();
      return;
    }

    if (item.type === "SYMPTOM") {
      await SymptomService.deleteSymptom(id);
    } else {
      await SyncopeService.deleteSyncope(id);
    }

    await handleReload();

    if (selectedViewSymptom.value?.id === id) {
      selectedViewSymptom.value = null;
      showViewModal.value = false;
    }
  } catch (err) {
    console.error(err);
  }
}

async function handleReload() {
  loadedSymptoms.value = [...(await SymptomService.getSymptoms()), ...(await SyncopeService.getSyncopes())];
  loadedSymptoms.value.sort((a, b) => new Date(b.timestamp || "").getTime() - new Date(a.timestamp || "").getTime());
  showAddModal.value = false;
  showEditModal.value = false;
}

onMounted(async () => {
  await handleReload();
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

.modal-content {
  background-color: var(--bg-surface);
  color: var(--text-main);
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-content .close {
  text-align: right;
  cursor: pointer;
  color: var(--danger);
  font-weight: bold;
}
</style>
