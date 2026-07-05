<template>
  <main class="chart-explorer">
    <header class="page-header">
      <div>
        <p class="eyebrow">Data explorer</p>
        <h1>Charts</h1>
      </div>
      <button class="primary-button" type="button" :disabled="isLoadingSeries || selectedSeries.length === 0" @click="loadSeries">
        {{ isLoadingSeries ? "Loading..." : "Update chart" }}
      </button>
    </header>

    <section class="control-band" aria-label="Chart controls">
      <label>
        Start
        <input v-model="startDate" type="date" />
      </label>
      <label>
        End
        <input v-model="endDate" type="date" />
      </label>
      <label>
        Bucket
        <select v-model="bucket">
          <option v-for="option in bucketOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
      </label>
    </section>

    <div v-if="isLoadingCatalog" class="state-card" aria-live="polite">Loading chart data points...</div>

    <div v-else-if="catalogError" class="state-card error-state" role="alert">
      <span>{{ catalogError }}</span>
      <button class="secondary-button" type="button" @click="loadCatalog">Try again</button>
    </div>

    <template v-else>
      <section class="chart-layout">
        <aside class="data-panel" aria-label="Data point selection">
          <div class="search-box">
            <label for="data-point-search">Data points</label>
            <input id="data-point-search" v-model="searchQuery" type="search" placeholder="Search metrics" />
            <select v-model="selectedGroup" aria-label="Filter data points by group">
              <option value="all">All groups</option>
              <option v-for="group in dataPointGroups" :key="group.name" :value="group.name">{{ group.name }} ({{ group.count }})</option>
            </select>
          </div>

          <div class="data-point-list">
            <button v-for="dataPoint in filteredDataPoints" :key="dataPoint.id" type="button" class="data-point-option" @click="addSeries(dataPoint)">
              <span>
                <strong>{{ dataPoint.label }}</strong>
                <small>{{ dataPoint.group }}</small>
              </span>
              <em>{{ dataPoint.unit || dataPoint.cadence }}</em>
            </button>
            <div v-if="filteredDataPoints.length === 0" class="data-point-empty">No matching data points.</div>
          </div>
        </aside>

        <section class="chart-surface" aria-label="Selected data chart">
          <div v-if="seriesError" class="inline-error" role="alert">{{ seriesError }}</div>
          <div v-if="selectedSeries.length === 0" class="chart-empty">No selected data points.</div>
          <div class="chart-canvas-wrap" :class="{ empty: selectedSeries.length === 0 }">
            <canvas ref="chartCanvas" aria-label="Selected health data over time"></canvas>
          </div>
        </section>

        <aside class="selected-panel" aria-label="Selected data points">
          <div class="selected-header">
            <h2>Selected</h2>
            <span>{{ selectedSeries.length }}</span>
          </div>

          <div v-if="selectedSeries.length === 0" class="selected-empty">Nothing selected.</div>

          <div v-else class="selected-list">
            <article v-for="series in selectedSeries" :key="series.dataPoint.id" class="selected-item">
              <div class="selected-topline">
                <input v-model="series.visible" type="checkbox" :aria-label="`Show ${series.dataPoint.label}`" />
                <input v-model="series.color" type="color" :aria-label="`${series.dataPoint.label} color`" />
                <div>
                  <strong>{{ series.dataPoint.label }}</strong>
                  <small>{{ series.dataPoint.group }}</small>
                </div>
                <button type="button" class="remove-button" @click="removeSeries(series.dataPoint.id)">Remove</button>
              </div>

              <div class="selected-meta">
                <span>{{ series.dataPoint.unit || "value" }}</span>
                <span>{{ series.dataPoint.cadence }}</span>
              </div>

              <label class="aggregation-select">
                Aggregation
                <select v-model="series.aggregation">
                  <option v-for="aggregation in series.dataPoint.allowedAggregations" :key="aggregation" :value="aggregation">
                    {{ aggregationLabel(aggregation) }}
                  </option>
                </select>
              </label>
            </article>
          </div>
        </aside>
      </section>
    </template>
  </main>
</template>

<script setup lang="ts">
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { getChartDataPoints, getChartSeries } from "@/services/chartService.ts";
import type { ChartAggregation, ChartBucket, ChartDataPoint, ChartSeries } from "@/types/chart/chart.type.ts";

type SelectedSeries = {
  dataPoint: ChartDataPoint;
  aggregation: ChartAggregation;
  color: string;
  visible: boolean;
};

type ChartPoint = {
  x: number;
  y: number | null;
};

const DEFAULT_DATA_POINT_IDS = [
  "hrv.window.standard.rmssd_ms",
  "hrv.window.standard.mean_hr_bpm",
  "hrv.window.standard.artifact_percent",
  "hrv.recording.rmssd_ms",
];

