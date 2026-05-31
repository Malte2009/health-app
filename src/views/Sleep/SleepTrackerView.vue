<template>
  <div class="sleep-tracker">
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ editId ? 'Edit Sleep Log' : 'Add Sleep Log' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label>Date:</label>
            <input type="date" v-model="form.date" />
          </div>
          <div class="form-group">
            <label>Sleep Type:</label>
            <input type="text" v-model="form.sleepType" placeholder="e.g. Night, Nap, etc." />
          </div>
          <div class="form-group">
            <label>Bed Time:</label>
            <input type="time" v-model="form.bedTime" />
          </div>
          <div class="form-group">
            <label>Wake Time:</label>
            <input type="time" v-model="form.wakeTime" />
          </div>

          <div class="form-group">
            <label>Sleep Latency:</label>
            <div class="duration-inputs">
              <input type="number" v-model.number="form.sleepLatencyHours" min="0" placeholder="hrs" /> <span>h</span>
              <input type="number" v-model.number="form.sleepLatencyMins" min="0" max="59" placeholder="mins" /> <span>m</span>
            </div>
          </div>
          <div class="form-group">
            <label>Wake Episodes:</label>
            <input type="number" v-model.number="form.wakeEpisodes" />
          </div>
          <div class="form-group">
            <label>Rested Score (1-10):</label>
            <input type="range" min="1" max="10" v-model.number="form.restedScore" /> {{ form.restedScore }}
          </div>

          <div class="form-group checkbox-group">
            <label><input type="checkbox" v-model="form.morningHeadache" /> Morning Headache</label>
          </div>
          <div class="form-group checkbox-group">
            <label><input type="checkbox" v-model="form.morningDizziness" /> Morning Dizziness</label>
          </div>

          <h3>Smartwatch Data (Read-only / Import)</h3>
          <div class="form-group">
            <label>Total Sleep:</label>
            <div class="duration-inputs">
              <input type="number" v-model.number="form.totalSleepHours" min="0" placeholder="hrs" /> <span>h</span>
              <input type="number" v-model.number="form.totalSleepMins" min="0" max="59" placeholder="mins" /> <span>m</span>
            </div>
          </div>
          <div class="form-group">
            <label>Awake Time:</label>
            <div class="duration-inputs">
              <input type="number" v-model.number="form.awakeHours" min="0" placeholder="hrs" /> <span>h</span>
              <input type="number" v-model.number="form.awakeMins" min="0" max="59" placeholder="mins" /> <span>m</span>
            </div>
          </div>
          <div class="form-group">
            <label>Light Sleep:</label>
            <div class="duration-inputs">
              <input type="number" v-model.number="form.lightSleepHours" min="0" placeholder="hrs" /> <span>h</span>
              <input type="number" v-model.number="form.lightSleepMins" min="0" max="59" placeholder="mins" /> <span>m</span>
            </div>
          </div>
          <div class="form-group">
            <label>Deep Sleep:</label>
            <div class="duration-inputs">
              <input type="number" v-model.number="form.deepSleepHours" min="0" placeholder="hrs" /> <span>h</span>
              <input type="number" v-model.number="form.deepSleepMins" min="0" max="59" placeholder="mins" /> <span>m</span>
            </div>
          </div>
          <div class="form-group">
            <label>REM Sleep:</label>
            <div class="duration-inputs">
              <input type="number" v-model.number="form.remSleepHours" min="0" placeholder="hrs" /> <span>h</span>
              <input type="number" v-model.number="form.remSleepMins" min="0" max="59" placeholder="mins" /> <span>m</span>
            </div>
          </div>
          <div class="form-group">
            <label>Turning Spike Count:</label>
            <input type="number" v-model.number="form.turningSpikeCount" />
          </div>
          <div class="form-group">
            <label>Turning Spike Max HR:</label>
            <input type="number" v-model.number="form.turningSpikeMaxHr" />
          </div>

          <div class="modal-actions">
            <button type="submit" class="button">Save Sleep</button>
            <button type="button" class="button delete-btn" @click="showModal = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <h2>Sleep Tracker</h2>

    <div class="control-panel" style="margin-bottom: 15px;">
      <label for="sleep-type-filter" style="margin-right: 10px; font-weight: 500;">Filter by Type:</label>
      <select id="sleep-type-filter" v-model="selectedSleepType" class="filter-select">
        <option value="">All Types</option>
        <option v-for="type in availableSleepTypes" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>

    <div class="sleep-table-container">
      <h3>Sleep History</h3>
      <table class="sleep-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Date</th>
            <th>Type</th>
            <th>Bed Time</th>
            <th>Wake Time</th>
            <th>Latency</th>
            <th>Awake</th>
            <th>Light Sleep</th>
            <th>Deep Sleep</th>
            <th>REM Sleep</th>
            <th>Total Sleep</th>
            <th>Rested Score</th>
            <th>Headache</th>
            <th>Dizziness</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="14" style="text-align: center;">
              <button class="button" @click="openAddModal" style="width: fit-content; margin: 10px auto;">Log Sleep Data</button>
            </td>
          </tr>
          <tr>
            <td>Average</td>
            <td></td>
            <td></td>
            <td>{{ averageSleep.bedTime }}</td>
            <td>{{ averageSleep.wakeTime }}</td>
            <td>{{ formatMinutes(averageSleep.sleepLatencyMinutes) }}</td>
            <td>{{ formatMinutes(averageSleep.awakeMinutes) }}</td>
            <td>{{ formatMinutes(averageSleep.lightSleepMinutes) }}</td>
            <td>{{ formatMinutes(averageSleep.deepSleepMinutes) }}</td>
            <td>{{ formatMinutes(averageSleep.remSleepMinutes) }}</td>
            <td>{{ formatMinutes(averageSleep.totalSleepMinutes) }}</td>
            <td>{{ roundTo(averageSleep.restedScore, 2) }}</td>
            <td colspan="3"></td>
          </tr>
          <tr v-for="log in filteredSleepLogs" :key="log.id">
            <td> {{ log.id }}</td>
            <td>{{ new Date(log.date).toLocaleDateString() }}</td>
            <td>{{ log.sleepType || '' }}</td>
            <td>{{ log.bedTime ? formatTime(log.bedTime) : '' }}</td>
            <td>{{ log.wakeTime ? formatTime(log.wakeTime) : '' }}</td>
            <td>{{ log.sleepLatencyMinutes != null ? formatMinutes(log.sleepLatencyMinutes) : '' }}</td>
            <td>{{ log.awakeMinutes != null ? formatMinutes(log.awakeMinutes) : '' }}</td>
            <td>{{ log.lightSleepMinutes != null ? formatMinutes(log.lightSleepMinutes) : '' }}</td>
            <td>{{ log.deepSleepMinutes != null ? formatMinutes(log.deepSleepMinutes) : '' }}</td>
            <td>{{ log.remSleepMinutes != null ? formatMinutes(log.remSleepMinutes) : '' }}</td>
            <td>{{ log.totalSleepMinutes != null ? formatMinutes(log.totalSleepMinutes) : '' }}</td>
            <td>{{ log.restedScore }}</td>
            <td>{{ log.morningHeadache ? 'Yes' : 'No' }}</td>
            <td>{{ log.morningDizziness ? 'Yes' : 'No' }}</td>
            <td>
              <button class="button" @click="openEditModal(log)" style="margin-right: 5px;">Edit</button>
              <button v-if="log.hrvRecording" class="button hrv-report-btn" @click="goToHrv(log.hrvRecording.id)">HRV Report</button>
              <button class="button delete-btn" @click="deleteSleep(log.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getSleepLogs, createSleepLog, updateSleepLog, deleteSleepLog } from '@/services/sleepService';
