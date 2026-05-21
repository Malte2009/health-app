<template>
  <div class="vitals">
    <div v-if="showBpModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ bpEditId ? 'Edit Blood Pressure' : 'Add Blood Pressure' }}</h3>
        <form @submit.prevent="submitBpForm">
          <div class="form-group">
            <label>Timestamp:</label>
            <input type="datetime-local" v-model="bpForm.timestamp" required />
          </div>
          <div class="form-group">
            <label>Minutes After Position Change:</label>
            <input type="number" v-model.number="bpForm.minutesAfterPositionChange" />
          </div>

          <div class="form-group">
            <label>Pulse:</label>
            <input type="number" v-model.number="bpForm.pulse" />
          </div>
          <div class="form-group">
            <label>Systolic:</label>
            <input type="number" v-model.number="bpForm.systolic" required />
          </div>
          <div class="form-group">
            <label>Diastolic:</label>
            <input type="number" v-model.number="bpForm.diastolic" required />
          </div>

          <div class="form-group">
            <label>Position (Free text):</label>
            <input type="text" v-model="bpForm.position" list="position-options" />
            <datalist id="position-options">
              <option value="Lying Supine"></option>
              <option value="Lying Lateral"></option>
              <option value="Sitting"></option>
              <option value="Standing"></option>
              <option value="Bending Forward"></option>
              <option value="Transition"></option>
            </datalist>
          </div>

          <div class="form-group">
            <label>Context (Free text):</label>
            <input type="text" v-model="bpForm.context" list="context-options" />
            <datalist id="context-options">
              <option value="Morning Rest"></option>
              <option value="Orthostatic Test"></option>
              <option value="Post Exercise"></option>
              <option value="Routine"></option>
            </datalist>
          </div>

          <div class="form-group">
            <label>Arm:</label>
            <input type="text" v-model="bpForm.arm" placeholder="Left / Right" />
          </div>
          <div class="form-group">
            <label>Symptoms:</label>
            <input type="text" v-model="bpForm.symptoms" />
          </div>
          <div class="modal-actions">
            <button type="submit" class="button">Save</button>
            <button type="button" class="button delete-btn" @click="showBpModal = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <h2>Vitals & Blood Pressure</h2>

    <div style="margin-bottom: 20px;">
      <button class="button" @click="toggleChart">
        {{ showChart ? 'Hide Progress Chart' : 'Show Progress Chart' }}
      </button>
    </div>

    <div v-if="showChart" class="blood-pressure-chart-container">
      <h3>Blood Pressure Progress</h3>
      <div class="canvas-wrapper">
        <canvas ref="bpChartCanvas"></canvas>
      </div>
    </div>

    <div class="bp-table-container">
      <h3>Blood Pressure History</h3>
      <table class="bp-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Systolic</th>
            <th>Diastolic</th>
            <th>Pulse</th>
            <th>Position</th>
            <th>Context</th>
            <th>Arm</th>
            <th>Symptoms</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="9" style="text-align: center;">
              <button class="button" @click="openBpAddModal">Log Blood Pressure</button>
            </td>
          </tr>
          <tr>
            <td>Average</td>
            <td>{{ roundTo(averageBp.systolic, 2) }}</td>
            <td>{{ roundTo(averageBp.diastolic, 2) }}</td>
            <td>{{ roundTo(averageBp.pulse, 2) }}</td>
            <td colspan="5"></td>
          </tr>
          <tr v-for="log in bpLogs" :key="log.id">
            <td>{{ formatDateTime(log.timestamp) }}</td>
            <td>{{ log.systolic }}</td>
            <td>{{ log.diastolic }}</td>
            <td>{{ log.pulse }}</td>
            <td>{{ log.position }}</td>
            <td>{{ log.context }}</td>
            <td>{{ log.arm }}</td>
            <td>{{ log.symptoms }}</td>
            <td>
              <button class="button" @click="openBpEditModal(log)" style="margin-right: 5px;">Edit</button>
              <button class="button delete-btn" @click="deleteBp(log.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { getBloodPressureLogs, createBloodPressureLog, updateBloodPressureLog, deleteBloodPressureLog } from '@/services/bloodPressureService';
import type { BloodPressureLog } from '@/types/bloodPressureType';
import { roundTo } from '@/utility/math';
import { toLocalDateTimeString, formatDateTime } from "@/utility/date";

Chart.register(...registerables, zoomPlugin);
Chart.defaults.color = '#e0e0e0';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

const bpForm = ref({
  timestamp: toLocalDateTimeString(),
  minutesAfterPositionChange: 0,
  systolic: 120,
  diastolic: 80,
  pulse: 60,
  position: 'Sitting',
  context: 'Routine',
  arm: '',
  symptoms: ''
});

const showBpModal = ref(false);
const bpEditId = ref<string | null>(null);
const showChart = ref(false);

const bpLogs = ref<BloodPressureLog[]>([]);
const bpChartCanvas = ref<HTMLCanvasElement | null>(null);
let bpChart: Chart | null = null;
const chartToggles = ref({
  systolic: true,
  diastolic: true,
  pulse: true,
});

const averageBp = computed(() => {
  if (bpLogs.value.length === 0) return { systolic: 0, diastolic: 0, pulse: 0 };
  const systolic = bpLogs.value.reduce((acc, log) => acc + log.systolic, 0) / bpLogs.value.length;
  const diastolic = bpLogs.value.reduce((acc, log) => acc + log.diastolic, 0) / bpLogs.value.length;
  const pulse = bpLogs.value.reduce((acc, log) => acc + (log.pulse || 0), 0) / bpLogs.value.length;
  return { systolic, diastolic, pulse };
});

