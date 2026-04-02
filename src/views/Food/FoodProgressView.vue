<template>
  <div class="food-progress">
    <h1>Nutrition Progress</h1>

    <!-- View Toggle -->
    <div class="view-toggle">
      <button :class="{ active: viewMode === 'week' }" @click="viewMode = 'week'">Weekly</button>
      <button :class="{ active: viewMode === 'month' }" @click="viewMode = 'month'">Monthly</button>
    </div>

    <!-- Date Range Controls -->
    <div class="range-nav">
      <button class="nav-btn" @click="navigatePrev">&#8592;</button>
      <span class="range-label">{{ rangeLabel }}</span>
      <button class="nav-btn" :disabled="!canNavigateNext" @click="navigateNext">&#8594;</button>
    </div>

    <div v-if="loading" class="loading-state">Loading...</div>
    <div v-else-if="data.length === 0" class="empty-state">No data available for this period.</div>

    <div v-else>
      <!-- Calorie Bar Chart -->
      <div class="chart-card">
        <div class="chart-title">Calories</div>
        <div class="chart-area">
          <svg :viewBox="`0 0 ${svgWidth} ${svgHeight}`" class="bar-chart" preserveAspectRatio="xMidYMid meet">
            <line v-if="calorieGoal > 0" :x1="barAreaLeft" :y1="goalY" :x2="svgWidth - 10" :y2="goalY" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="6 4" />
            <text v-if="calorieGoal > 0" :x="svgWidth - 8" :y="goalY + 4" font-size="9" fill="var(--accent)" text-anchor="end">Goal</text>
            <g v-for="(item, i) in data" :key="item.date">
              <rect :x="barX(i)" :y="barY(item.totals.calories)" :width="barWidth" :height="barHeight(item.totals.calories)" :fill="barColor(item)" rx="3" />
              <text v-if="item.totals.calories > 0" :x="barX(i) + barWidth / 2" :y="barY(item.totals.calories) - 4" text-anchor="middle" font-size="7" fill="var(--text-secondary)">{{ item.totals.calories }}</text>
              <text :x="barX(i) + barWidth / 2" :y="svgHeight - 4" text-anchor="middle" font-size="8" fill="var(--text-secondary)">{{ xLabel(item.date) }}</text>
            </g>
            <line :x1="barAreaLeft" y1="10" :x2="barAreaLeft" :y2="svgHeight - 20" stroke="var(--border)" stroke-width="1" />
            <line :x1="barAreaLeft" :y1="svgHeight - 20" :x2="svgWidth - 10" :y2="svgHeight - 20" stroke="var(--border)" stroke-width="1" />
          </svg>
        </div>
        <div class="chart-legend">
          <span class="legend-item"><span class="legend-dot" style="background: var(--success)"></span>Under goal</span>
          <span class="legend-item"><span class="legend-dot" style="background: var(--danger)"></span>Over goal</span>
          <span class="legend-item"><span class="legend-dot" style="background: var(--text-secondary)"></span>No goal</span>
        </div>
      </div>

      <!-- Macro Breakdown -->
      <div class="chart-card">
        <div class="chart-title">Macro Breakdown (g)</div>
        <div class="chart-area">
          <svg :viewBox="`0 0 ${svgWidth} ${svgHeight}`" class="bar-chart" preserveAspectRatio="xMidYMid meet">
            <g v-for="(item, i) in data" :key="item.date">
              <rect :x="barX(i)" :y="macroBarY(item, 'protein')" :width="barWidth" :height="macroBarH(item, 'protein')" fill="var(--success)" />
              <rect :x="barX(i)" :y="macroBarY(item, 'carbs')" :width="barWidth" :height="macroBarH(item, 'carbs')" fill="var(--accent)" />
              <rect :x="barX(i)" :y="macroBarY(item, 'fat')" :width="barWidth" :height="macroBarH(item, 'fat')" fill="#f97316" />
              <text :x="barX(i) + barWidth / 2" :y="svgHeight - 4" text-anchor="middle" font-size="8" fill="var(--text-secondary)">{{ xLabel(item.date) }}</text>
            </g>
            <line :x1="barAreaLeft" y1="10" :x2="barAreaLeft" :y2="svgHeight - 20" stroke="var(--border)" stroke-width="1" />
            <line :x1="barAreaLeft" :y1="svgHeight - 20" :x2="svgWidth - 10" :y2="svgHeight - 20" stroke="var(--border)" stroke-width="1" />
          </svg>
        </div>
        <div class="chart-legend">
          <span class="legend-item"><span class="legend-dot" style="background: var(--success)"></span>Protein</span>
          <span class="legend-item"><span class="legend-dot" style="background: var(--accent)"></span>Carbs</span>
          <span class="legend-item"><span class="legend-dot" style="background: #f97316"></span>Fat</span>
        </div>
      </div>

      <!-- Micronutrient Averages -->
      <div class="chart-card">
        <div class="chart-title">Micronutrients (Average / Day)</div>
        <div v-if="micronutrientRows.length === 0" class="micro-empty">No micronutrient intake logged in this period.</div>
        <div v-else class="micro-list">
          <div v-for="row in micronutrientRows" :key="row.key" class="micro-row">
            <div class="micro-head">
              <span class="micro-name">{{ row.label }}</span>
              <span class="micro-value">{{ row.avg }} {{ row.unit }}</span>
            </div>
            <div class="micro-bar-track">
              <div class="micro-bar" :style="{ width: row.percent + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="details-toggle-row">
        <button class="details-toggle-btn" @click="showExtendedStats = !showExtendedStats">
          {{ showExtendedStats ? 'Hide detail stats' : 'Show detail stats' }}
        </button>
      </div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value primary-color">{{ avgCalories }}</div>
          <div class="stat-label">Avg Calories / Day</div>
        </div>
        <div class="stat-card">
          <div class="stat-value success-color">{{ avgProtein }}g</div>
          <div class="stat-label">Avg Protein / Day</div>
        </div>
        <div class="stat-card">
          <div class="stat-value accent-color">{{ avgCarbs }}g</div>
          <div class="stat-label">Avg Carbs / Day</div>
        </div>
        <div class="stat-card">
          <div class="stat-value fat-color">{{ avgFat }}g</div>
          <div class="stat-label">Avg Fat / Day</div>
        </div>
        <div v-if="showExtendedStats" class="stat-card">
          <div class="stat-value sugar-color">{{ avgSugar }}g</div>
          <div class="stat-label">Avg Sugar / Day</div>
        </div>
        <div v-if="showExtendedStats" class="stat-card">
          <div class="stat-value sat-fat-color">{{ avgSatFat }}g</div>
          <div class="stat-label">Avg Sat Fat / Day</div>
        </div>
        <div v-if="showExtendedStats" class="stat-card">
          <div class="stat-value unsat-fat-color">{{ avgUnsatFat }}g</div>
          <div class="stat-label">Avg Unsat Fat / Day</div>
        </div>
        <div v-if="showExtendedStats" class="stat-card">
          <div class="stat-value salt-color">{{ avgSalt }}g</div>
          <div class="stat-label">Avg Salt / Day</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ daysLogged }}</div>
          <div class="stat-label">Days Logged</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" :class="goalHitRate >= 80 ? 'success-color' : goalHitRate >= 50 ? 'accent-color' : 'danger-color'">{{ goalHitRate }}%</div>
          <div class="stat-label">Within Calorie Goal</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { isAuthenticated } from "@/services/authService.ts";
