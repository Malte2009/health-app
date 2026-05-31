<template>
  <div class="calendar-page">
    <div class="calendar-header">
      <div class="month-controls">
        <button class="nav-btn" @click="prevMonth">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h2>{{ currentMonthName }} {{ currentYear }}</h2>
        <button class="nav-btn" @click="nextMonth">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
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

        <div class="sub-toggles-wrapper">
          <div class="sub-toggle-group" v-if="toggles.micro">
            <div class="sub-toggle-header" @click="uiState.showMicroFilters = !uiState.showMicroFilters">
              <span class="sub-label">Micro Focus</span>
              <span class="toggle-icon">{{ uiState.showMicroFilters ? '▼ Hide Filters' : '▶ Show Filters' }}</span>
            </div>
            <div class="micro-filters" v-if="uiState.showMicroFilters">
              <label class="toggle-label" v-for="micro in MICROS_LIST" :key="micro">
                <input type="checkbox" v-model="microToggles[micro]" /> {{ formatMicroName(micro) }}
              </label>
            </div>
          </div>

          <div class="sub-toggle-group">
            <div class="sub-toggle-header" @click="uiState.showFoodFilters = !uiState.showFoodFilters">
              <span class="sub-label">Food Focus</span>
              <span class="toggle-icon">{{ uiState.showFoodFilters ? '▼ Hide Filters' : '▶ Show Filters' }}</span>
            </div>
            <div class="micro-filters" v-if="uiState.showFoodFilters">
              <label class="toggle-label" v-for="foodName in uniqueFoodList" :key="foodName">
                <input type="checkbox" v-model="foodToggles[foodName]" /> {{ foodName }}
              </label>
              <div v-if="uniqueFoodList.length === 0" style="color:var(--text-secondary); font-size:0.9rem;">
                No foods logged in this month.
              </div>
            </div>
          </div>
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
          :class="{ 'out-of-month': !day.inMonth, today: day.isToday }"
          @click="goToDayDetails(day.dateStr)"
        >
          <div class="day-number">{{ day.dayNumber }}</div>

          <div class="day-content" v-if="day.inMonth">
            <template v-if="toggles.symptoms && Array.isArray(day.symptoms) && day.symptoms.length > 0">
              <div class="event-pill symptom">{{ day.symptoms.length }} Symptom{{ day.symptoms.length > 1 ? "s" : "" }}</div>
            </template>

            <template v-if="toggles.syncopes && Array.isArray(day.syncopes) && day.syncopes.length > 0">
              <div class="event-pill syncope">{{ day.syncopes.length }} Syncope{{ day.syncopes.length > 1 ? "s" : "" }}</div>
            </template>

            <div
              v-if="toggles.bp && Array.isArray(day.bp) && day.bp.length > 0"
              class="event-pill bp"
              :title="formatAverageBloodPressureDetails(day.bp)"
            >
              {{ formatAverageBloodPressurePill(day.bp) }}
            </div>

            <template v-if="toggles.sleep && Array.isArray(day.sleep) && day.sleep.length > 0">
              <div v-for="(s, idx) in day.sleep" :key="s.id ?? idx" :class="['event-pill', isNap(s) ? 'nap' : 'sleep']">
                {{ formatSleepPill(s) }}
              </div>
            </template>

            <div v-if="toggles.training && Array.isArray(day.training) && day.training.length > 0" class="event-pill training">
              {{ day.training.length }} Workout{{ day.training.length > 1 ? "s" : "" }}
            </div>

            <div v-if="toggles.daily && Array.isArray(day.daily) && day.daily.length > 0" class="event-pill daily">Daily</div>

            <div v-if="toggles.intake && Array.isArray(day.intake) && day.intake.length > 0" class="event-pill intake">{{ day.intake.length }} Intake</div>

            <template v-if="activeFoods(day.food).length">
              <div v-for="(food, index) in activeFoods(day.food)" :key="index" class="event-pill food">
                {{ food.name }}{{ food.totalWeight_g ? (': ' + food.totalWeight_g + 'g') : '' }}
              </div>
            </template>

            <template v-if="toggles.micro && day.micro">
              <template v-for="micro in MICROS_LIST" :key="micro">
                <!-- only show micro if the global micro toggle is on AND the specific micro filter is enabled -->
                <div v-if="microToggles[micro] === true && typeof day.micro[micro] === 'number' && day.micro[micro] > 0" class="event-pill micro" :class="micro">
                  {{ formatMicroName(micro) }}: {{ day.micro[micro] }}
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import {
  getMicroOverMonth,
  getSymptomsOverMonth,
  getSyncopesOverMonth,
  getBloodPressureOverMonth,
  getSleepOverMonth,
  getTrainingOverMonth,
  getDailyLogsOverMonth,
  getIntakeLogsOverMonth,
  getFoodOverMonth,
} from "@/services/diagnosticService";