import { useRouter } from 'vue-router';
import type { SleepLog } from '@/types/sleepType';
import type { CreateSleepLog, UpdateSleepLog } from '@/types/sleepType';
import { roundTo } from '@/utility/math';
import { toLocalIsoDate, createLocalTimeDate, toLocalTimeString, formatTime } from '@/utility/date';

const router = useRouter();

type SleepFormState = {
  date: string;
  bedTime: string;
  wakeTime: string;
  sleepLatencyHours: number;
  sleepLatencyMins: number;
  wakeEpisodes: number;
  restedScore: number;
  morningHeadache: boolean;
  morningDizziness: boolean;
  totalSleepHours: number;
  totalSleepMins: number;
  awakeHours: number;
  awakeMins: number;
  lightSleepHours: number;
  lightSleepMins: number;
  deepSleepHours: number;
  deepSleepMins: number;
  remSleepHours: number;
  remSleepMins: number;
  turningSpikeCount: number;
  turningSpikeMaxHr: number;
  subjectiveHours: number;
  notes: string;
  sleepType: string;
};

const form = ref<SleepFormState>({
  date: toLocalIsoDate(),
  bedTime: '22:00',
  wakeTime: '07:00',
  sleepLatencyHours: 0,
  sleepLatencyMins: 15,
  wakeEpisodes: 0,
  restedScore: 5,
  morningHeadache: false,
  morningDizziness: false,
  totalSleepHours: 0,
  totalSleepMins: 0,
  awakeHours: 0,
  awakeMins: 0,
  lightSleepHours: 0,
  lightSleepMins: 0,
  deepSleepHours: 0,
  deepSleepMins: 0,
  remSleepHours: 0,
  remSleepMins: 0,
  turningSpikeCount: 0,
  turningSpikeMaxHr: 0,
  subjectiveHours: 0,
  notes: '',
  sleepType: ''
});

