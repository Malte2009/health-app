<template>
  <div class="day-details-page">
    <div class="header">
      <router-link to="/calendar" class="back-link">&larr; Back to Calendar</router-link>
      <h2>Details for {{ formattedDate }}</h2>
    </div>

    <div v-if="loading" class="loading">Loading data...</div>

    <div v-else-if="loadError" class="loading error" role="alert">{{ loadError }}</div>

    <div v-else class="dashboard-grid">
      <!-- Workout -->
      <div class="card" v-if="data.workouts.length > 0" @click="goTo('/workouts')">
        <h3 class="card-title workout-text">Workouts</h3>
        <ul class="detail-list">
          <li v-for="t in data.workouts" :key="t.id" @click.stop="goTo('/workouts/' + t.id)" class="clickable-item">
            <strong>{{ t.name }}</strong>
            <div class="note" v-if="formatWorkoutDetails(t)">{{ formatWorkoutDetails(t) }}</div>
          </li>
        </ul>
        <div class="card-footer">Click to view all workouts &rarr;</div>
      </div>

      <!-- Sleep -->
      <div class="card" v-if="data.sleep.length > 0" @click="goTo('/sleep-tracker')">
        <h3 class="card-title sleep-text">Sleep</h3>
        <ul class="detail-list expanded-sleep-list">
          <li v-for="s in data.sleep" :key="s.id">
            <div class="sleep-header">
              <strong>{{ Math.floor(s.totalSleepMinutes / 60) }}h {{ s.totalSleepMinutes % 60 }}min</strong>
              <span v-if="s.sleepType">- {{ s.sleepType }}</span>
            </div>
            <div class="sleep-times">
              <span v-if="s.bedTime && s.wakeTime">{{ s.bedTime }} to {{ s.wakeTime }}</span>
              <span v-if="s.restedScore" class="sleep-score">Score: {{ s.restedScore }}/10</span>
            </div>
            <div class="sleep-issues" v-if="s.morningHeadache || s.morningDizziness">
              <span class="warning-badge" v-if="s.morningHeadache">Headache</span>
              <span class="warning-badge" v-if="s.morningDizziness">Dizziness</span>
            </div>
          </li>
        </ul>
        <div class="card-footer">Click to view sleep tracker &rarr;</div>
      </div>

      <!-- HRV -->
      <div class="card" v-if="data.hrv.length > 0" @click="goTo('/hrv')">
        <h3 class="card-title hrv-text">HRV Recordings</h3>
        <ul class="detail-list">
          <li v-for="h in data.hrv" :key="h.id" @click.stop="goTo('/hrv/' + h.id)" class="clickable-item">
            <strong>{{ h.name || "Unlocked Recording" }}</strong>
            <span v-if="h.context">({{ h.context }})</span>
            <div class="note" v-if="h.description">{{ h.description }}</div>
          </li>
        </ul>
        <div class="card-footer">Click to view HRV dashboard &rarr;</div>
      </div>
      <div class="card" v-else @click="goTo('/hrv')">
        <h3 class="card-title hrv-text">HRV</h3>
        <p>No Heart Rate Variability data found for this date.</p>
        <div class="card-footer">Click to view HRV dashboard &rarr;</div>
      </div>

      <!-- Symptoms -->
      <div class="card" v-if="data.symptoms.length > 0" @click="goTo('/symptoms')">
        <h3 class="card-title symptom-text">Symptoms</h3>
        <div class="detail-cards">
          <div v-for="s in data.symptoms" :key="s.id" class="mini-detail-card symptom-card" @click.stop="goTo('/symptoms')">
            <div class="mini-detail-header">
              <div>
                <h4>{{ formatSymptomName(s.name) }}</h4>
                <p>{{ formatDateTime(s.timestamp) }}</p>
              </div>
              <span class="detail-badge symptom-badge">{{ formatSymptomSeverity(s.severity) }}</span>
            </div>

            <div class="mini-detail-meta">
              <span class="detail-chip" v-if="s.position">{{ s.position }}</span>
              <span class="detail-chip" v-if="s.trigger">Trigger: {{ s.trigger }}</span>
              <span class="detail-chip" v-if="s.pulsatile">Pulsatile</span>
            </div>

            <div class="mini-detail-flags">
              <span class="detail-pill" v-if="s.worseOnBendingForward">Worse Bend</span>
              <span class="detail-pill" v-if="s.worseOnLyingDown">Worse Lying</span>
              <span class="detail-pill" v-if="s.betterOnLyingDown">Better Lying</span>
            </div>

            <p class="mini-detail-note" v-if="s.notes">{{ s.notes }}</p>
          </div>
        </div>
        <div class="card-footer">Click to view symptoms &rarr;</div>
      </div>

      <!-- Syncopes -->
      <div class="card" v-if="data.syncopes.length > 0" @click="goTo('/symptoms')">
        <h3 class="card-title syncope-text">Syncopes</h3>
        <div class="detail-cards">
          <div v-for="s in data.syncopes" :key="s.id" class="mini-detail-card syncope-card" @click.stop="goTo('/symptoms')">
            <div class="mini-detail-header">
              <div>
                <h4>{{ formatSyncopeName(s.name) }}</h4>
                <p>{{ formatDateTime(s.timestamp) }}</p>
              </div>
              <span class="detail-badge syncope-badge">{{ formatSyncopeOutcome(s.outcome) }}</span>
            </div>

            <div class="mini-detail-meta">
              <span class="detail-chip" v-if="s.position">{{ s.position }}</span>
              <span class="detail-chip" v-if="s.trigger">Trigger: {{ s.trigger }}</span>
              <span class="detail-chip" v-if="s.activityBefore">Before: {{ s.activityBefore }}</span>
            </div>

            <div class="mini-detail-flags">
              <span class="detail-pill" v-if="s.amnesia">Amnesia{{ s.amnesiaDurationMinutes ? ` (${s.amnesiaDurationMinutes} min)` : "" }}</span>
              <span class="detail-pill" v-if="s.injuries">Injuries</span>
              <span class="detail-pill" v-if="s.saltSupplementation">Salt</span>
            </div>

            <p class="mini-detail-note" v-if="s.notes">{{ s.notes }}</p>
          </div>
        </div>
        <div class="card-footer">Click to view symptoms/syncopes &rarr;</div>
      </div>

      <!-- Blood Pressure -->
      <div class="card" v-if="data.bp.length > 0" @click="goTo('/vitals')">
        <h3 class="card-title bp-text">Blood Pressure</h3>
        <ul class="detail-list">
          <li v-for="b in data.bp" :key="b.id">
            {{ formatBloodPressureDetails(b) }}
          </li>
        </ul>
        <div class="card-footer">Click to view vitals &rarr;</div>
      </div>

      <!-- Daily Logs -->
      <div class="card" v-if="data.daily.length > 0" @click="goTo('/daily-tracking')">
        <h3 class="card-title daily-text">Daily Logs</h3>
        <ul class="detail-list">
          <li v-for="d in data.daily" :key="d.id">
            {{ formatDailyLogDetails(d) }}
            <div class="note" v-if="d.notes">"{{ d.notes }}"</div>
          </li>
        </ul>
        <div class="card-footer">Click to view daily tracking &rarr;</div>
      </div>

      <!-- Intake Logs -->
      <div class="card" v-if="data.intake.length > 0" @click="goTo('/daily-tracking')">
        <h3 class="card-title intake-text">Intake Logs</h3>
        <ul class="detail-list">
          <li v-for="entry in data.intake" :key="entry.id">
            {{ formatIntakeDetails(entry) }}
            <div class="note" v-if="entry.notes">"{{ entry.notes }}"</div>
          </li>
        </ul>
        <div class="card-footer">Click to view daily tracking &rarr;</div>
      </div>

      <!-- Food / Intake Logs -->
      <div class="card" v-if="data.food && activeFoods.length > 0" @click="goTo('/food?date=' + formattedQueryDate)">
        <h3 class="card-title food-text">Food Logs</h3>
        <ul class="detail-list">
          <li v-for="(food, index) in activeFoods" :key="index">
            {{ food.name }} <span v-if="food.totalWeight_g">({{ food.totalWeight_g }}g)</span>
          </li>
        </ul>
        <div class="card-footer">Click to view food dashboard &rarr;</div>
      </div>

      <!-- Micros -->
      <div class="card" v-if="data.micro && Object.keys(data.micro).length" @click="goTo('/food/progress')">
        <h3 class="card-title micro-text">Micronutrients Summary</h3>
        <div class="micro-stats">
          <template v-for="(val, key) in data.micro" :key="key">
            <div class="micro-item" v-if="val > 0">
              <span class="micro-name">{{ formatMicroName(String(key)) }}</span>
              <span class="micro-val">{{ val }}</span>
            </div>
          </template>
        </div>
        <div class="card-footer">Click to view micronutrient progress &rarr;</div>
      </div>

      <!-- Empty State handling -->
      <div class="card empty-state" v-if="isEmpty">
        <p>No logged data available for this date.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, computed, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import healthDayService from "@/services/daily/healthDay.service.ts";