const router = useRouter();

/*
  This file deals with flexible backend payloads where the exact shapes may vary.
  We intentionally allow some `any`/loose typing in helpers (normalized at runtime)
  to keep the calendar resilient. Disable the explicit-any lint rule for this file.
*/
/* eslint-disable @typescript-eslint/no-explicit-any */

interface DayDetails {
  dateStr: string;
  dayNumber: number;
  inMonth: boolean;
  isToday: boolean;
  // keep these permissive so the calendar can accept various backend shapes
  micro?: Record<string, any> | null;
  symptoms?: Record<string, any>[];
  syncopes?: Record<string, any>[];
  bp?: Record<string, any>[];
  sleep?: Record<string, any>[];
  training?: Record<string, any>[];
  daily?: Record<string, any>[];
  intake?: Record<string, any>[];
  food?: any[] | null;
}

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

const uiState = reactive({
  showMicroFilters: false,
  showFoodFilters: false,
});

const data = reactive<Record<string, unknown>>({
  micro: [],
  symptoms: [],
  syncopes: [],
  bp: [],
  sleep: [],
  training: [],
  daily: [],
  intake: [],
  food: [],
});

const foodToggles = reactive<Record<string, boolean>>({});

// Helper: extract a stable set of food names from various backend payload shapes
const extractFoodNames = (payload: any): Set<string> => {
  const names = new Set<string>();
  if (!payload) return names;

  // small helper to pull a name from a possibly nested food object
  const handleItem = (it: any) => {
    if (!it) return;
    const name = it.name ?? it.food?.name ?? it.food_item?.name ?? it.foodItem?.name;
    if (name) names.add(String(name));
  };

  // If an array of day/entry objects
  if (Array.isArray(payload)) {
    payload.forEach((entry: any) => {
      if (!entry) return;
      if (Array.isArray(entry.items)) {
        entry.items.forEach((f: any) => handleItem(f));
      } else if (Array.isArray(entry.data)) {
        entry.data.forEach((f: any) => handleItem(f));
      } else if (Array.isArray(entry.foodLogs) || Array.isArray(entry.food_logs) || Array.isArray(entry.foods)) {
        const arr = entry.foodLogs ?? entry.food_logs ?? entry.foods;
        if (Array.isArray(arr)) arr.forEach((f: any) => handleItem(f));
      } else {
        handleItem(entry);
      }
    });
    return names;
  }

  // If payload is an object: could be wrapper { data: [...] } or a date->array map
  if (payload && typeof payload === "object") {
    if (Array.isArray(payload.data)) return extractFoodNames(payload.data);
    if (Array.isArray(payload.items)) return extractFoodNames(payload.items);

    // treat as mapping date->array or wrapper with keys
    for (const val of Object.values(payload as any)) {
      if (!val) continue;
      if (Array.isArray(val)) {
        val.forEach((v: any) => handleItem(v));
      } else if (val && typeof val === "object") {
        if (Array.isArray((val as any).items)) (val as any).items.forEach((v: any) => handleItem(v));
        else handleItem(val);
      }
    }
  }

  return names;
};