const showModal = ref(false);
const editId = ref<string | null>(null);

const sleepLogs = ref<SleepLog[]>([]);

const selectedSleepType = ref("");

const availableSleepTypes = computed(() => {
  const types = new Set<string>();
  for (const log of sleepLogs.value) {
    if (log.sleepType) {
      types.add(log.sleepType);
    }
  }
  return Array.from(types).sort();
});

const filteredSleepLogs = computed(() => {
  if (!selectedSleepType.value) return sleepLogs.value;
  return sleepLogs.value.filter(log => log.sleepType === selectedSleepType.value);
});

const calculateAverageTime = (times: string[]) => {
  if (!times.length) return "00:00";
  let sumSin = 0;
  let sumCos = 0;
  times.forEach(t => {
    const d = new Date(t);
    const minutes = d.getHours() * 60 + d.getMinutes();
    const angle = (minutes / (24 * 60)) * 2 * Math.PI;
    sumSin += Math.sin(angle);
    sumCos += Math.cos(angle);
  });
  const avgAngle = Math.atan2(sumSin / times.length, sumCos / times.length);
  let avgMinutes = Math.round((avgAngle / (2 * Math.PI)) * 24 * 60);
  if (avgMinutes < 0) avgMinutes += 24 * 60;
  const h = Math.floor(avgMinutes / 60).toString().padStart(2, '0');
  const m = (avgMinutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

const averageSleep = computed(() => {
  if (filteredSleepLogs.value.length === 0) return { totalSleepMinutes: 0, sleepLatencyMinutes: 0, awakeMinutes: 0, lightSleepMinutes: 0, deepSleepMinutes: 0, remSleepMinutes: 0, restedScore: 0, bedTime: "00:00", wakeTime: "00:00" };
  const length = filteredSleepLogs.value.length;
  const totalSleepMinutes = filteredSleepLogs.value.reduce((acc, log) => acc + (log.totalSleepMinutes || 0), 0) / length;
  const sleepLatencyMinutes = filteredSleepLogs.value.reduce((acc, log) => acc + (log.sleepLatencyMinutes || 0), 0) / length;
  const awakeMinutes = filteredSleepLogs.value.reduce((acc, log) => acc + (log.awakeMinutes || 0), 0) / length;
  const lightSleepMinutes = filteredSleepLogs.value.reduce((acc, log) => acc + (log.lightSleepMinutes || 0), 0) / length;
  const deepSleepMinutes = filteredSleepLogs.value.reduce((acc, log) => acc + (log.deepSleepMinutes || 0), 0) / length;
  const remSleepMinutes = filteredSleepLogs.value.reduce((acc, log) => acc + (log.remSleepMinutes || 0), 0) / length;
  const restedScore = filteredSleepLogs.value.reduce((acc, log) => acc + (log.restedScore || 0), 0) / length;
  const avgBedTime = calculateAverageTime(filteredSleepLogs.value.map(log => log.bedTime).filter((t): t is string => !!t));
  const avgWakeTime = calculateAverageTime(filteredSleepLogs.value.map(log => log.wakeTime).filter((t): t is string => !!t));
  return { totalSleepMinutes, sleepLatencyMinutes, awakeMinutes, lightSleepMinutes, deepSleepMinutes, remSleepMinutes, restedScore, bedTime: avgBedTime, wakeTime: avgWakeTime };
});

const formatMinutes = (minutes: number) => {
  if (isNaN(minutes)) return "0h 0m";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}m`;
};

const sortSleepLogs = (logs: SleepLog[]) => {
  logs.sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    if (da !== db) return db - da; // Descending by date

    // Sort by bedtime if dates are the same
    const ta = a.bedTime ? new Date(a.bedTime).getTime() : 0;
    const tb = b.bedTime ? new Date(b.bedTime).getTime() : 0;
    return tb - ta; // Descending by time
  });
};

const loadData = async () => {
  try {
    const sl = await getSleepLogs();
    sortSleepLogs(sl);
    sleepLogs.value = sl;
  } catch (err) {
    console.error(err);
  }
};

const goToHrv = (id?: string) => {
  if (id) router.push(`/hrv/${id}`);
};

const openAddModal = () => {
  editId.value = null;
  form.value = {
    date: toLocalIsoDate(),
    bedTime: '22:00',
    wakeTime: '07:00',
    sleepLatencyHours: 0,
    sleepLatencyMins: 15,
    wakeEpisodes: 0,
    restedScore: 5,
    morningHeadache: false,
    morningDizziness: false,
    totalSleepHours: 0,
    totalSleepMins: 0,
    awakeHours: 0,
    awakeMins: 0,
    lightSleepHours: 0,
    lightSleepMins: 0,
    deepSleepHours: 0,
    deepSleepMins: 0,
    remSleepHours: 0,
    remSleepMins: 0,
    turningSpikeCount: 0,
    turningSpikeMaxHr: 0,
    subjectiveHours: 0,
    notes: '',
    sleepType: ''
  };
  showModal.value = true;
};

const openEditModal = (log: SleepLog) => {
  editId.value = log.id;
  form.value = {
    date: new Date(log.date).toISOString().substring(0, 10),
    bedTime: log.bedTime ? toLocalTimeString(new Date(log.bedTime)) : '',
    wakeTime: log.wakeTime ? toLocalTimeString(new Date(log.wakeTime)) : '',
    sleepLatencyHours: Math.floor((log.sleepLatencyMinutes || 0) / 60),
    sleepLatencyMins: Math.round((log.sleepLatencyMinutes || 0) % 60),
    wakeEpisodes: log.wakeEpisodes ?? 0,
    restedScore: log.restedScore ?? 5,
    morningHeadache: log.morningHeadache ?? false,
    morningDizziness: log.morningDizziness ?? false,
    totalSleepHours: Math.floor((log.totalSleepMinutes || 0) / 60),
    totalSleepMins: Math.round((log.totalSleepMinutes || 0) % 60),
    awakeHours: Math.floor((log.awakeMinutes || 0) / 60),
    awakeMins: Math.round((log.awakeMinutes || 0) % 60),
    lightSleepHours: Math.floor((log.lightSleepMinutes || 0) / 60),
    lightSleepMins: Math.round((log.lightSleepMinutes || 0) % 60),
    deepSleepHours: Math.floor((log.deepSleepMinutes || 0) / 60),
    deepSleepMins: Math.round((log.deepSleepMinutes || 0) % 60),
    remSleepHours: Math.floor((log.remSleepMinutes || 0) / 60),
    remSleepMins: Math.round((log.remSleepMinutes || 0) % 60),
    turningSpikeCount: log.turningSpikeCount ?? 0,
    turningSpikeMaxHr: log.turningSpikeMaxHr ?? 0,
    subjectiveHours: log.subjectiveHours ?? 0,
    notes: log.notes ?? '',
    sleepType: log.sleepType || ''
  };
  showModal.value = true;
};

const submitForm = async () => {
  const data: CreateSleepLog = {
    date: new Date(form.value.date).toISOString(),
    bedTime: createLocalTimeDate(form.value.bedTime).toISOString(),
    wakeTime: createLocalTimeDate(form.value.wakeTime).toISOString(),
    sleepLatencyMinutes: (form.value.sleepLatencyHours || 0) * 60 + (form.value.sleepLatencyMins || 0),
    totalSleepMinutes: (form.value.totalSleepHours || 0) * 60 + (form.value.totalSleepMins || 0),
    awakeMinutes: (form.value.awakeHours || 0) * 60 + (form.value.awakeMins || 0),
    lightSleepMinutes: (form.value.lightSleepHours || 0) * 60 + (form.value.lightSleepMins || 0),
    deepSleepMinutes: (form.value.deepSleepHours || 0) * 60 + (form.value.deepSleepMins || 0),
    remSleepMinutes: (form.value.remSleepHours || 0) * 60 + (form.value.remSleepMins || 0),
    turningSpikeCount: form.value.turningSpikeCount,
    turningSpikeMaxHr: form.value.turningSpikeMaxHr,
    subjectiveHours: form.value.subjectiveHours,
    notes: form.value.notes,
    sleepType: form.value.sleepType || ''
  };
  if (editId.value) {
    await updateSleepLog(editId.value, data as UpdateSleepLog);
  } else {
    await createSleepLog(data);
  }
  showModal.value = false;
  await loadData();
};

const deleteSleep = async (id: string) => {
  if (confirm("Delete this sleep log?")) {
    await deleteSleepLog(id);
    await loadData();
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.form-group { margin-bottom: 1rem; }
.sleep-table-container {
  margin-top: 20px;
  overflow-x: auto;
}
.sleep-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-surface);
  text-align: center;
}
.sleep-table th, .sleep-table td {
  padding: 8px;
  border: 1px solid var(--border, #ccc);
}
.sleep-table th {
  background: var(--bg-surface-secondary, #f4f4f4);
}
.sleep-table tbody tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.05);
}

@media (prefers-color-scheme: dark) {
  .sleep-table tbody tr:nth-child(even) {
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
}
.button:hover {
  opacity: 0.9;
}

.hrv-report-btn {
  margin-right: 5px;
  background-color: var(--primary);
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

.control-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.control-panel label {
  color: var(--text-secondary);
}

.filter-select {
  min-width: 220px;
  padding: 0.6rem 0.85rem;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-surface-secondary);
  color: var(--text-main);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.filter-select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 209, 196, 0.15);
}
.duration-inputs {
  display: flex;
  gap: 8px;
  align-items: center;
}
.duration-inputs input {
  width: 80px;
}
.checkbox-group {
  flex-direction: row;
  align-items: center;
}
.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  cursor: pointer;
  font-weight: normal;
}
.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
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