const loadBpLogs = async () => {
  bpLogs.value = await getBloodPressureLogs();
  if (showChart.value) {
    createChart();
  }
};

const toggleChart = async () => {
  showChart.value = !showChart.value;
  if (showChart.value) {
    await nextTick();
    createChart();
  }
};

const createChart = () => {
  if (!bpChartCanvas.value) return;

  const logs = [...bpLogs.value].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const labels = logs.map(l => formatDateTime(l.timestamp));
  const dataSys = logs.map(l => l.systolic);
  const dataDia = logs.map(l => l.diastolic);
  const dataPulse = logs.map(l => l.pulse || null);

  const smooth = (data: (number | null)[], windowSize: number = 7) => {
    return data.map((val, idx, arr) => {
      if (val === null) return null;
      let sum = 0;
      let count = 0;
      const start = Math.max(0, idx - windowSize + 1);
      for (let i = start; i <= idx; i++) {
        if (arr[i] !== null) {
          sum += arr[i] as number;
          count++;
        }
      }
      return count > 0 ? sum / count : null;
    });
  };

  const smoothSys = smooth(dataSys);
  const smoothDia = smooth(dataDia);
  const smoothPulse = smooth(dataPulse);

  const datasets = [];

  datasets.push({ label: 'Systolic', data: dataSys, borderColor: '#ffb3ba', backgroundColor: '#ffb3ba', tension: 0.1, borderDash: [5, 5], borderWidth: 1 });
  datasets.push({ label: 'Smoothed Systolic', data: smoothSys, borderColor: '#ff4d4d', backgroundColor: '#ff4d4d', tension: 0.4, borderWidth: 2, pointRadius: 0 });

  datasets.push({ label: 'Diastolic', data: dataDia, borderColor: '#bae1ff', backgroundColor: '#bae1ff', tension: 0.1, borderDash: [5, 5], borderWidth: 1 });
  datasets.push({ label: 'Smoothed Diastolic', data: smoothDia, borderColor: '#007bff', backgroundColor: '#007bff', tension: 0.4, borderWidth: 2, pointRadius: 0 });

  datasets.push({ label: 'Pulse', data: dataPulse, borderColor: '#baffc9', backgroundColor: '#baffc9', tension: 0.1, borderDash: [5, 5], borderWidth: 1 });
  datasets.push({ label: 'Smoothed Pulse', data: smoothPulse, borderColor: '#28a745', backgroundColor: '#28a745', tension: 0.4, borderWidth: 2, pointRadius: 0 });

  bpChart = new Chart(bpChartCanvas.value, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        zoom: {
          zoom: { wheel: { enabled: true }, pinch: { enabled: true }, drag : { enabled: true }, mode: 'x' },
          pan: { enabled: true, mode: 'x' }
        }
      },
      maintainAspectRatio: false
    }
  });
}

const openBpAddModal = () => {
  bpEditId.value = null;
  bpForm.value = {
    timestamp: toLocalDateTimeString(),
    minutesAfterPositionChange: 0,
    systolic: 120,
    diastolic: 80,
    pulse: 60,
    position: 'Sitting',
    context: 'Routine',
    arm: '',
    symptoms: ''
  };
  showBpModal.value = true;
};

const openBpEditModal = (log: BloodPressureLog) => {
  bpEditId.value = log.id;
  bpForm.value = {
    ...log,
    timestamp: toLocalDateTimeString(new Date(log.timestamp))
  } as any;
  showBpModal.value = true;
};

const submitBpForm = async () => {
  try {
    const data = {
      ...bpForm.value,
      timestamp: new Date(bpForm.value.timestamp).toISOString()
    };
    if (bpEditId.value) {
      await updateBloodPressureLog(bpEditId.value, data as any);
    } else {
      await createBloodPressureLog(data as any);
    }
    showBpModal.value = false;
    await loadBpLogs();
  } catch (err) {
    console.error(err);
  }
};

const deleteBp = async (id: string) => {
  if (confirm("Delete this blood pressure log?")) {
    await deleteBloodPressureLog(id);
    await loadBpLogs();
  }
};


onMounted(() => {
  loadBpLogs();
});

onUnmounted(() => {
  if (bpChart) {
    bpChart.destroy();
  }
});
</script>

<style scoped>
.form-group { margin-bottom: 1rem; }
.blood-pressure-chart-container {
  margin: 20px 0;
  width: 100%;
}
.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
}
.chart-toggles {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}
.bp-table-container {
  margin-top: 20px;
  overflow-x: auto;
}
.bp-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-surface);
  text-align: center;
}
.bp-table th, .bp-table td {
  padding: 8px;
  border: 1px solid var(--border, #ccc);
}
.bp-table th {
  background: var(--bg-surface-secondary, #f4f4f4);
}
.bp-table tbody tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.05);
}

@media (prefers-color-scheme: dark) {
  .bp-table tbody tr:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.05);
  }
}
.button {
  background-color: var(--primary, #007bff);
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;
  margin: 4pxx;
}
.button:hover {
  opacity: 0.9;
}
.delete-btn {
  background-color: var(--danger, #dc3545);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: var(--bg-surface, #fff);
  color: var(--text-main, #333);
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}
.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: var(--primary, #007bff);
  text-align: center;
}
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}
.form-group label {
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 0.95rem;
}
.form-group input,
.form-group select {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid var(--border, #ccc);
  background: var(--bg-surface-secondary, #f9f9f9);
  color: var(--text-main, #333);
  font-size: 1rem;
  transition: border-color 0.2s;
}
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary, #007bff);
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 25px;
}
.modal-actions .button {
  padding: 8px 20px;
  font-size: 1rem;
  border-radius: 6px;
}
</style>