// keep foodToggles in sync with names found for the current month
watch(
  () => data.food,
  (newFood) => {
    const names = extractFoodNames(newFood);
    names.forEach((n) => {
      // Default foods to OFF so the calendar stays uncluttered. Users can enable specific foods manually.
      if (foodToggles[n] === undefined) foodToggles[n] = false;
    });
  },
  { deep: true, immediate: true },
);

const uniqueFoodList = computed(() => {
  return Array.from(extractFoodNames(data.food)).sort();
});

// Normalize various food item shapes into a small display object
type FoodDisplay = { name: string; totalWeight_g?: any; weightLogs?: any; raw?: any };
const normalizeFoodItem = (it: any): FoodDisplay | null => {
  if (!it) return null;
  const name = it.name ?? it.food?.name ?? it.food_item?.name ?? it.foodItem?.name;
  if (!name) return null;
  const totalWeight_g = it.totalWeight_g ?? it.total_weight_g ?? it.totalWeight ?? it.weight_g ?? it.weightG ?? it.food?.weight_g;
  const weightLogs = it.weightLogs ?? it.logs ?? it.weight_logs ?? undefined;
  return { name: String(name), totalWeight_g, weightLogs, raw: it };
};

const activeFoods = (foods: any): FoodDisplay[] => {
  if (!foods) return [];
  const foodsArray = Array.isArray(foods) ? foods : [foods];
  const mapped = foodsArray.map((f: any) => normalizeFoodItem(f));
  // narrow out nulls and ensure TypeScript knows we return concrete FoodDisplay items
  return mapped.filter((f): f is FoodDisplay => Boolean(f) && Boolean((f as any).name) && foodToggles[(f as any).name] !== false);
};

// Format a sleep entry into a short label for calendar pills (e.g. "1h 15m Sleep")
const formatSleepPill = (s: any): string => {
  if (!s) return "";
  const mins = s.totalSleepMinutes ?? s.total_sleep_minutes ?? s.durationMinutes ?? s.duration_min ?? s.duration ?? null;
  const suffix = isNap(s) ? 'Nap' : 'Sleep';
  if (mins != null && !isNaN(Number(mins))) {
    const total = Number(mins);
    const hrs = Math.floor(total / 60);
    const rem = Math.round(total % 60);
    return rem === 0 ? `${hrs}h ${suffix}` : `${hrs}h ${rem}m ${suffix}`;
  }

  const start = s.bedTime ?? s.start_time ?? s.startTime ?? s.start ?? s.timestamp ?? null;
  const end = s.wakeTime ?? s.end_time ?? s.endTime ?? s.end ?? null;
  if (start && end) {
    const st = new Date(start).getTime();
    const ed = new Date(end).getTime();
    if (!isNaN(st) && !isNaN(ed) && ed >= st) {
      const diff = Math.round((ed - st) / 60000);
      const hrs = Math.floor(diff / 60);
      const rem = diff % 60;
      return rem === 0 ? `${hrs}h ${suffix}` : `${hrs}h ${rem}m ${suffix}`;
    }
  }

  const label = s.sleepType ?? s.type ?? s.label ?? s.name ?? '';
  return (label || suffix) as string;
};

// Detect whether a sleep entry represents a nap (flexible across different payload shapes)
const isNap = (s: any): boolean => {
  if (!s) return false;
  const val = (s.sleepType ?? s.type ?? s.sleep_type ?? s.label ?? s.name ?? '').toString().toLowerCase();
  if (!val) return false;
  return val.includes('nap');
};

const getBloodPressurePulse = (bp: any): number | null => {
  const pulse = bp?.pulse ?? bp?.heartRate ?? bp?.hr;
  if (pulse == null || pulse === '') return null;
  const value = Number(pulse);
  return Number.isNaN(value) ? null : value;
};