const chartColors = ["#00bfae", "#ff9f40", "#36a2eb", "#ff6384", "#9966ff", "#4bc0c0", "#ffcd56", "#a3e635", "#f472b6", "#60a5fa"];

const bucketOptions: Array<{ value: ChartBucket; label: string }> = [
  { value: "raw", label: "Raw" },
  { value: "hour", label: "Hour" },
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const catalog = ref<ChartDataPoint[]>([]);
const selectedSeries = ref<SelectedSeries[]>([]);
const seriesData = ref<ChartSeries[]>([]);
const searchQuery = ref("");
const selectedGroup = ref("all");
const startDate = ref(dateInputDaysAgo(30));
const endDate = ref(dateInputDaysAgo(0));
const bucket = ref<ChartBucket>("day");
const isLoadingCatalog = ref(true);
const isLoadingSeries = ref(false);
const catalogError = ref("");
const seriesError = ref("");
let chart: Chart<"line", ChartPoint[], unknown> | null = null;
let refreshTimer: number | undefined;

const selectedIds = computed(() => new Set(selectedSeries.value.map((series) => series.dataPoint.id)));
const visibleSelectedSeries = computed(() => selectedSeries.value.filter((series) => series.visible));
const chartableValueTypes = new Set(["number", "score", "duration", "boolean", "count"]);

const chartableCatalog = computed(() => {
  return catalog.value.filter((dataPoint) => chartableValueTypes.has(dataPoint.valueType));
});

const dataPointGroups = computed(() => {
  const counts = new Map<string, number>();
  for (const dataPoint of chartableCatalog.value) {
    counts.set(dataPoint.group, (counts.get(dataPoint.group) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
});

const filteredDataPoints = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  const candidates = chartableCatalog.value
    .filter((dataPoint) => !selectedIds.value.has(dataPoint.id))
    .filter((dataPoint) => selectedGroup.value === "all" || dataPoint.group === selectedGroup.value);

  const matches = query
    ? candidates.filter((dataPoint) => {
        const haystack = `${dataPoint.label} ${dataPoint.group} ${dataPoint.id} ${dataPoint.searchableText}`.toLowerCase();
        return haystack.includes(query);
      })
    : candidates;

  return matches.sort((a, b) => a.group.localeCompare(b.group) || a.label.localeCompare(b.label)).slice(0, 120);
});

function dateInputDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

function aggregationLabel(aggregation: ChartAggregation): string {
  const labels: Record<ChartAggregation, string> = {
    avg: "Average",
    sum: "Sum",
    min: "Minimum",
    max: "Maximum",
    count: "Count",
    latest: "Latest",
  };
  return labels[aggregation];
}

function colorForIndex(index: number): string {
  return chartColors[index % chartColors.length];
}

function normalizeAxisId(unit: string | null): string {
  const key = (unit || "value")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `axis-${key || "value"}`;
}

function chartTimeUnit(): "hour" | "day" | "week" | "month" {
  if (bucket.value === "hour") return "hour";
  if (bucket.value === "week") return "week";
  if (bucket.value === "month") return "month";
  return "day";
}

function addSeries(dataPoint: ChartDataPoint): void {
  if (selectedIds.value.has(dataPoint.id)) return;

  selectedSeries.value.push({
    dataPoint,
    aggregation: dataPoint.defaultAggregation,
    color: colorForIndex(selectedSeries.value.length),
    visible: true,
  });
}

function removeSeries(dataPointId: string): void {
  selectedSeries.value = selectedSeries.value.filter((series) => series.dataPoint.id !== dataPointId);
}

function chooseDefaultSeries(dataPoints: ChartDataPoint[]): SelectedSeries[] {
  const chartableDataPoints = dataPoints.filter((dataPoint) => chartableValueTypes.has(dataPoint.valueType));
  const defaultDataPoints = chartableDataPoints.filter((dataPoint) => dataPoint.defaultVisible);
  const hrvDefaults = DEFAULT_DATA_POINT_IDS.map((id) => chartableDataPoints.find((dataPoint) => dataPoint.id === id)).filter(
    (dataPoint): dataPoint is ChartDataPoint => Boolean(dataPoint),
  );
  const fallback = defaultDataPoints.length > 0 ? defaultDataPoints : hrvDefaults.length > 0 ? hrvDefaults : chartableDataPoints.slice(0, 3);

  return fallback.slice(0, 4).map((dataPoint, index) => ({
    dataPoint,
    aggregation: dataPoint.defaultAggregation,
    color: colorForIndex(index),
    visible: true,
  }));
}

function buildYScales() {
  const units = Array.from(new Set(visibleSelectedSeries.value.map((series) => series.dataPoint.unit || "value")));
  const scales: Record<string, object> = {};

  units.forEach((unit, index) => {
    const axisId = normalizeAxisId(unit);
    scales[axisId] = {
      type: "linear",
      display: true,
      position: index === 0 ? "left" : "right",
      title: {
        display: true,
        text: unit,
      },
      grid: {
        drawOnChartArea: index === 0,
        color: "rgba(148, 163, 184, 0.15)",
      },
      ticks: {
        color: "rgba(226, 232, 240, 0.72)",
      },
    };
  });

  return scales;
}

async function renderChart(): Promise<void> {
  await nextTick();

  if (!chartCanvas.value || selectedSeries.value.length === 0) {
    chart?.destroy();
    chart = null;
    return;
  }

  const visibleIds = new Set(visibleSelectedSeries.value.map((series) => series.dataPoint.id));
  const responseSeriesById = new Map(seriesData.value.map((series) => [series.dataPointId, series]));
  const datasets = visibleSelectedSeries.value.map((selected) => {
    const responseSeries = responseSeriesById.get(selected.dataPoint.id);
    const chartPoints: ChartPoint[] = responseSeries?.points.map((point) => ({ x: new Date(point.x).getTime(), y: point.y })) ?? [];
    return {
      label: `${selected.dataPoint.label}${selected.dataPoint.unit ? ` (${selected.dataPoint.unit})` : ""}`,
      data: chartPoints,
      borderColor: selected.color,
      backgroundColor: selected.color,
      borderWidth: 2,
      pointRadius: bucket.value === "raw" ? 1.5 : 2.5,
      pointHoverRadius: 5,
      spanGaps: true,
      tension: 0.22,
      yAxisID: normalizeAxisId(selected.dataPoint.unit),
      hidden: !visibleIds.has(selected.dataPoint.id),
    };
  });

  chart?.destroy();
  chart = new Chart(chartCanvas.value, {
    type: "line",
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      parsing: false,
      interaction: {
        mode: "nearest",
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (item) => {
              const selected = visibleSelectedSeries.value[item.datasetIndex];
              const value = typeof item.parsed.y === "number" ? formatNumber(item.parsed.y) : "-";
              return selected?.dataPoint.unit
                ? `${selected.dataPoint.label}: ${value} ${selected.dataPoint.unit}`
                : `${selected?.dataPoint.label}: ${value}`;
            },
          },
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            unit: chartTimeUnit(),
          },
          grid: {
            color: "rgba(148, 163, 184, 0.12)",
          },
          ticks: {
            color: "rgba(226, 232, 240, 0.72)",
            maxRotation: 0,
          },
        },
        ...buildYScales(),
      },
    },
  });
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: Math.abs(value) >= 100 ? 0 : 2,
  }).format(value);
}

