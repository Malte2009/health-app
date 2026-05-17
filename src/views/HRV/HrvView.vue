<template>
  <div class="hrv-view">
    <h2>HRV Recordings</h2>

    <div class="hrv-container">
      <div class="hrv-list">
        <h3>My Recordings</h3>
        <button @click="loadRecordings" class="btn">Refresh</button>
        <ul>
          <li v-for="rec in recordings" :key="rec.id" class="hrv-item">
            <div>
              <strong>{{ rec.date }}</strong> - {{ rec.context }} ({{ rec.device }})
            </div>
            <div>
              HRV: {{ rec.rmssd }} ms | HR: {{ rec.averageHeartRate }} bpm
            </div>
            <div class="actions">
              <button @click="viewMetrics(rec)" class="btn-small">Chart</button>
              <button @click="editRecording(rec)" class="btn-small">Edit</button>
              <button @click="removeRecording(rec.id)" class="btn-small btn-danger">Delete</button>
            </div>
          </li>
        </ul>
      </div>

      <div class="hrv-chart-section" v-if="selectedRec">
        <h3>Metrics for {{ selectedRec.date }}</h3>
        <div class="chart-controls">
          <label>Metric: </label>
          <select v-model="selectedMetric" @change="renderChart">
            <option value="rmssd_ms">HRV (RMSSD)</option>
            <option value="mean_hr_bpm">Heart Rate (BPM)</option>
            <option value="rr_data">Raw RR Intervals</option>
          </select>
          <select v-model="selectedDataType" @change="renderChart" v-if="selectedMetric !== 'rr_data'">
            <option value="recording">Recording Level</option>
            <option value="windows">5-Min Windows Level</option>
          </select>
        </div>

        <div v-if="isLoadingChart">Loading chart...</div>
        <div v-else-if="chartError" class="chart-error">{{ chartError }}</div>
        <div class="chart-box" v-else-if="chartPoints.length">
          <svg width="100%" height="200" preserveAspectRatio="none">
            <polyline :points="chartSvgPoints" fill="none" stroke="#42a5f5" stroke-width="2" />
          </svg>
          <div class="chart-labels">
            <span>{{ minMetricValue }}</span>
            <span>{{ maxMetricValue }}</span>
          </div>
        </div>
        <p v-else>Loading or no data...</p>
      </div>

      <div class="hrv-form">
        <h3>{{ isEditing ? 'Edit Recording' : 'New Recording' }}</h3>
        <form @submit.prevent="saveRecording">
          <div class="form-group">
            <label>RR Data (newline separated):</label>
            <textarea v-model="form.rrData" rows="6" placeholder="800&#10;850&#10;840"></textarea>
          </div>
          <div class="form-group">
            <label>Date:</label>
            <input type="date" v-model="form.date" />
          </div>
          <div class="form-group">
            <label>Start Time:</label>
            <input type="time" v-model="form.startTime" />
          </div>
          <div class="form-group">
            <label>End Time:</label>
            <input type="time" v-model="form.endTime" />
          </div>
          <div class="form-group">
            <label>Device:</label>
            <input type="text" v-model="form.device" placeholder="e.g. Polar H10" />
          </div>
          <div class="form-group">
            <label>Context:</label>
            <select v-model="form.context">
              <option value="MORNING_REST">Morning Rest</option>
              <option value="POST_EXERCISE">Post Exercise</option>
              <option value="NIGHT">Night / Sleep</option>
              <option value="RANDOM">Random</option>
            </select>
          </div>
          <div class="form-group">
            <label>Training Log ID (optional):</label>
            <input type="text" v-model="form.trainingLogId" />
          </div>
          <div class="form-group">
            <label>Sleep Log ID (optional):</label>
            <input type="text" v-model="form.sleepLogId" />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update' : 'Create' }}</button>
            <button type="button" @click="cancelEdit" v-if="isEditing" class="btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getHrvRecordings, getHrvRecording, getHrvData, createHrvRecording, updateHrvRecording, deleteHrvRecording } from '@/services/hrvService';

const recordings = ref<any[]>([]);
const isEditing = ref(false);
const editId = ref<string | null>(null);

const form = ref({
  rrData: '',
  date: new Date().toISOString().substring(0, 10),
  startTime: '',
  endTime: '',
  device: 'Polar H10',
  context: 'MORNING_REST',
  trainingLogId: '',
  sleepLogId: ''
});

const selectedRec = ref<any>(null);
const selectedMetric = ref('rmssd_ms');
const selectedDataType = ref('recording');
const chartPoints = ref<number[]>([]);
const maxMetricValue = ref(0);
const minMetricValue = ref(0);
const chartError = ref<string | null>(null);
const isLoadingChart = ref(false);