const formatTrainingDurationMinutes = (durationValue: any): number | null => {
  const duration = Number(durationValue);
  if (Number.isNaN(duration) || duration <= 0) return null;
  return duration > 600 ? Math.round(duration / 60) : duration;
};

const normalizeBloodPressureEntries = (bp: any): any[] => {
  if (!bp) return [];
  if (Array.isArray(bp)) return bp;
  return [bp];
};

const formatAverageBloodPressurePill = (bp: any): string => {
  const entries = normalizeBloodPressureEntries(bp);
  const validEntries = entries.filter((entry) => Number(entry?.systolic) > 0 && Number(entry?.diastolic) > 0);

  if (validEntries.length === 0) return 'BP';

  const avgSystolic = validEntries.reduce((sum, entry) => sum + Number(entry.systolic), 0) / validEntries.length;
  const avgDiastolic = validEntries.reduce((sum, entry) => sum + Number(entry.diastolic), 0) / validEntries.length;
  return `Avg ${Math.round(avgSystolic)}/${Math.round(avgDiastolic)}`;
};

const formatAverageBloodPressureDetails = (bp: any): string => {
  const entries = normalizeBloodPressureEntries(bp);
  const validEntries = entries.filter((entry) => Number(entry?.systolic) > 0 && Number(entry?.diastolic) > 0);

  if (validEntries.length === 0) return '';

  const avgSystolic = validEntries.reduce((sum, entry) => sum + Number(entry.systolic), 0) / validEntries.length;
  const avgDiastolic = validEntries.reduce((sum, entry) => sum + Number(entry.diastolic), 0) / validEntries.length;

  const pulseValues = validEntries
    .map((entry) => getBloodPressurePulse(entry))
    .filter((value): value is number => value !== null);
  const pulseText = pulseValues.length > 0
    ? ` · Avg Pulse: ${Math.round(pulseValues.reduce((sum, value) => sum + value, 0) / pulseValues.length)} bpm`
    : '';

  return `Average blood pressure: ${Math.round(avgSystolic)}/${Math.round(avgDiastolic)} mmHg (${validEntries.length} reading${validEntries.length > 1 ? 's' : ''})${pulseText}`;
};

const formatBloodPressureSummary = (bp: any): string => {
  if (!bp) return '';
  const pulse = getBloodPressurePulse(bp);
  return pulse !== null ? `${bp.systolic}/${bp.diastolic} · ${pulse} bpm` : `${bp.systolic}/${bp.diastolic}`;
};

const formatBloodPressureDetails = (bp: any): string => {
  if (!bp) return '';
  const pulse = getBloodPressurePulse(bp);
  return pulse !== null ? `${bp.systolic}/${bp.diastolic} mmHg · Pulse: ${pulse} bpm` : `${bp.systolic}/${bp.diastolic} mmHg`;
};

const formatTrainingSummary = (training: any, fallbackName = 'Workout'): string => {
  if (!training) return fallbackName;

  const parts: string[] = [];

  const duration = formatTrainingDurationMinutes(training.duration);
  if (duration !== null) parts.push(`${duration}m`);

  const avgHeartRate = Number(training.avgHeartRate);
  if (!Number.isNaN(avgHeartRate) && avgHeartRate > 0) parts.push(`${avgHeartRate} bpm`);

  const calories = Number(training.caloriesBurned ?? training.calories);
  if (!Number.isNaN(calories) && calories > 0) parts.push(`${calories} kcal`);

  return parts.length > 0 ? `${fallbackName} · ${parts.join(' · ')}` : fallbackName;
};