function scheduleSeriesLoad(): void {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => void loadSeries(), 250);
}

async function loadCatalog(): Promise<void> {
  isLoadingCatalog.value = true;
  catalogError.value = "";

  try {
    catalog.value = await getChartDataPoints();
    selectedSeries.value = chooseDefaultSeries(catalog.value);
    await loadSeries();
  } catch (error) {
    console.error(error);
    catalogError.value = "Chart data points could not be loaded.";
  } finally {
    isLoadingCatalog.value = false;
  }
}

async function loadSeries(): Promise<void> {
  window.clearTimeout(refreshTimer);
  seriesError.value = "";

  if (visibleSelectedSeries.value.length === 0) {
    seriesData.value = [];
    await renderChart();
    return;
  }

  isLoadingSeries.value = true;
  try {
    const response = await getChartSeries({
      startDate: startDate.value,
      endDate: endDate.value,
      bucket: bucket.value,
      series: visibleSelectedSeries.value.map((series) => ({
        dataPointId: series.dataPoint.id,
        aggregation: series.aggregation,
      })),
    });
    seriesData.value = response.series;
    await renderChart();
  } catch (error) {
    console.error(error);
    seriesError.value = "Chart data could not be loaded.";
  } finally {
    isLoadingSeries.value = false;
  }
}

watch([selectedSeries, startDate, endDate, bucket], scheduleSeriesLoad, { deep: true });
watch(seriesData, () => void renderChart(), { deep: true });

onMounted(() => void loadCatalog());
onUnmounted(() => {
  window.clearTimeout(refreshTimer);
  chart?.destroy();
});
</script>

