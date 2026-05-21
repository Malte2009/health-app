<template>
  <div class="hrv-view">
    <div v-if="showAddModal" class="modal-overlay">
      <AddHrvRecording @close="showAddModal = false" @reload="handleReload" />
    </div>
    <div v-if="showEditModal" class="modal-overlay">
      <ChangeHrvRecording :id="recordingToEditId" @close="showEditModal = false" @reload="handleReload" />
    </div>

    <h1>HRV Recordings</h1>

    <div class="control-panel">
      <select name="filter" id="filter-select" @change="changeFilters">
        <option value="no">No Filtering</option>
        <option selected value="standard">Standard Filtering</option>
        <option value="full">Full Filtering</option>
      </select>
      <select name="context-filter" id="context-filter-select" v-model="selectedContext" @change="changeFilters" style="margin-left: 10px;">
        <option value="">All Contexts</option>
        <option v-for="context in availableContexts" :key="context" :value="context">{{ context }}</option>
      </select>
    </div>

    <table class="hrv-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Name</th>
          <th>Context</th>
          <th>Device</th>
          <th v-if="showMore">Average RR</th>
          <th>Average HR</th>
          <th v-if="showMore">Max HR</th>
          <th v-if="showMore">Min HR</th>
          <th>SDNN</th>
          <th>RMSSD</th>
          <th>pNN50</th>
          <th v-if="showMore">VLF Power</th>
          <th v-if="showMore">LF Power</th>
          <th v-if="showMore">HF Power</th>
          <th>LF / HF Ratio</th>
          <th v-if="showMore">HF Peak Hz</th>
          <th v-if="showMore">RSA BPM</th>
          <th v-if="showMore">SD1</th>
          <th v-if="showMore">SD2</th>
          <th>Baevsky SI</th>
          <th>CSI</th>
          <th>CVI</th>
          <th v-if="showMore">SD1/SD2 Ratio</th>
          <th v-if="showMore">Sample Entropy</th>
          <th v-if="showMore">Approx Entropy</th>
          <th>DFA α1</th>
          <th v-if="showMore">Vagal Burst</th>
          <th v-if="showMore">PVC</th>
          <th>Artifact %</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-if="showMore" colspan="30">
            <button class="button" @click="showAddModal = true">Create New HRV Recording</button>
          </td>
          <td v-else colspan="15">
            <button class="button" @click="showAddModal = true">Create New HRV Recording</button>
          </td>
        </tr>
        <tr>
          <td colspan="4">Average</td>
          <td v-if="showMore">{{ roundTo(averageValues?.mean_rr_ms, 2) }}</td>
          <td>{{ roundTo(averageValues?.mean_hr_bpm, 2) }}</td>
          <td v-if="showMore"> {{ roundTo(averageValues?.max_hr_bpm, 2) }}</td>
          <td v-if="showMore"> {{ roundTo(averageValues?.min_hr_bpm, 2) }}</td>
          <td>{{ roundTo(averageValues?.sdnn_ms, 2) }}</td>
          <td>{{ roundTo(averageValues?.rmssd_ms, 2) }}</td>
          <td>{{ roundTo(averageValues?.pnn50_percent, 2) }}</td>
          <td v-if="showMore">{{ roundTo(averageValues?.vlf_power, 2) }}</td>
          <td v-if="showMore">{{ roundTo(averageValues?.lf_power, 2) }}</td>
          <td v-if="showMore">{{ roundTo(averageValues?.hf_power, 2) }}</td>
          <td>{{ roundTo(averageValues?.lf_hf_ratio, 2) }}</td>
          <td v-if="showMore">{{ roundTo(averageValues?.hf_peak_hz, 2) }}</td>
          <td v-if="showMore">{{ roundTo(averageValues?.rsa_bpm, 2) }}</td>
          <td v-if="showMore">{{ roundTo(averageValues?.sd1_ms, 2) }}</td>
          <td v-if="showMore">{{ roundTo(averageValues?.sd2_ms, 2) }}</td>
          <td>{{ roundTo(averageValues?.baevsky_si, 2) }}</td>
          <td>{{ roundTo(averageValues?.csi, 2) }}</td>
          <td>{{ roundTo(averageValues?.cvi, 2) }}</td>
          <td v-if="showMore">{{ roundTo(averageValues?.sd1_sd2_ratio, 2) }}</td>
          <td v-if="showMore">{{ roundTo(averageValues?.sample_entropy, 2) }}</td>
          <td v-if="showMore">{{ roundTo(averageValues?.approx_entropy, 2) }}</td>
          <td>{{ roundTo(averageValues?.dfa_alpha1, 2) }}</td>
          <td v-if="showMore">{{ roundTo(averageValues?.preserved_vagal_burst, 2) }}</td>
          <td v-if="showMore">{{ roundTo(averageValues?.preserved_pvc, 2) }}</td>
          <td>{{ roundTo(averageValues?.artifact_percent, 2) || 0 }}</td>
          <td></td>
        </tr>
        <tr v-for="recording in loadedRecordings" :key="recording.id">
          <td>{{ getDateString(recording?.date) }}</td>
          <td>{{ recording?.name }}</td>
          <td>{{ recording?.context }}</td>
          <td>{{ recording?.device }}</td>
          <td v-if="showMore">{{ roundTo(recording?.metric?.mean_rr_ms, 2) }}</td>
          <td>{{ roundTo(recording?.metric?.mean_hr_bpm, 2) }}</td>
          <td v-if="showMore">{{ roundTo(recording?.metric?.max_hr_bpm, 2) }}</td>
          <td v-if="showMore">{{ roundTo(recording?.metric?.min_hr_bpm, 2) }}</td>
          <td>{{ roundTo(recording?.metric?.sdnn_ms, 2) }}</td>
          <td>{{ roundTo(recording?.metric?.rmssd_ms, 2) }}</td>
          <td>{{ roundTo(recording?.metric?.pnn50_percent, 2) }}</td>
          <td v-if="showMore">{{ roundTo(recording?.metric?.vlf_power, 2) }}</td>
          <td v-if="showMore">{{ roundTo(recording?.metric?.lf_power, 2) }}</td>
          <td v-if="showMore">{{ roundTo(recording?.metric?.hf_power, 2) }}</td>
          <td>{{ roundTo(recording?.metric?.lf_hf_ratio, 2) }}</td>
          <td v-if="showMore">{{ roundTo(recording?.metric?.hf_peak_hz, 2) }}</td>
          <td v-if="showMore">{{ roundTo(recording?.metric?.rsa_bpm, 2) }}</td>
          <td v-if="showMore">{{ roundTo(recording?.metric?.sd1_ms, 2) }}</td>
          <td v-if="showMore">{{ roundTo(recording?.metric?.sd2_ms, 2) }}</td>
          <td>{{ roundTo(recording?.metric?.baevsky_si, 2) }}</td>
          <td>{{ roundTo(recording?.metric?.csi, 2) }}</td>
          <td>{{ roundTo(recording?.metric?.cvi, 2) }}</td>
          <td v-if="showMore">{{ roundTo(recording?.metric?.sd1_sd2_ratio, 2) }}</td>
          <td v-if="showMore">{{ roundTo(recording?.metric?.sample_entropy, 2) }}</td>
          <td v-if="showMore">{{ roundTo(recording?.metric?.approx_entropy, 2) }}</td>
          <td>{{ roundTo(recording?.metric?.dfa_alpha1, 2) }}</td>
          <td v-if="showMore">{{ roundTo(recording?.metric?.preserved_vagal_burst, 2) }}</td>
          <td v-if="showMore">{{ roundTo(recording?.metric?.preserved_pvc, 2) }}</td>
          <td>{{ roundTo(recording?.metric?.artifact_percent, 2) || 0 }}</td>
          <td>
            <div class="action-buttons">
              <button class="button view-btn" @click="viewRecording(recording.id)">View</button>
              <button class="button edit-btn" @click="editRecording(recording.id)">Edit</button>
              <button class="button delete-btn" @click="deleteRecording(recording.id)">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { getHrvRecordings, deleteHrvRecording } from "@/services/hrvService.ts";
