<template>
  <div class="calendar-page">
    <div class="calendar-header">
      <div class="month-controls">
        <button class="nav-btn" @click="prevMonth">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h2>{{ currentMonthName }} {{ currentYear }}</h2>
        <button class="nav-btn" @click="nextMonth">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      <div class="toggles-panel">
        <div class="toggle-group">
          <label class="toggle-label"><input type="checkbox" v-model="toggles.micro" /> Micronutrients</label>
          <label class="toggle-label"><input type="checkbox" v-model="toggles.symptoms" /> Symptoms</label>
          <label class="toggle-label"><input type="checkbox" v-model="toggles.syncopes" /> Syncopes</label>
          <label class="toggle-label"><input type="checkbox" v-model="toggles.bp" /> Blood Pressure</label>
          <label class="toggle-label"><input type="checkbox" v-model="toggles.sleep" /> Sleep</label>
          <label class="toggle-label"><input type="checkbox" v-model="toggles.training" /> Training</label>
          <label class="toggle-label"><input type="checkbox" v-model="toggles.daily" /> Daily Logs</label>
          <label class="toggle-label"><input type="checkbox" v-model="toggles.intake" /> Intake Logs</label>
        </div>

        <div class="sub-toggle-group" v-if="toggles.micro">
          <span class="sub-label">Micro Focus:</span>
          <label class="toggle-label" v-for="micro in MICROS_LIST" :key="micro">
            <input type="checkbox" v-model="microToggles[micro]" /> {{ formatMicroName(micro) }}
          </label>
        </div>
      </div>
    </div>

    <div class="calendar-container">
      <div class="calendar-grid">
        <div v-for="dayName in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="dayName" class="weekday-header">
          {{ dayName }}
        </div>
        <div
          v-for="day in calendarDays"
          :key="day.dateStr"
          class="day-cell"
          :class="{ 'out-of-month': !day.inMonth, 'today': day.isToday }"
          @click="selectedDay = day"
        >
          <div class="day-number">{{ day.dayNumber }}</div>

          <div class="day-content" v-if="day.inMonth">
            <div v-if="toggles.symptoms && day.symptoms.length" class="event-pill symptom">
              {{ day.symptoms.length }} Symptom{{ day.symptoms.length > 1 ? 's' : '' }}
            </div>

            <div v-if="toggles.syncopes && day.syncopes.length" class="event-pill syncope">
              {{ day.syncopes.length }} Syncope{{ day.syncopes.length > 1 ? 's' : '' }}
            </div>

            <div v-if="toggles.bp && day.bp.length" class="event-pill bp">
               BP
            </div>

            <div v-if="toggles.sleep && day.sleep.length" class="event-pill sleep">
               {{ Math.round(day.sleep[0].totalSleepMinutes / 60) }}h Sleep
            </div>

            <div v-if="toggles.training && day.training.length" class="event-pill training">
               {{ day.training.length }} Workout{{ day.training.length > 1 ? 's' : '' }}
            </div>

            <div v-if="toggles.daily && day.daily.length" class="event-pill daily">
               Daily
            </div>

            <div v-if="toggles.intake && day.intake.length" class="event-pill intake">
               {{ day.intake.length }} Intake
            </div>

            <template v-if="toggles.micro && day.micro">
              <template v-for="micro in MICROS_LIST" :key="micro">
                <div v-if="microToggles[micro] && day.micro[micro] > 0" class="event-pill micro" :class="micro">
                  {{ formatMicroName(micro) }}: {{ day.micro[micro] }}
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedDay" class="modal-overlay" @click.self="selectedDay = null">
      <div class="modal">
        <div class="modal-header">
          <h3>Details for {{ selectedDay.dateStr }}</h3>
          <button class="close-btn" @click="selectedDay = null">&times;</button>
        </div>

        <div class="modal-body">
          <div class="details-card" v-if="selectedDay.symptoms.length">
            <h4 class="card-title symptom-text">Symptoms</h4>
            <ul class="detail-list">
              <li v-for="s in selectedDay.symptoms" :key="s.id">{{ s.symptom?.name }} (Intensity: {{ s.intensity }})</li>
            </ul>
          </div>

          <div class="details-card" v-if="selectedDay.syncopes.length">
            <h4 class="card-title syncope-text">Syncopes</h4>
            <ul class="detail-list">
              <li v-for="s in selectedDay.syncopes" :key="s.id">{{ new Date(s.timestamp).toLocaleTimeString() }}</li>
            </ul>
          </div>

          <div class="details-card" v-if="selectedDay.bp.length">
            <h4 class="card-title bp-text">Blood Pressure</h4>
            <ul class="detail-list">
              <li v-for="b in selectedDay.bp" :key="b.id">{{ b.systolic }}/{{ b.diastolic }} mmHg (HR: {{ b.heartRate }})</li>
            </ul>
          </div>

          <div class="details-card" v-if="selectedDay.sleep.length">
            <h4 class="card-title sleep-text">Sleep</h4>
            <ul class="detail-list">
              <li v-for="s in selectedDay.sleep" :key="s.id">{{ Math.floor(s.totalSleepMinutes / 60) }}h {{ s.totalSleepMinutes % 60 }}min</li>
            </ul>
          </div>

          <div class="details-card" v-if="selectedDay.training.length">
            <h4 class="card-title training-text">Training</h4>
            <ul class="detail-list">
              <li v-for="t in selectedDay.training" :key="t.id">{{ t.name }}</li>
            </ul>
          </div>

          <div class="details-card" v-if="selectedDay.micro">
            <h4 class="card-title micro-text">Micronutrients</h4>
            <div class="micro-stats">
              <template v-for="micro in MICROS_LIST" :key="micro">
                <p v-if="selectedDay.micro[micro] !== undefined && selectedDay.micro[micro] !== null">
                  <strong>{{ formatMicroName(micro) }}:</strong> {{ selectedDay.micro[micro] }}
                </p>
              </template>
            </div>
          </div>

          <div class="empty-state" v-if="!selectedDay.symptoms.length && !selectedDay.syncopes.length && !selectedDay.bp.length && !selectedDay.sleep.length && !selectedDay.training.length && !selectedDay.micro">
            <p>No tracked data for this day.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import {
  getMicroOverMonth,
  getSymptomsOverMonth,
  getSyncopesOverMonth,
  getBloodPressureOverMonth,
  getSleepOverMonth,
  getTrainingOverMonth,
  getDailyLogsOverMonth,
  getIntakeLogsOverMonth
} from '@/services/diagnosticService';