const chartSvgPoints = computed(() => {
  if (chartPoints.value.length === 0) return '';
  const max = maxMetricValue.value;
  const min = minMetricValue.value;
  const range = max - min || 1;
  const height = 200;
  const width = 400; // arbitrary relative width for viewBox if we used it, but using % so we just map X to 0..100

  return chartPoints.value.map((val, i) => {
    const x = (i / (chartPoints.value.length - 1 || 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
});

const loadRecordings = async () => {
  try {
    recordings.value = await getHrvRecordings(false);
  } catch (error) {
    console.error('Failed to load HRV recordings:', error);
  }
};

const saveRecording = async () => {
  try {
    const queryParams: any = {
      date: form.value.date ? form.value.date + 'T00:00:00.000Z' : undefined,
      device: form.value.device || undefined,
      context: form.value.context || undefined,
      trainingLogId: form.value.trainingLogId || undefined,
    };

    if (form.value.startTime) {
      queryParams.startTime = `${form.value.date}T${form.value.startTime}:00.000Z`;
    }
    if (form.value.endTime) {
      queryParams.endTime = `${form.value.date}T${form.value.endTime}:00.000Z`;
    }

    if (isEditing.value && editId.value) {
      queryParams.sleepLogId = form.value.sleepLogId || undefined;
      await updateHrvRecording(editId.value, form.value.rrData || undefined, queryParams);
    } else {
      queryParams.sleepingLogId = form.value.sleepLogId || undefined;
      await createHrvRecording(form.value.rrData, queryParams);
    }

    cancelEdit();
    await loadRecordings();
  } catch (error) {
    console.error('Failed to save HRV recording:', error);
  }
};

const editRecording = (rec: any) => {
  isEditing.value = true;
  editId.value = rec.id;

  form.value = {
    rrData: '', // Usually not loaded by default unless includeWindows=true and parsed, leaving empty. Users can append or overwrite.
    date: rec.date ? rec.date.substring(0, 10) : new Date().toISOString().substring(0, 10),
    startTime: rec.startTime ? rec.startTime.substring(11, 16) : '',
    endTime: rec.endTime ? rec.endTime.substring(11, 16) : '',
    device: rec.device || 'Polar H10',
    context: rec.context || 'MORNING_REST',
    trainingLogId: rec.trainingLogId || '',
    sleepLogId: rec.sleepingLogId || rec.sleepLogId || ''
  };
};

const cancelEdit = () => {
  isEditing.value = false;
  editId.value = null;
  form.value = {
    rrData: '',
    date: new Date().toISOString().substring(0, 10),
    startTime: '',
    endTime: '',
    device: 'Polar H10',
    context: 'MORNING_REST',
    trainingLogId: '',
    sleepLogId: ''
  };
};

const removeRecording = async (id: string) => {
  if (confirm('Delete this recording?')) {
    try {
      await deleteHrvRecording(id);
      await loadRecordings();
    } catch (error) {
      console.error('Failed to delete HRV recording:', error);
    }
  }
};

const viewMetrics = async (rec: any) => {
  selectedRec.value = null; // reset
  chartPoints.value = [];
  chartError.value = null;
  selectedDataType.value = 'recording'; // default to recording to avoids extra requests
  selectedMetric.value = 'rmssd_ms';
  selectedRec.value = rec;
  await renderChart();
};

const renderChart = async () => {
  if (!selectedRec.value) return;
  chartPoints.value = [];
  chartError.value = null;
  isLoadingChart.value = true;

  try {
    if (selectedMetric.value === 'rr_data') {
      const rawData = await getHrvData(selectedRec.value.id);
      if (rawData) {
        const split = rawData.split('\n').map((x: string) => parseFloat(x.trim())).filter((x: number) => !isNaN(x));
        chartPoints.value = split;
      }
    } else {
      if (selectedDataType.value === 'windows') {
        if (!selectedRec.value.windows) {
          selectedRec.value = await getHrvRecording(selectedRec.value.id, true);
        }
        if (selectedRec.value.windows) {
          chartPoints.value = selectedRec.value.windows
            .map((w: any) => parseFloat(w.metrics && w.metrics[0] ? w.metrics[0][selectedMetric.value] : 0))
            .filter((v: number) => !isNaN(v));
        }
      } else {
        const val = parseFloat(selectedRec.value.metrics && selectedRec.value.metrics[0] ? selectedRec.value.metrics[0][selectedMetric.value] : 0);
        chartPoints.value = isNaN(val) ? [] : [val];
      }
    }

    if (chartPoints.value.length > 0) {
      maxMetricValue.value = Math.max(...chartPoints.value);
      minMetricValue.value = Math.min(...chartPoints.value);
    } else {
      chartError.value = "No data points found for this metric.";
    }
  } catch (e: any) {
    console.error("Error rendering chart:", e);
    chartError.value = e.message || "Failed to load chart data.";
  } finally {
    isLoadingChart.value = false;
  }
};

onMounted(() => {
  loadRecordings();
});
</script>

<style scoped>
.hrv-view {
  padding: 1rem;
}
.hrv-container {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}
.hrv-list, .hrv-form {
  flex: 1;
  min-width: 300px;
  background: var(--bg-surface);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border);
}
.hrv-item {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}
.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
.form-group label {
  margin-bottom: 0.5rem;
}
.form-group input, .form-group select, .form-group textarea {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg-background);
  color: var(--text-main);
}
.actions {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
}
.btn {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: none;
  background-color: var(--accent, #42a5f5);
  color: #fff;
  cursor: pointer;
  font-weight: bold;
  transition: filter 0.2s;
}
.btn:hover {
  filter: brightness(1.1);
}
.btn-primary {
  background-color: var(--accent, #42a5f5);
  color: #fff;
}
.btn-danger {
  background-color: #ef4444;
  color: #fff;
}
.btn-small {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  border-radius: 6px;
  border: none;
  background-color: #374151; /* Darkish gray */
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-small:hover {
  background-color: #4b5563;
}
.btn-danger.btn-small {
  background-color: #ef4444;
}
.btn-danger.btn-small:hover {
  background-color: #f87171;
}

.hrv-chart-section {
  flex: 1;
  min-width: 300px;
  background: var(--bg-surface);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  margin-bottom: 2rem;
}

.chart-controls {
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.chart-box {
  position: relative;
  background: var(--bg-background);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 1rem;
}

.chart-box svg {
  display: block;
  overflow: visible;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.chart-error {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