import { getNutritionOverTime } from "@/services/foodDashboardService.ts";
import { toLocalIsoDate } from "@/utility/date.ts";
import type { NutritionOverTimeDay, Nutrient } from "@/types/foodType.ts";

const router = useRouter();

const viewMode = ref<"week" | "month">("week");
const data = ref<NutritionOverTimeDay[]>([]);
const loading = ref(false);
const weekOffset = ref(0);
const monthOffset = ref(0);
const showExtendedStats = ref(false);

type NutrientKey = Exclude<keyof Nutrient, "id" | "foodId">;
type NutrientDef = { label: string; unit: string };

const micronutrientMeta: Partial<Record<NutrientKey, NutrientDef>> = {
  vitamin_a: { label: "Vitamin A", unit: "µg" },
  vitamin_d: { label: "Vitamin D", unit: "µg" },
  vitamin_e: { label: "Vitamin E", unit: "mg" },
  vitamin_k: { label: "Vitamin K", unit: "µg" },
  vitamin_c: { label: "Vitamin C", unit: "mg" },
  vitamin_b1: { label: "Vitamin B1", unit: "mg" },
  vitamin_b2: { label: "Vitamin B2", unit: "mg" },
  vitamin_b3: { label: "Vitamin B3", unit: "mg" },
  vitamin_b5: { label: "Vitamin B5", unit: "mg" },
  vitamin_b6: { label: "Vitamin B6", unit: "mg" },
  vitamin_b7: { label: "Vitamin B7", unit: "µg" },
  vitamin_b9: { label: "Vitamin B9", unit: "µg" },
  vitamin_b12: { label: "Vitamin B12", unit: "µg" },
  choline: { label: "Choline", unit: "mg" },
  calcium: { label: "Calcium", unit: "mg" },
  phosphorus: { label: "Phosphorus", unit: "mg" },
  magnesium: { label: "Magnesium", unit: "mg" },
  sodium: { label: "Sodium", unit: "mg" },
  potassium: { label: "Potassium", unit: "mg" },
  chloride: { label: "Chloride", unit: "mg" },
  sulfur: { label: "Sulfur", unit: "mg" },
  iron: { label: "Iron", unit: "mg" },
  zinc: { label: "Zinc", unit: "mg" },
  selenium: { label: "Selenium", unit: "µg" },
  iodine: { label: "Iodine", unit: "µg" },
  copper: { label: "Copper", unit: "mg" },
  manganese: { label: "Manganese", unit: "mg" },
  chromium: { label: "Chromium", unit: "µg" },
  molybdenum: { label: "Molybdenum", unit: "µg" },
  fluoride: { label: "Fluoride", unit: "mcg" },
  omega_3: { label: "Omega-3", unit: "mg" },
  omega_6: { label: "Omega-6", unit: "mg" },
  omega_9: { label: "Omega-9", unit: "mg" },
  caffeine: { label: "Caffeine", unit: "mg" },
};