import { useRouter } from "vue-router";
import { roundTo } from "@/utility/math.ts";
import { getDateString } from "@/utility/date.ts";
import AddHrvRecording from "@/components/HRV/AddHrvRecording.vue";
import ChangeHrvRecording from "@/components/HRV/ChangeHrvRecording.vue";

const router = useRouter();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadedRecordings = ref<any[]>([]);

const showMore = ref(true);
const showAddModal = ref(false);
const showEditModal = ref(false);
const recordingToEditId = ref("");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const recordings = ref<any[]>([]);

const selectedContext = ref("");
const availableContexts = computed(() => {
  const contexts = new Set<string>();
  for (const recording of recordings.value) {
    if (recording.context) {
      contexts.add(recording.context);
    }
  }
  return Array.from(contexts).sort();
});

const averageValues = ref({
  mean_rr_ms: 0,
  mean_hr_bpm: 0,
  min_hr_bpm: 0,
  max_hr_bpm: 0,
  sdnn_ms: 0,
  rmssd_ms: 0,
  pnn50_percent: 0,
  vlf_power: 0,
  lf_power: 0,
  hf_power: 0,
  lf_hf_ratio: 0,
  hf_peak_hz: 0,
  rsa_bpm: 0,
  sd1_ms: 0,
  sd2_ms: 0,
  baevsky_si: 0,
  csi: 0,
  cvi: 0,
  sd1_sd2_ratio: 0,
  sample_entropy: 0,
  approx_entropy: 0,
  dfa_alpha1: 0,
  preserved_vagal_burst: 0,
  preserved_pvc: 0,
  artifact_percent: 0,
});

const filters = reactive({
  no: false,
  standard: true,
  full: false,
});

