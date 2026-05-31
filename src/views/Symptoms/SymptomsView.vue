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
                <div class="details-grid">
                  <p><strong>Id:</strong> {{ selectedViewSymptom.id || '-' }}</p>
                  <p><strong>User Id:</strong> {{ selectedViewSymptom.userId || '-' }}</p>
                  <p><strong>Created At:</strong> {{ formatDate(selectedViewSymptom.createdAt) }}</p>
                  <p><strong>Changed At:</strong> {{ formatDate(selectedViewSymptom.changedAt) }}</p>
                  <p><strong>Timestamp:</strong> {{ formatDateTime(selectedViewSymptom.timestamp) }}</p>
                  <p><strong>Type:</strong> {{ selectedViewSymptom.type || '-' }}</p>
                  <p><strong>Name:</strong> {{ selectedViewSymptom.name || '-' }}</p>
                  <p><strong>Severity:</strong> {{ formatValue(selectedViewSymptom.severity) }}</p>
                  <p><strong>Position:</strong> {{ selectedViewSymptom.position || '-' }}</p>
                  <p><strong>Trigger:</strong> {{ selectedViewSymptom.trigger || '-' }}</p>
                  <p><strong>Worse on bending forward:</strong> {{ formatBoolean(selectedViewSymptom.worseOnBendingForward) }}</p>
                  <p><strong>Worse on lying down:</strong> {{ formatBoolean(selectedViewSymptom.worseOnLyingDown) }}</p>
                  <p><strong>Better on lying down:</strong> {{ formatBoolean(selectedViewSymptom.betterOnLyingDown) }}</p>
                  <p><strong>Pulsatile:</strong> {{ formatBoolean(selectedViewSymptom.pulsatile) }}</p>
                  <p><strong>Trigger Food Log Id:</strong> {{ selectedViewSymptom.triggerFoodLogId || '-' }}</p>
                  <p><strong>Syncope Log Id:</strong> {{ selectedViewSymptom.syncopeLogId || '-' }}</p>
                </div>

                <div class="detail-block" v-if="selectedViewSymptom.triggerFoodLog">
                  <h4>Trigger Food Log</h4>
                  <pre>{{ formatObject(selectedViewSymptom.triggerFoodLog) }}</pre>
                </div>

                <div class="detail-block" v-if="selectedViewSymptom.syncopeLog">
                  <h4>Linked Syncope</h4>
                  <pre>{{ formatObject(selectedViewSymptom.syncopeLog) }}</pre>
                </div>

                <div class="detail-block" v-if="selectedViewSymptom.pictures && selectedViewSymptom.pictures.length > 0">
                  <h4>Pictures</h4>
                  <ul class="detail-list-inline">
                    <li v-for="picture in selectedViewSymptom.pictures" :key="picture.id">
                      {{ picture.fileName }} ({{ picture.mimeType }}, {{ picture.size }} bytes)
                    </li>
                  </ul>
                </div>

                <p><strong>Notes:</strong> {{ selectedViewSymptom.notes || '-' }}</p>
              </div>
              <div v-else-if="selectedViewSymptom.type === 'SYNCOPE'">
                <div class="details-grid">
                  <p><strong>Id:</strong> {{ selectedViewSymptom.id || '-' }}</p>
                  <p><strong>User Id:</strong> {{ selectedViewSymptom.userId || '-' }}</p>
                  <p><strong>Created At:</strong> {{ formatDate(selectedViewSymptom.createdAt) }}</p>
                  <p><strong>Changed At:</strong> {{ formatDate(selectedViewSymptom.changedAt) }}</p>
                  <p><strong>Timestamp:</strong> {{ formatDateTime(selectedViewSymptom.timestamp) }}</p>
                  <p><strong>Type:</strong> {{ selectedViewSymptom.type || '-' }}</p>
                  <p><strong>Name:</strong> {{ selectedViewSymptom.name || '-' }}</p>
                  <p><strong>Outcome:</strong> {{ selectedViewSymptom.outcome || '-' }}</p>
                  <p><strong>Severity:</strong> {{ formatValue(selectedViewSymptom.severity) }}</p>
                  <p><strong>Trigger:</strong> {{ selectedViewSymptom.trigger || '-' }}</p>
                  <p><strong>Position:</strong> {{ selectedViewSymptom.position || '-' }}</p>
                  <p><strong>Amnesia:</strong> {{ formatBoolean(selectedViewSymptom.amnesia) }}</p>
                  <p><strong>Amnesia Duration (min):</strong> {{ formatValue(selectedViewSymptom.amnesiaDurationMinutes) }}</p>
                  <p><strong>Activity Before:</strong> {{ selectedViewSymptom.activityBefore || '-' }}</p>
                  <p><strong>Hours Since Last Meal:</strong> {{ formatValue(selectedViewSymptom.hoursSinceLastMeal) }}</p>
                  <p><strong>Hours Since Last Drink:</strong> {{ formatValue(selectedViewSymptom.hoursSinceLastDrink) }}</p>
                  <p><strong>Salt Supplementation:</strong> {{ formatBoolean(selectedViewSymptom.saltSupplementation) }}</p>
                  <p><strong>Injuries:</strong> {{ selectedViewSymptom.injuries || '-' }}</p>
                  <p><strong>Training Log Id:</strong> {{ selectedViewSymptom.trainingLogId || '-' }}</p>
                </div>

                <div class="detail-block" v-if="selectedViewSymptom.trainingLog">
                  <h4>Linked Training</h4>
                  <pre>{{ formatObject(selectedViewSymptom.trainingLog) }}</pre>
                </div>

                <div class="detail-block" v-if="selectedViewSymptom.symptoms && selectedViewSymptom.symptoms.length > 0">
                  <h4>Associated Symptoms</h4>
                  <ul class="detail-list-inline">
                    <li v-for="symptom in selectedViewSymptom.symptoms" :key="symptom.id || symptom.name">
                      {{ symptom.name || symptom.type || 'Symptom' }}
                      <span v-if="symptom.severity !== undefined">(Severity: {{ symptom.severity }})</span>
                    </li>
                  </ul>
                </div>

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

const formatDate = (value?: Date) => {
  if (!value) return '-';
  return new Date(value).toLocaleString();
};

const formatBoolean = (value?: boolean) => {
  if (value === undefined || value === null) return '-';
  return value ? 'Yes' : 'No';
};

const formatValue = (value: unknown) => {
  if (value === undefined || value === null || value === '') return '-';
  return String(value);
};

const formatObject = (value: unknown) => {
  return JSON.stringify(value, null, 2);
};

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