<style scoped>
.chart-explorer {
  width: min(1540px, 100%);
  margin: 0 auto;
  padding: 24px clamp(14px, 3vw, 36px) 44px;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.eyebrow {
  margin: 0 0 6px;
  color: var(--primary);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 0;
  font-size: clamp(1.7rem, 4vw, 2.35rem);
}

.primary-button,
.secondary-button,
.remove-button {
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
}

.primary-button {
  flex-shrink: 0;
  padding: 10px 14px;
  color: var(--bg-main);
  background: var(--primary);
  border-color: var(--primary);
}

.primary-button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.secondary-button,
.remove-button {
  color: var(--text-main);
  background: var(--bg-surface-secondary);
}

.secondary-button {
  padding: 8px 12px;
}

.remove-button {
  padding: 6px 8px;
  font-size: 0.72rem;
}

.control-band {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
  padding: 14px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 10px;
}

.control-band label,
.search-box label,
.aggregation-select {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
}

.control-band input,
.control-band select,
.search-box input,
.search-box select,
.aggregation-select select {
  min-height: 36px;
  color: var(--text-main);
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 7px 9px;
  box-sizing: border-box;
  outline: none;
}

.control-band input:focus,
.control-band select:focus,
.search-box input:focus,
.search-box select:focus,
.aggregation-select select:focus {
  border-color: var(--primary);
}

.chart-layout {
  display: grid;
  grid-template-columns: minmax(240px, 300px) minmax(0, 1fr) minmax(260px, 330px);
  gap: 16px;
  align-items: stretch;
}

.data-panel,
.chart-surface,
.selected-panel,
.state-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.data-panel,
.selected-panel {
  min-height: 520px;
  overflow: hidden;
}

.search-box {
  padding: 14px;
  border-bottom: 1px solid var(--border);
}

.data-point-list,
.selected-list {
  display: grid;
  gap: 8px;
  max-height: 620px;
  overflow-y: auto;
  padding: 10px;
}

.data-point-empty {
  padding: 14px 4px;
  color: var(--text-secondary);
  font-size: 0.86rem;
  text-align: center;
}

.data-point-option {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 10px;
  color: var(--text-main);
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
}

.data-point-option:hover {
  border-color: var(--primary);
}

.data-point-option span,
.selected-topline div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.data-point-option strong,
.selected-item strong {
  overflow: hidden;
  font-size: 0.84rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.data-point-option small,
.selected-item small {
  overflow: hidden;
  color: var(--text-secondary);
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.data-point-option em {
  flex-shrink: 0;
  color: var(--primary);
  font-size: 0.72rem;
  font-style: normal;
}

.chart-surface {
  position: relative;
  min-height: 560px;
  padding: 14px;
}

.chart-canvas-wrap {
  height: 560px;
}

.chart-canvas-wrap.empty {
  opacity: 0.35;
}

.chart-empty,
.selected-empty,
.inline-error {
  color: var(--text-secondary);
  font-size: 0.88rem;
}

.chart-empty {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1;
}

.inline-error {
  margin-bottom: 10px;
  color: var(--danger);
}

.selected-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  border-bottom: 1px solid var(--border);
}

.selected-header h2 {
  margin: 0;
  font-size: 1rem;
}

.selected-header span {
  min-width: 24px;
  padding: 2px 7px;
  color: var(--primary);
  background: rgba(0, 191, 174, 0.12);
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
  text-align: center;
}

.selected-empty {
  padding: 14px;
}

.selected-item {
  display: grid;
  gap: 10px;
  padding: 10px;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.selected-topline {
  display: grid;
  grid-template-columns: 18px 32px minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
}

.selected-topline input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--primary);
}

.selected-topline input[type="color"] {
  width: 30px;
  height: 28px;
  padding: 0;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.selected-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.selected-meta span {
  padding: 3px 7px;
  color: var(--text-secondary);
  background: var(--bg-main);
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 0.7rem;
}

.aggregation-select {
  text-transform: none;
}

.state-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 18px;
  color: var(--text-secondary);
}

.error-state {
  border-left: 3px solid var(--danger);
}

@media (max-width: 1120px) {
  .chart-layout {
    grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  }

  .selected-panel {
    grid-column: 1 / -1;
    min-height: auto;
  }

  .selected-list {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    max-height: none;
  }
}

@media (max-width: 760px) {
  .page-header {
    align-items: stretch;
    flex-direction: column;
  }

  .primary-button {
    align-self: flex-start;
  }

  .chart-layout {
    grid-template-columns: 1fr;
  }

  .data-panel {
    min-height: auto;
  }

  .data-point-list {
    max-height: 320px;
  }

  .chart-surface {
    min-height: 420px;
  }

  .chart-canvas-wrap {
    height: 400px;
  }
}
</style>