function fallbackLabelFromKey(key: string): string {
  return key
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const svgWidth = 700;
const svgHeight = 200;
const barAreaLeft = 28;
const barPadding = 4;

const barWidth = computed(() => {
  const n = data.value.length || 1;
  return Math.max(6, (svgWidth - barAreaLeft - 10) / n - barPadding);
});

function barX(i: number): number {
  const n = data.value.length || 1;
  return barAreaLeft + i * ((svgWidth - barAreaLeft - 10) / n) + barPadding / 2;
}

const calorieGoal = computed(() => 0);

const maxCalories = computed(() => {
  const max = Math.max(...data.value.map((d) => d.totals.calories), calorieGoal.value * 1.1, 100);
  return max * 1.1;
});

const chartAreaHeight = svgHeight - 30;

function barY(cal: number): number {
  if (cal === 0) return chartAreaHeight + 10;
  return chartAreaHeight + 10 - (cal / maxCalories.value) * (chartAreaHeight - 10);
}

function barHeight(cal: number): number {
  if (cal === 0) return 0;
  return (cal / maxCalories.value) * (chartAreaHeight - 10);
}

const goalY = computed(() => barY(calorieGoal.value));

function barColor(item: NutritionOverTimeDay): string {
  if (item.totals.calories === 0) return "transparent";
  if (!calorieGoal.value) return "var(--text-secondary)";
  return item.totals.calories <= calorieGoal.value * 1.05 ? "var(--success)" : "var(--danger)";
}

const maxMacroTotal = computed(() => {
  const max = Math.max(...data.value.map((d) => d.totals.protein_g + d.totals.carbs_g + d.totals.fat_g), 10);
  return max * 1.1;
});

function macroBarH(item: NutritionOverTimeDay, type: "protein" | "carbs" | "fat"): number {
  const val = type === "protein" ? item.totals.protein_g : type === "carbs" ? item.totals.carbs_g : item.totals.fat_g;
  return (val / maxMacroTotal.value) * (chartAreaHeight - 10);
}

function macroBarY(item: NutritionOverTimeDay, type: "protein" | "carbs" | "fat"): number {
  const total = maxMacroTotal.value;
  const protH = (item.totals.protein_g / total) * (chartAreaHeight - 10);
  const carbH = (item.totals.carbs_g / total) * (chartAreaHeight - 10);
  const fatH = (item.totals.fat_g / total) * (chartAreaHeight - 10);
  const base = chartAreaHeight + 10;
  if (type === "fat") return base - fatH;
  if (type === "carbs") return base - fatH - carbH;
  return base - fatH - carbH - protH;
}

function xLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return viewMode.value === "week"
    ? new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(d)
    : d.getDate().toString();
}