import { formatDateTime } from "@/utility/date.ts";
import { calculateMicronutrientTotals, getHealthDayFoodLogs, HEALTH_DAY_SUMMARY_INCLUDES, summarizeFoodLogs } from "@/utility/healthDay.ts";

const route = useRoute();
const router = useRouter();

const dateStr = computed(() => (Array.isArray(route.params.date) ? route.params.date[0] : route.params.date));
const formattedQueryDate = computed(() => dateStr.value || "");
const formattedDate = computed(() => {
  if (!dateStr.value) return "";
  const d = new Date(dateStr.value);
  return d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
});

const loading = ref(true);
const loadError = ref("");

const data = reactive<any>({
  micro: {},
  symptoms: [],
  syncopes: [],
  bp: [],
  sleep: [],
  workouts: [],
  daily: [],
  intake: [],
  food: null,
  hrv: [],
});

const goTo = (path: string) => {
  router.push(path);
};

const formatMicroName = (name: string): string => {
  return name.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const getBloodPressurePulse = (bp: any): number | null => {
  const pulse = bp?.pulse ?? bp?.heartRate ?? bp?.hr;
  if (pulse == null || pulse === "") return null;
  const value = Number(pulse);
  return Number.isNaN(value) ? null : value;
};

const formatBloodPressureDetails = (bp: any): string => {
  if (!bp) return "";
  const parts = [`${bp.systolic}/${bp.diastolic} mmHg`];
  const pulse = getBloodPressurePulse(bp);
  if (pulse !== null) parts.push(`Pulse: ${pulse} bpm`);
  return parts.join(" · ");
};

const formatSymptomName = (name?: string) => {
  if (!name) return "Symptom";
  return name
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatSyncopeName = (name?: string) => {
  if (!name) return "Syncope";
  return name
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatSymptomSeverity = (severity?: number) => {
  if (severity === undefined || severity === null) return "Severity -";
  return `Severity ${severity}`;
};

const formatSyncopeOutcome = (outcome?: string) => {
  if (!outcome) return "Outcome -";
  return outcome
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatWorkoutDetails = (workout: any): string => {
  if (!workout) return "";

  const parts: string[] = [];

  const duration = Number(workout.duration);
  if (!Number.isNaN(duration) && duration > 0) {
    const durationMinutes = duration > 600 ? Math.round(duration / 60) : duration;
    parts.push(`Length: ${durationMinutes} min`);
  }

  const avgHeartRate = Number(workout.avgHeartRate);
  if (!Number.isNaN(avgHeartRate) && avgHeartRate > 0) {
    parts.push(`Avg HR: ${avgHeartRate} bpm`);
  }

  const calories = Number(workout.caloriesBurned ?? workout.calories);
  if (!Number.isNaN(calories) && calories > 0) {
    parts.push(`Calories Burned: ${calories} kcal`);
  }

  return parts.join(" · ");
};

const formatDailyLogDetails = (dailyLog: any): string => {
  const parts: string[] = [];
  if (dailyLog.overallScore != null) parts.push(`Overall: ${dailyLog.overallScore}/10`);
  if (dailyLog.symptomBurdenScore != null) parts.push(`Symptoms: ${dailyLog.symptomBurdenScore}/10`);

  const energyValues = [dailyLog.energyMorning, dailyLog.energyNoon, dailyLog.energyAfternoon, dailyLog.energyEvening].filter(
    (value): value is number => typeof value === "number",
  );
  if (energyValues.length > 0) {
    const averageEnergy = energyValues.reduce((sum, value) => sum + value, 0) / energyValues.length;
    parts.push(`Avg energy: ${Math.round(averageEnergy * 10) / 10}`);
  }

  if (dailyLog.workCapacity) parts.push(`Work: ${dailyLog.workCapacity}`);
  return parts.join(" · ") || "Daily log";
};

const formatIntakeDetails = (intake: any): string => {
  const parts: string[] = [];
  const fluids = Number(intake.water_ml ?? 0) + Number(intake.otherFluid_ml ?? 0);
  if (fluids > 0) parts.push(`${fluids} ml fluid`);
  if (Number(intake.saltMg) > 0) parts.push(`${intake.saltMg} mg salt`);
  if (Number(intake.caffeine_mg) > 0) parts.push(`${intake.caffeine_mg} mg caffeine`);
  if (intake.beverageType) parts.push(intake.beverageType);
  return parts.join(" · ") || formatDateTime(intake.timestamp);
};

const activeFoods = computed(() => {
  return data.food ?? [];
});

const isEmpty = computed(() => {
  return (
    data.symptoms.length === 0 &&
    data.syncopes.length === 0 &&
    data.bp.length === 0 &&
    data.sleep.length === 0 &&
    data.workouts.length === 0 &&
    data.daily.length === 0 &&
    data.intake.length === 0 &&
    data.hrv.length === 0 &&
    activeFoods.value.length === 0 &&
    (!data.micro || Object.keys(data.micro).length === 0)
  );
});

const loadDay = async (targetDate?: string) => {
  if (!targetDate) {
    loading.value = false;
    loadError.value = "No date was selected.";
    return;
  }

  loading.value = true;
  loadError.value = "";
  try {
    const healthDay = await healthDayService.getHealthDayByDate(targetDate, {
      include: HEALTH_DAY_SUMMARY_INCLUDES,
    });
    const foodLogs = getHealthDayFoodLogs(healthDay);

    data.micro = calculateMicronutrientTotals(foodLogs);
    data.symptoms = healthDay.symptomLogs ?? [];
    data.syncopes = healthDay.syncopeLogs ?? [];
    data.bp = healthDay.bloodPressureLogs ?? [];
    data.sleep = healthDay.sleepLogs ?? [];
    data.workouts = healthDay.workouts ?? [];
    data.daily = healthDay.dailyLog ? [healthDay.dailyLog] : [];
    data.intake = healthDay.intakeLogs ?? [];
    data.food = summarizeFoodLogs(foodLogs);
    data.hrv = healthDay.hrvRecordings ?? [];
  } catch (err) {
    loadError.value = "Health data could not be loaded for this date.";
    console.error("Failed to load HealthDay details", err);
  } finally {
    loading.value = false;
  }
};

watch(dateStr, (date) => loadDay(date), { immediate: true });
</script>

<style scoped>
.day-details-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: 2rem;
}

.back-link {
  display: inline-block;
  margin-bottom: 0.5rem;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}

.header h2 {
  font-size: 1.8rem;
  margin: 0;
  color: var(--text-main);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--primary);
}

.card-title {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  border-bottom: 2px solid transparent;
  padding-bottom: 0.5rem;
}

.workout-text {
  border-bottom-color: #10b981;
  color: #10b981;
}
.sleep-text {
  border-bottom-color: #3b82f6;
  color: #3b82f6;
}
.hrv-text {
  border-bottom-color: #8b5cf6;
  color: #8b5cf6;
}
.symptom-text {
  border-bottom-color: #ef4444;
  color: #ef4444;
}
.syncope-text {
  border-bottom-color: #b91c1c;
  color: #b91c1c;
}
.bp-text {
  border-bottom-color: #f59e0b;
  color: #f59e0b;
}
.daily-text {
  border-bottom-color: #06b6d4;
  color: #06b6d4;
}
.intake-text {
  border-bottom-color: #0ea5e9;
  color: #0ea5e9;
}
.food-text {
  border-bottom-color: #f59e0b;
  color: #f59e0b;
}
.micro-text {
  border-bottom-color: #6b7280;
  color: #6b7280;
}

.detail-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.detail-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--bg-surface-secondary);
  color: var(--text-secondary);
}