function changeFilters() {
  const filter = (document.getElementById("filter-select") as HTMLSelectElement).value;

  filters.no = false;
  filters.standard = false;
  filters.full = false;

  if (filter === "no") filters.no = true;
  if (filter === "standard") filters.standard = true;
  if (filter === "full") filters.full = true;

  loadRecordings();
  calculateAverageValues();
}

function loadRecordings() {
  loadedRecordings.value = [];
  for (const recording of recordings.value) {
    if (selectedContext.value && recording.context !== selectedContext.value) {
      continue;
    }

    const newRecording = recording;
    for (let i = 0; i < recording.metrics.length; i++) {
      const metric = recording.metrics[i];
      if (
        (filters.no && !metric.adaptiveFilteringApplied) &&
        !metric.artifactFilteringApplied &&
        !metric.movingAverageFilteringApplied &&
        !metric.rangeFilteringApplied
      ) {
        console.log(newRecording);
        newRecording.metric = metric;
      }
      if (
        filters.standard &&
        !metric.adaptiveFilteringApplied &&
        metric.movingAverageFilteringApplied &&
        metric.rangeFilteringApplied &&
        metric.artifactFilteringApplied
      ) {
        newRecording.metric = metric;
      }
      if (
        filters.full &&
        metric.adaptiveFilteringApplied &&
        metric.movingAverageFilteringApplied &&
        metric.rangeFilteringApplied &&
        metric.artifactFilteringApplied
      ) {
        newRecording.metric = metric;
      }
    }

    loadedRecordings.value.push(newRecording);
  }
}

function calculateAverageValues() {

  for (const key of Object.keys(averageValues.value)) {
    averageValues.value[key as keyof typeof averageValues.value] = 0;
  }

  if (filters.no) {
    for (const recording of loadedRecordings.value) {
      for (const metric of recording.metrics) {
        if (
          metric.adaptiveFilteringApplied ||
          metric.artifactFilteringApplied ||
          metric.movingAverageFilteringApplied ||
          metric.rangeFilteringApplied
        )
          continue;

        for (const [key] of Object.entries(averageValues.value)) {
          averageValues.value[key as keyof typeof averageValues.value] += metric[key as keyof typeof averageValues.value];
        }
      }
    }
  } else if (filters.standard) {
    for (const recording of loadedRecordings.value) {
      for (const metric of recording.metrics) {
        if (
          metric.adaptiveFilteringApplied ||
          !metric.artifactFilteringApplied ||
          !metric.movingAverageFilteringApplied ||
          !metric.rangeFilteringApplied
        )
          continue;

        for (const [key] of Object.entries(averageValues.value)) {
          averageValues.value[key as keyof typeof averageValues.value] += metric[key as keyof typeof averageValues.value];
        }
      }
    }
  } else if (filters.full) {
    for (const recording of loadedRecordings.value) {
      for (const metric of recording.metrics) {
        if (
          !metric.adaptiveFilteringApplied ||
          !metric.artifactFilteringApplied ||
          !metric.movingAverageFilteringApplied ||
          !metric.rangeFilteringApplied
        )
          continue;

        for (const [key] of Object.entries(averageValues.value)) {
          averageValues.value[key as keyof typeof averageValues.value] += metric[key as keyof typeof averageValues.value];
        }
      }
    }
  }

  const count = loadedRecordings.value.length || 1;
  for (const [key] of Object.entries(averageValues.value)) {
    averageValues.value[key as keyof typeof averageValues.value] /= count;
  }
}

async function viewRecording(id: string) {
  router.push({ name: 'hrvDetails', params: { id } });
}

function editRecording(id: string) {
  recordingToEditId.value = id;
  showEditModal.value = true;
}

async function handleReload() {
  recordings.value = await getHrvRecordings();
  loadRecordings();
  calculateAverageValues();
}

async function deleteRecording(id: string) {
  if (confirm("Are you sure you want to delete this HRV recording?")) {
    await deleteHrvRecording(id);
    recordings.value = await getHrvRecordings();
    loadRecordings();
    calculateAverageValues();
  }
}

onMounted(async () => {
  try {
    const hrvs = await getHrvRecordings();
    recordings.value = hrvs;

    loadedRecordings.value = recordings.value;

    loadRecordings();
    calculateAverageValues();
  } catch (e) {
    console.error(e);
  }
});
</script>

<style scoped>
.hrv-table {
  width: fit-content;
  border-collapse: collapse;
  margin-top: 20px;
  text-align: center;
  background: var(--bg-surface);
}

.hrv-table td {
  padding: 10px;
  border: 1px solid var(--border);
}

.hrv-table th {
  padding: 10px;
  border: 1px solid var(--border);
  background-color: var(--bg-surface-secondary);
}

.hrv-table tbody tr:nth-child(even) {
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

.sleep-combo {
  font-size: 0.9em;
  color: #555;
  background: var(--bg-surface, #fdfdfd);
  padding: 5px;
  border-radius: 4px;
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

@media (prefers-color-scheme: dark) {
  .hrv-table tbody tr:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.05);
  }
}
</style>