const formatTrainingDetails = (training: any): string => {
  if (!training) return '';

  const parts: string[] = [];

  const duration = formatTrainingDurationMinutes(training.duration);
  if (duration !== null) parts.push(`Length: ${duration} min`);

  const avgHeartRate = Number(training.avgHeartRate);
  if (!Number.isNaN(avgHeartRate) && avgHeartRate > 0) parts.push(`Avg HR: ${avgHeartRate} bpm`);

  const calories = Number(training.caloriesBurned ?? training.calories);
  if (!Number.isNaN(calories) && calories > 0) parts.push(`Calories Burned: ${calories} kcal`);

  return parts.join(' · ');
};

const MICROS_LIST = [
  "vitamin_a",
  "vitamin_d",
  "vitamin_e",
  "vitamin_k",
  "vitamin_b1",
  "vitamin_b2",
  "vitamin_b3",
  "vitamin_b5",
  "vitamin_b6",
  "vitamin_b7",
  "vitamin_b9",
  "vitamin_b12",
  "choline",
  "caffeine",
  "calcium",
  "phosphorus",
  "magnesium",
  "sodium",
  "potassium",
  "chloride",
  "sulfur",
  "iron",
  "zinc",
  "selenium",
  "iodine",
  "copper",
  "manganese",
  "chromium",
  "molybdenum",
  "fluoride",
  "vitamin_c",
  "omega_3",
  "omega_6",
  "omega_9",
];

const microToggles = reactive<Record<string, boolean>>({});
MICROS_LIST.forEach((micro) => {
  microToggles[micro] = false;
});

const formatMicroName = (name: string): string => {
  return name.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const goToDayDetails = (dateStr: string) => {
  router.push({ name: 'day-details', params: { date: dateStr } });
};

const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth());
const currentMonthName = computed(() => currentDate.value.toLocaleString("default", { month: "long" }));

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
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const fetchData = async () => {
  // Use local time limits to fetch the month (start of current month to start of next month)
  const start = new Date(currentYear.value, currentMonth.value, 1);
  const end = new Date(currentYear.value, currentMonth.value + 1, 1);

  const startStr = formatDate(start);
  const endStr = formatDate(end);

  try {
    const [microRes, symptomsRes, syncopesRes, bpRes, sleepRes, trainingRes, dailyRes, intakeRes, foodRes] = await Promise.all([
      getMicroOverMonth(startStr, endStr),
      getSymptomsOverMonth(startStr, endStr),
      getSyncopesOverMonth(startStr, endStr),
      getBloodPressureOverMonth(startStr, endStr),
      getSleepOverMonth(startStr, endStr),
      getTrainingOverMonth(startStr, endStr),
      getDailyLogsOverMonth(startStr, endStr),
      getIntakeLogsOverMonth(startStr, endStr),
      getFoodOverMonth(startStr, endStr),
    ]);

    data.micro = microRes;
    data.symptoms = symptomsRes;
    data.syncopes = syncopesRes;
    data.bp = bpRes;
    data.sleep = sleepRes;
    data.training = trainingRes;
    data.daily = dailyRes;
    data.intake = intakeRes;
    data.food = foodRes;
  } catch (error) {
    console.error("Failed to fetch diagnostic data", error);
  }
};

const buildMap = (arr: any[] = []) => {
  const map: Record<string, any> = {};
  if (!Array.isArray(arr)) return map;
  for (const item of arr) {
    if (!item) continue;
    const date = item.date ?? item.day ?? item.dateStr ?? item.date_str;
    if (!date) continue;
    map[String(date)] = item.items !== undefined ? item.items : item;
  }
  return map;
};