.detail-list li:last-child {
  border-bottom: none;
}

.detail-cards {
  display: grid;
  gap: 0.9rem;
  flex-grow: 1;
}

.mini-detail-card {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 0.95rem 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.mini-detail-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.18);
  border-color: var(--primary);
}

.mini-detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.mini-detail-header h4 {
  margin: 0;
  color: var(--text-main);
  font-size: 1rem;
  line-height: 1.2;
}

.mini-detail-header p {
  margin: 0.2rem 0 0;
  color: var(--text-secondary);
  font-size: 0.82rem;
}

.detail-badge {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
}

.symptom-badge {
  background: linear-gradient(135deg, #ef4444, #b91c1c);
}

.syncope-badge {
  background: linear-gradient(135deg, #b91c1c, #7f1d1d);
}

.mini-detail-meta,
.mini-detail-flags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 0.55rem;
}

.detail-chip,
.detail-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.24rem 0.55rem;
  font-size: 0.75rem;
  line-height: 1.2;
}

.detail-chip {
  background: var(--bg-surface-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.detail-pill {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-main);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.mini-detail-note {
  margin: 0.6rem 0 0;
  color: var(--text-secondary);
  font-size: 0.88rem;
  line-height: 1.45;
}

.clickable-item {
  cursor: pointer;
}

.clickable-item:hover {
  background: var(--bg-surface-secondary);
  border-radius: 4px;
}

.expanded-sleep-list li {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sleep-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sleep-times {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.sleep-score {
  font-weight: 600;
  color: var(--primary);
}

.sleep-issues {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.warning-badge {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  background: var(--danger);
  color: #fff;
  font-weight: 600;
}

.note {
  font-size: 0.85em;
  font-style: italic;
  color: var(--text-secondary);
  margin-top: 0.2rem;
}

.card-footer {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: var(--primary);
  text-align: right;
  font-weight: 500;
}

.micro-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  flex-grow: 1;
}

.micro-item {
  display: flex;
  justify-content: space-between;
  background: var(--bg-surface-secondary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.micro-name {
  color: var(--text-secondary);
}

.micro-val {
  font-weight: bold;
  color: var(--text-main);
}

.loading {
  font-size: 1.2rem;
  color: var(--text-secondary);
  padding: 2rem;
  text-align: center;
}

.loading.error {
  color: var(--danger);
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--text-secondary);
  background: var(--bg-surface-secondary);
  border: 1px dashed var(--border);
  cursor: default;
}

.empty-state:hover {
  transform: none;
  box-shadow: none;
  border-color: var(--border);
}
</style>