const currentDate = ref(new Date());

const toggles = reactive({
  micro: true,
  symptoms: true,
  syncopes: true,
  bp: true,
  sleep: true,
  training: true,
  daily: true,
  intake: true,
});

const MICROS_LIST = [
  'vitamin_a', 'vitamin_d', 'vitamin_e', 'vitamin_k', 'vitamin_b1', 'vitamin_b2', 'vitamin_b3',
  'vitamin_b5', 'vitamin_b6', 'vitamin_b7', 'vitamin_b9', 'vitamin_b12', 'choline', 'caffeine',
  'calcium', 'phosphorus', 'magnesium', 'sodium', 'potassium', 'chloride', 'sulfur', 'iron',
  'zinc', 'selenium', 'iodine', 'copper', 'manganese', 'chromium', 'molybdenum', 'fluoride',
  'vitamin_c', 'omega_3', 'omega_6', 'omega_9'
];

const microToggles = reactive<Record<string, boolean>>(
  MICROS_LIST.reduce((acc, key) => {
    acc[key] = (key === 'caffeine'); // Default on for caffeine as example
    return acc;
  }, {} as Record<string, boolean>)
);

const formatMicroName = (name: string) => {
  return name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data = reactive<Record<string, any>>({
  micro: [],
  symptoms: [],
  syncopes: [],
  bp: [],
  sleep: [],
  training: [],
  daily: [],
  intake: [],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedDay = ref<any>(null);

const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth());
const currentMonthName = computed(() => currentDate.value.toLocaleString('default', { month: 'long' }));

const prevMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
  fetchData();
};

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
  fetchData();
};

const formatDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const fetchData = async () => {
  // Use local time limits to fetch the month (start of current month to start of next month)
  const start = new Date(currentYear.value, currentMonth.value, 1);
  const end = new Date(currentYear.value, currentMonth.value + 1, 1);

  const startStr = formatDate(start);
  const endStr = formatDate(end);

  try {
    const [
      microRes, symptomsRes, syncopesRes, bpRes, sleepRes, trainingRes, dailyRes, intakeRes
    ] = await Promise.all([
      getMicroOverMonth(startStr, endStr),
      getSymptomsOverMonth(startStr, endStr),
      getSyncopesOverMonth(startStr, endStr),
      getBloodPressureOverMonth(startStr, endStr),
      getSleepOverMonth(startStr, endStr),
      getTrainingOverMonth(startStr, endStr),
      getDailyLogsOverMonth(startStr, endStr),
      getIntakeLogsOverMonth(startStr, endStr),
    ]);

    data.micro = microRes;
    data.symptoms = symptomsRes;
    data.syncopes = syncopesRes;
    data.bp = bpRes;
    data.sleep = sleepRes;
    data.training = trainingRes;
    data.daily = dailyRes;
    data.intake = intakeRes;
  } catch (error) {
    console.error("Failed to fetch diagnostic data", error);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildMap = (arr: any[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map: Record<string, any> = {};
  for (const item of arr) {
    map[item.date] = item.items !== undefined ? item.items : item;
  }
  return map;
};

const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const days = [];

  const microMap = buildMap(data.micro);
  const symptomsMap = buildMap(data.symptoms);
  const syncopesMap = buildMap(data.syncopes);
  const bpMap = buildMap(data.bp);
  const sleepMap = buildMap(data.sleep);
  const trainingMap = buildMap(data.training);
  const dailyMap = buildMap(data.daily);
  const intakeMap = buildMap(data.intake);

  // padding for previous month
  // Monday as first day: if getDay() is 0 (Sun), then offset is 6. Otherwise getDay() - 1
  const startOffset = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;

  for (let i = startOffset - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ dayNumber: d.getDate(), inMonth: false, dateStr: formatDate(d), isToday: false });
  }

  const todayStr = formatDate(new Date());

  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const d = new Date(year, month, i);
    const dateStr = formatDate(d);

    days.push({
      dayNumber: i,
      inMonth: true,
      dateStr,
      isToday: dateStr === todayStr,
      micro: microMap[dateStr] || null,
      symptoms: symptomsMap[dateStr] || [],
      syncopes: syncopesMap[dateStr] || [],
      bp: bpMap[dateStr] || [],
      sleep: sleepMap[dateStr] || [],
      training: trainingMap[dateStr] || [],
      daily: dailyMap[dateStr] || [],
      intake: intakeMap[dateStr] || [],
    });
  }

  // padding next month to assure 6 rows (42 days)
  const endOffset = 42 - days.length;
  for (let i = 1; i <= endOffset; i++) {
    const d = new Date(year, month + 1, i);
    days.push({ dayNumber: d.getDate(), inMonth: false, dateStr: formatDate(d), isToday: false });
  }

  return days;
});

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.calendar-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.calendar-header {
  margin-bottom: 24px;
}

.month-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.month-controls h2 {
  font-size: 1.5rem;
  margin: 0;
  min-width: 200px;
  text-align: center;
}

.nav-btn {
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  color: var(--text-main);
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.toggles-panel {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.toggle-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.sub-toggle-group {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--border);
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.sub-label {
  font-weight: 600;
  color: var(--text-secondary);
  margin-right: 8px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  user-select: none;
}

.toggle-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
}

.calendar-container {
  flex: 1;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  height: 100%;
}

.weekday-header {
  text-align: center;
  font-weight: 600;
  padding: 12px 8px;
  background: var(--bg-surface-secondary);
  border-bottom: 1px solid var(--border);
  border-right: 1px solid var(--border);
  color: var(--text-secondary);
}

.weekday-header:last-child {
  border-right: none;
}

.day-cell {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  border-right: 1px solid var(--border);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 120px;
  cursor: pointer;
  transition: background-color 0.15s;
}

.day-cell:nth-child(7n) {
  border-right: none;
}

.day-cell:hover {
  background: var(--bg-surface-secondary);
}

.day-cell.out-of-month {
  background: rgba(0, 0, 0, 0.1);
  opacity: 0.5;
}

.day-cell.today {
  background: var(--bg-surface-secondary);
  box-shadow: inset 0 0 0 2px var(--primary);
}

.day-number {
  font-weight: 600;
  font-size: 0.95rem;
  text-align: right;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.day-cell.today .day-number {
  color: var(--primary);
  font-weight: 800;
}

.day-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  max-height: 80px;
  scrollbar-width: none;
}
.day-content::-webkit-scrollbar { display: none; }

.event-pill {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}

/* Updated Colors to blend nicely with the dark theme */
.symptom { background: linear-gradient(135deg, #ef4444, #dc2626); }
.syncope { background: linear-gradient(135deg, #b91c1c, #991b1b); }
.bp { background: linear-gradient(135deg, #f59e0b, #d97706); }
.sleep { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.training { background: linear-gradient(135deg, #10b981, #059669); }
.daily { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.intake { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.micro { background: linear-gradient(135deg, #6b7280, #4b5563); }
.micro.caffeine { background: linear-gradient(135deg, #92400e, #78350f); }
.micro.alc { background: linear-gradient(135deg, #6d28d9, #5b21b6); }
.micro.sug { background: linear-gradient(135deg, #db2777, #be185d); }


/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: var(--bg-main);
  border: 1px solid var(--border);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0;
}

.close-btn:hover {
  color: var(--text-main);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.details-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
}

.card-title {
  margin: 0 0 12px 0;
  font-size: 1.1rem;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.symptom-text { color: #ef4444; }
.syncope-text { color: #b91c1c; }
.bp-text { color: #f59e0b; }
.sleep-text { color: #3b82f6; }
.training-text { color: #10b981; }
.micro-text { color: #8b5cf6; }

.detail-list {
  padding-left: 20px;
  margin: 0;
  color: var(--text-secondary);
}

.detail-list li {
  margin-bottom: 6px;
}

.micro-stats p {
  margin: 4px 0;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
  background: var(--bg-surface);
  border-radius: 8px;
  border: 1px dashed var(--border);
}
</style>