// Build a flexible date->items map for food payloads that may be shaped differently
const buildFoodMap = (payload: any): Record<string, any[]> => {
  const map: Record<string, any[]> = {};
  if (!payload) return map;

  const push = (date: string | undefined, item: any) => {
    if (!date) return;
    if (!map[date]) map[date] = [];
    if (Array.isArray(item)) map[date].push(...item);
    else map[date].push(item);
  };

  if (Array.isArray(payload)) {
    for (const entry of payload as any[]) {
      const date = entry?.date ?? entry?.day ?? entry?.dateStr ?? entry?.date_str;
      if (Array.isArray(entry.items)) push(String(date), entry.items);
      else if (Array.isArray(entry.data)) push(String(date), entry.data);
      else if (Array.isArray(entry.foodLogs) || Array.isArray(entry.food_logs) || Array.isArray(entry.foods)) {
        const arr = entry.foodLogs ?? entry.food_logs ?? entry.foods;
        if (Array.isArray(arr)) push(String(date), arr);
      } else if (entry && (entry.name || entry.food)) {
        push(String(date), entry);
      }
    }
    return map;
  }

  if (payload && typeof payload === "object") {
    if (Array.isArray(payload.data)) return buildFoodMap(payload.data);
    if (Array.isArray(payload.items)) return buildFoodMap(payload.items);

    // treat as mapping date -> array/object
    for (const [k, v] of Object.entries(payload as any)) {
      if (k === "data" || k === "items") continue;
      if (Array.isArray(v)) {
        v.forEach((e: any) => {
          if (Array.isArray(e.items)) push(String(e.date ?? k), e.items);
          else if (e?.date) push(String(e.date), e);
          else push(k, e);
        });
      } else if (v && typeof v === "object") {
        if (Array.isArray((v as any).items)) push(k, (v as any).items);
        else push(k, v);
      }
    }
  }

  return map;
};

const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const days: DayDetails[] = [];

  const microMap = buildMap(data.micro as any[]);
  const symptomsMap = buildMap(data.symptoms as any[]);
  const syncopesMap = buildMap(data.syncopes as any[]);
  const bpMap = buildMap(data.bp as any[]);
  const sleepMap = buildMap(data.sleep as any[]);
  const trainingMap = buildMap(data.training as any[]);
  const dailyMap = buildMap(data.daily as any[]);
  const intakeMap = buildMap(data.intake as any[]);

  // Build a flexible food map from the returned payload (handles arrays, wrappers or date->array maps)
  const foodMap = buildFoodMap((data.food ?? []) as any);

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
      symptoms: (symptomsMap[dateStr] as any[]) || [],
      syncopes: (syncopesMap[dateStr] as any[]) || [],
      bp: (bpMap[dateStr] as any[]) || [],
      sleep: (sleepMap[dateStr] as any[]) || [],
      training: (trainingMap[dateStr] as any[]) || [],
      daily: (dailyMap[dateStr] as any[]) || [],
      intake: (intakeMap[dateStr] as any[]) || [],
      food: (foodMap[dateStr] as any[]) || null,
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

.sub-toggles-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed var(--border);
}

.sub-toggle-group {
  background: var(--bg-surface-secondary);
  border-radius: 8px;
  padding: 12px;
}

.sub-toggle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.sub-toggle-header:hover .sub-label {
  color: var(--primary);
}

.toggle-icon {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.sub-label {
  font-weight: 600;
  color: var(--text-secondary);
  transition: color 0.2s;
}

.micro-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
.day-content::-webkit-scrollbar {
  display: none;
}

.event-pill {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

/* Updated Colors to blend nicely with the dark theme */
.symptom {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}
.syncope {
  background: linear-gradient(135deg, #b91c1c, #991b1b);
}
.bp {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}
.sleep {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.nap {
  /* distinct color for naps */
  background: linear-gradient(135deg, #7dd3fc, #38bdf8);
}
.training {
  background: linear-gradient(135deg, #10b981, #059669);
}
.daily {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}
.intake {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
}

.food {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.micro {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

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
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.symptom-text {
  color: #ef4444;
}
.food-text {
  color: #f59e0b;
}
.syncope-text {
  color: #b91c1c;
}
.bp-text {
  color: #f59e0b;
}
.sleep-text {
  color: #3b82f6;
}
.training-text {
  color: #10b981;
}
.micro-text {
  color: #8b5cf6;
}

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