const canNavigateNext = computed(() => viewMode.value === "week" ? weekOffset.value < 0 : monthOffset.value < 0);

function navigatePrev() {
  if (viewMode.value === "week") {
    weekOffset.value--;
  } else {
    monthOffset.value--;
  }
}

function navigateNext() {
  if (viewMode.value === "week") {
    weekOffset.value++;
  } else {
    monthOffset.value++;
  }
}

const rangeLabel = computed(() => {
  if (viewMode.value === "week") {
    const start = weekStart(weekOffset.value);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `${fmt(start)} – ${fmt(end)}`;
  }
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + monthOffset.value);
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(d);
});

function weekStart(offset: number): Date {
  const d = new Date();
  const day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1) + offset * 7);
  d.setHours(0, 0, 0, 0);
  return d;
}

function fmt(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(d);
}

function currentMonth(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + monthOffset.value);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const daysLogged = computed(() => data.value.filter((d) => d.totals.calories > 0).length);

function avg(vals: number[]): number {
  const nz = vals.filter((v) => v > 0);
  return nz.length ? Math.round(nz.reduce((a, b) => a + b, 0) / nz.length) : 0;
}

const avgCalories = computed(() => avg(data.value.map((d) => d.totals.calories)));
const avgProtein = computed(() => avg(data.value.map((d) => Math.round(d.totals.protein_g))));
const avgCarbs = computed(() => avg(data.value.map((d) => Math.round(d.totals.carbs_g))));
const avgFat = computed(() => avg(data.value.map((d) => Math.round(d.totals.fat_g))));
const avgSugar = computed(() => avg(data.value.map((d) => Math.round(d.totals.sugar_g ?? 0))));
const avgSatFat = computed(() => avg(data.value.map((d) => Math.round(d.totals.saturated_fat_g ?? 0))));
const avgUnsatFat = computed(() => avg(data.value.map((d) => Math.round(d.totals.unsaturated_fat_g ?? 0))));
const avgSalt = computed(() => avg(data.value.map((d) => Math.round((d.totals.salt_g ?? 0) * 10) / 10)));

const micronutrientRows = computed(() => {
  const dayCount = data.value.length || 1;
  const nutrientKeys = new Set<string>();
  for (const day of data.value) {
    const totals = (day.nutrientTotals ?? {}) as Record<string, unknown>;
    for (const [key, value] of Object.entries(totals)) {
      if (typeof value === "number" && Number.isFinite(value) && value > 0) {
        nutrientKeys.add(key);
      }
    }
  }

  const rows = [...nutrientKeys]
    .map((key) => {
      const sum = data.value.reduce((acc, day) => {
        const totals = (day.nutrientTotals ?? {}) as Record<string, unknown>;
        return acc + Number(totals[key] ?? 0);
      }, 0);
      const avgVal = sum / dayCount;
      const meta = micronutrientMeta[key as NutrientKey];
      return {
        key,
        label: meta?.label ?? fallbackLabelFromKey(key),
        unit: meta?.unit ?? "mg",
        avgRaw: avgVal,
        avg: avgVal >= 100 ? Math.round(avgVal) : Math.round(avgVal * 10) / 10,
      };
    })
    .filter((row) => row.avgRaw > 0)
    .sort((a, b) => b.avgRaw - a.avgRaw)
    .slice(0, 10);

  const maxVal = Math.max(...rows.map((r) => r.avgRaw), 0);
  return rows.map((row) => ({
    ...row,
    percent: maxVal > 0 ? Math.max(6, Math.round((row.avgRaw / maxVal) * 100)) : 0,
  }));
});

const goalHitRate = computed(() => {
  if (!calorieGoal.value) return 0;
  const logged = data.value.filter((d) => d.totals.calories > 0);
  if (!logged.length) return 0;
  return Math.round((logged.filter((d) => d.totals.calories <= calorieGoal.value * 1.05).length / logged.length) * 100);
});

async function loadData() {
  loading.value = true;
  let startDate = "";
  let endDate = "";

  if (viewMode.value === "week") {
    const start = weekStart(weekOffset.value);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    startDate = toLocalIsoDate(start);
    endDate = toLocalIsoDate(end);
  } else {
    const [year, month] = currentMonth().split("-").map((v) => Number(v));
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    startDate = toLocalIsoDate(start);
    endDate = toLocalIsoDate(end);
  }

  data.value = (await getNutritionOverTime(startDate, endDate))?.days ?? [];
  loading.value = false;
}

watch([viewMode, weekOffset, monthOffset], loadData);

onMounted(async () => {
  if (!(await isAuthenticated())) { await router.push({ name: "login" }); return; }
  await loadData();
});
</script>

<style scoped>
.food-progress {
  max-width: 860px;
  margin: 0 auto;
  padding: 20px 12px 48px;
}

h1 { margin-bottom: 18px; }

.view-toggle { display: flex; gap: 6px; margin-bottom: 14px; }

.view-toggle button {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 44px;
  transition: all 0.15s;
}

.view-toggle button.active {
  background: var(--bg-surface-secondary);
  border-color: var(--primary);
  color: var(--primary);
}

.range-nav { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }

.nav-btn {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-main);
  border-radius: 8px;
  width: 40px;
  height: 40px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}

.nav-btn:hover:not(:disabled) { background: var(--bg-surface-secondary); }
.nav-btn:disabled { opacity: 0.3; cursor: default; }

.range-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
  flex: 1;
  text-align: center;
}

.loading-state, .empty-state { text-align: center; color: var(--text-secondary); padding: 48px 0; }

.chart-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 16px;
}

.chart-title { font-weight: 700; color: var(--text-main); margin-bottom: 12px; font-size: 0.95rem; }
.chart-area { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.bar-chart { width: 100%; display: block; }

.chart-legend { display: flex; gap: 16px; margin-top: 10px; flex-wrap: wrap; }

.micro-empty {
  color: var(--text-secondary);
  font-size: 0.9rem;
  padding: 6px 0;
}

.micro-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.micro-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.micro-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.micro-name {
  color: var(--text-main);
  font-size: 0.86rem;
}

.micro-value {
  color: var(--primary);
  font-size: 0.84rem;
  font-weight: 600;
}

.micro-bar-track {
  height: 7px;
  background: var(--bg-surface-secondary);
  border-radius: 999px;
  overflow: hidden;
}

.micro-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  border-radius: 999px;
}

.legend-item { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; color: var(--text-secondary); }
.legend-dot { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.details-toggle-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.details-toggle-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  border-radius: 8px;
  padding: 7px 12px;
  cursor: pointer;
  font-size: 0.82rem;
}

.details-toggle-btn:hover { color: var(--text-main); }

.stat-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px 14px;
  text-align: center;
}

.stat-value { font-size: 1.6rem; font-weight: 700; color: var(--text-main); margin-bottom: 2px; }
.stat-label { font-size: 0.75rem; color: var(--text-secondary); line-height: 1.3; }

.primary-color { color: var(--primary); }
.success-color { color: var(--success); }
.accent-color { color: var(--accent); }
.fat-color { color: #f97316; }
.danger-color { color: var(--danger); }
.sugar-color { color: #ff5f6d; }
.sat-fat-color { color: #ea580c; }
.unsat-fat-color { color: #ca8a04; }
.salt-color { color: #64748b; }

@media (max-width: 640px) {
  .food-progress { padding: 12px 8px 36px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .stat-value { font-size: 1.3rem; }
  .range-label { font-size: 0.85rem; }
}
</style>
