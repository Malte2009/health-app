<template>
  <main class="windows-view">
    <RouterLink :to="{ name: 'hrvDetails', params: { id: recordingId } }" class="back-link">
      <span aria-hidden="true">←</span>
      Recording details
    </RouterLink>

    <div v-if="isLoading" class="state-card loading-state" aria-live="polite">
      <span class="spinner"></span>
      <div>
        <strong>Loading HRV windows</strong>
        <p>Retrieving the calculated five-minute segments.</p>
      </div>
    </div>

    <div v-else-if="loadError" class="state-card error-state" role="alert">
      <div>
        <strong>Windows could not be loaded</strong>
        <p>{{ loadError }}</p>
      </div>
      <button class="secondary-button" type="button" @click="loadWindows()">Try again</button>
    </div>

    <template v-else-if="windowData">
      <header class="page-header">
        <div>
          <p class="eyebrow">HRV window analysis</p>
          <h1>{{ recordingTitle }}</h1>
          <p class="recording-meta">{{ recordingMeta }}</p>
        </div>
        <div class="status-pill" :class="`status-${windowData.generationStatus}`">
          <span class="status-dot"></span>
          {{ statusLabel }}
        </div>
      </header>

      <section class="summary-strip" aria-label="Window summary">
        <div class="summary-item">
          <span>Windows</span>
          <strong>{{ windowData.windows.length }}</strong>
        </div>
        <div class="summary-item">
          <span>Window size</span>
          <strong>5 min</strong>
        </div>
        <div class="summary-item">
          <span>Covered span</span>
          <strong>{{ coveredSpan }}</strong>
        </div>
        <div class="summary-item">
          <span>Generated</span>
          <strong>{{ generatedAtLabel }}</strong>
        </div>
      </section>

      <div
        v-if="windowData.generationStatus !== 'ready'"
        class="generation-banner"
        :class="`generation-${windowData.generationStatus}`"
        aria-live="polite"
      >
        <div>
          <strong>{{ generationMessage.title }}</strong>
          <p>{{ generationMessage.body }}</p>
        </div>
        <button class="secondary-button" type="button" :disabled="isRefreshing" @click="loadWindows(true)">
          {{ isRefreshing ? "Checking…" : "Check now" }}
        </button>
      </div>

      <section class="table-card">
        <div class="table-toolbar">
          <div>
            <h2>Window comparison</h2>
            <p>Compare consistent metrics across the recording, then open a row for the full result.</p>
          </div>
          <div class="toolbar-actions">
            <div class="variant-selector" role="group" aria-label="Metric filtering">
              <button
                v-for="option in variantOptions"
                :key="option.value"
                type="button"
                :class="{ active: selectedVariant === option.value }"
                :aria-pressed="selectedVariant === option.value"
                @click="selectedVariant = option.value"
              >
                {{ option.label }}
                <span>{{ metricAvailability[option.value] }}</span>
              </button>
            </div>
            <button
              class="expand-table-button"
              type="button"
              :aria-expanded="showAllMetrics"
              @click="showAllMetrics = !showAllMetrics"
            >
              <span aria-hidden="true">{{ showAllMetrics ? "↤" : "↦" }}</span>
              {{ showAllMetrics ? "Compact table" : "Show all metrics" }}
            </button>
          </div>
        </div>

        <div v-if="windowData.windows.length === 0" class="empty-state">
          <div class="empty-icon" aria-hidden="true">▦</div>
          <h3>{{ emptyState.title }}</h3>
          <p>{{ emptyState.body }}</p>
        </div>

        <template v-else>
          <div class="table-scroll" :class="{ expanded: showAllMetrics }">
            <table>
              <thead v-if="showAllMetrics">
                <tr class="metric-group-headings">
                  <th rowspan="2">Window</th>
                  <th rowspan="2">Time</th>
                  <th v-for="group in metricGroups" :key="group.title" :colspan="group.items.length">
                    {{ group.title }}
                  </th>
                </tr>
                <tr>
                  <template v-for="group in metricGroups" :key="group.title">
                    <th v-for="item in group.items" :key="item.key" class="all-metric-heading">
                      {{ metricColumnLabel(item) }}
                    </th>
                  </template>
                </tr>
              </thead>
              <thead v-else>
                <tr>
                  <th>Window</th>
                  <th>Time</th>
                  <th>Mean HR</th>
                  <th>HR range</th>
                  <th>SDNN</th>
                  <th>RMSSD</th>
                  <th>pNN50</th>
                  <th>LF / HF</th>
                  <th>DFA α1</th>
                  <th>Artifacts</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(hrvWindow, index) in windowData.windows" :key="hrvWindow.id">
                    <td>
                      <span class="window-number">{{ String(index + 1).padStart(2, "0") }}</span>
                      <span v-if="hrvWindow.eventTag" class="event-tag">{{ hrvWindow.eventTag }}</span>
                    </td>
                    <td class="time-cell">{{ formatWindowRange(hrvWindow) }}</td>
                    <template v-if="hrvWindow.metrics[selectedVariant]">
                      <template v-if="showAllMetrics">
                        <td v-for="item in allMetricColumns" :key="item.key">
                          {{ formatMetricCell(hrvWindow.metrics[selectedVariant], item) }}
                        </td>
                      </template>
                      <template v-else>
                        <td>{{ formatNumber(hrvWindow.metrics[selectedVariant]?.mean_hr_bpm, 1) }} bpm</td>
                        <td>{{ formatHeartRateRange(hrvWindow.metrics[selectedVariant]) }}</td>
                        <td>{{ formatNumber(hrvWindow.metrics[selectedVariant]?.sdnn_ms, 1) }} ms</td>
                        <td>{{ formatNumber(hrvWindow.metrics[selectedVariant]?.rmssd_ms, 1) }} ms</td>
                        <td>{{ formatNumber(hrvWindow.metrics[selectedVariant]?.pnn50_percent, 1) }}%</td>
                        <td>{{ formatNumber(hrvWindow.metrics[selectedVariant]?.lf_hf_ratio, 2) }}</td>
                        <td>{{ formatNumber(hrvWindow.metrics[selectedVariant]?.dfa_alpha1, 2) }}</td>
                        <td>{{ formatNumber(hrvWindow.metrics[selectedVariant]?.artifact_percent, 1) }}%</td>
                      </template>
                    </template>
                    <td v-else :colspan="showAllMetrics ? allMetricColumns.length : 8" class="missing-metrics">
                      No {{ selectedVariantLabel.toLowerCase() }} metrics
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </section>
    </template>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getHrvWindows } from "@/services/hrvService.ts";
import type { HrvMetricVariant, HrvWindowMetrics, HrvWindowsResponse, HrvWindowSummary } from "@/types/hrv/hrvWindow.type.ts";

type MetricItem = {
  key: keyof HrvWindowMetrics;
  label: string;
  unit?: string;
  digits?: number;
};

type MetricGroup = {
  title: string;
  items: MetricItem[];
};

const route = useRoute();
const recordingId = route.params.id as string;

const windowData = ref<HrvWindowsResponse | null>(null);
const isLoading = ref(true);
const isRefreshing = ref(false);
const loadError = ref("");
const selectedVariant = ref<HrvMetricVariant>("standard");
const showAllMetrics = ref(false);
let refreshTimer: number | undefined;

const variantOptions: Array<{ value: HrvMetricVariant; label: string }> = [
  { value: "none", label: "Unfiltered" },
  { value: "standard", label: "Standard" },
  { value: "all", label: "All filters" },
];

const metricGroups: MetricGroup[] = [
  {
    title: "Time domain",
    items: [
      { key: "mean_rr_ms", label: "Mean RR", unit: "ms", digits: 1 },
      { key: "mean_hr_bpm", label: "Mean HR", unit: "bpm", digits: 1 },
      { key: "min_hr_bpm", label: "Minimum HR", unit: "bpm", digits: 1 },
      { key: "max_hr_bpm", label: "Maximum HR", unit: "bpm", digits: 1 },
      { key: "sdnn_ms", label: "SDNN", unit: "ms", digits: 1 },
      { key: "rmssd_ms", label: "RMSSD", unit: "ms", digits: 1 },
      { key: "pnn50_percent", label: "pNN50", unit: "%", digits: 1 },
    ],
  },
  {
    title: "Frequency domain",
    items: [
      { key: "vlf_power", label: "VLF power", unit: "ms²", digits: 1 },
      { key: "lf_power", label: "LF power", unit: "ms²", digits: 1 },
      { key: "hf_power", label: "HF power", unit: "ms²", digits: 1 },
      { key: "lf_hf_ratio", label: "LF / HF ratio", digits: 2 },
      { key: "hf_peak_hz", label: "HF peak", unit: "Hz", digits: 3 },
      { key: "rsa_bpm", label: "RSA", unit: "breaths/min", digits: 1 },
    ],
  },
  {
    title: "Poincaré & autonomic",
    items: [
      { key: "sd1_ms", label: "SD1", unit: "ms", digits: 1 },
      { key: "sd2_ms", label: "SD2", unit: "ms", digits: 1 },
      { key: "sd1_sd2_ratio", label: "SD1 / SD2", digits: 2 },
      { key: "baevsky_si", label: "Baevsky stress index", digits: 2 },
      { key: "csi", label: "Cardiac sympathetic index", digits: 2 },
      { key: "cvi", label: "Cardiac vagal index", digits: 2 },
    ],
  },
  {
    title: "Complexity",
    items: [
      { key: "sample_entropy", label: "Sample entropy", digits: 3 },
      { key: "approx_entropy", label: "Approximate entropy", digits: 3 },
      { key: "dfa_alpha1", label: "DFA α1", digits: 3 },
    ],
  },
  {
    title: "Artifact handling",
    items: [
      { key: "artifact_percent", label: "Artifact share", unit: "%", digits: 1 },
      { key: "artifact_total", label: "Total artifacts", digits: 0 },
      { key: "replaced_range", label: "Range replacements", digits: 0 },
      { key: "replaced_moving_average", label: "Moving-average replacements", digits: 0 },
      { key: "replaced_adaptive", label: "Adaptive replacements", digits: 0 },
      { key: "replaced_artifact_split", label: "Artifact splits", digits: 0 },
      { key: "artifact_merge_prev", label: "Merged artifacts", digits: 0 },
      { key: "preserved_vagal_burst", label: "Preserved vagal bursts", digits: 0 },
      { key: "preserved_pvc", label: "Preserved PVCs", digits: 0 },
      { key: "preserved_tachy", label: "Preserved tachy events", digits: 0 },
      { key: "merged_with_previous", label: "Merged with previous" },
    ],
  },
  {
    title: "RR jump histogram",
    items: [
      { key: "jump_count_100ms_200ms", label: "100–200 ms", digits: 0 },
      { key: "jump_count_200ms_300ms", label: "200–300 ms", digits: 0 },
      { key: "jump_count_300ms_400ms", label: "300–400 ms", digits: 0 },
      { key: "jump_count_400ms_500ms", label: "400–500 ms", digits: 0 },
      { key: "jump_count_500ms_600ms", label: "500–600 ms", digits: 0 },
      { key: "jump_count_600ms_700ms", label: "600–700 ms", digits: 0 },
      { key: "jump_count_700ms_800ms", label: "700–800 ms", digits: 0 },
      { key: "jump_count_800ms_900ms", label: "800–900 ms", digits: 0 },
      { key: "jump_count_900ms_1000ms", label: "900–1000 ms", digits: 0 },
      { key: "jump_count_1000ms", label: "Over 1000 ms", digits: 0 },
    ],
  },
];

const allMetricColumns = metricGroups.flatMap((group) => group.items);

const recordingTitle = computed(() => windowData.value?.recording.name?.trim() || "HRV recording");

const recordingMeta = computed(() => {
  if (!windowData.value) return "";
  const recording = windowData.value.recording;
  return [formatDate(recording.date), recording.context, recording.device].filter(Boolean).join(" · ");
});

const statusLabel = computed(() => {
  const labels = {
    pending: "Waiting to process",
    processing: "Processing",
    ready: "Ready",
    failed: "Generation failed",
  };
  return labels[windowData.value?.generationStatus ?? "pending"];
});

const generationMessage = computed(() => {
  const status = windowData.value?.generationStatus;
  if (status === "failed") {
    return {
      title: "Window generation failed",
      body: "The existing results remain visible, but this recording needs to be reprocessed to produce a current set.",
    };
  }
  if (status === "processing") {
    return {
      title: "Windows are being calculated",
      body: "This page checks automatically and will update when the new metrics are ready.",
    };
  }
  return {
    title: "Window generation is queued",
    body: "The recording has been saved and is waiting for background processing.",
  };
});

const emptyState = computed(() => {
  if (windowData.value?.generationStatus === "ready") {
    return {
      title: "No windows were generated",
      body: "This recording may not contain enough RR intervals for a five-minute window.",
    };
  }
  return {
    title: "Windows are not available yet",
    body: "They will appear here as soon as background processing finishes.",
  };
});

const metricAvailability = computed<Record<HrvMetricVariant, number>>(() => {
  const result: Record<HrvMetricVariant, number> = { none: 0, standard: 0, all: 0 };
  for (const hrvWindow of windowData.value?.windows ?? []) {
    for (const variant of Object.keys(result) as HrvMetricVariant[]) {
      if (hrvWindow.metrics[variant]) result[variant] += 1;
    }
  }
  return result;
});

const selectedVariantLabel = computed(() => variantOptions.find((option) => option.value === selectedVariant.value)?.label ?? "Standard");

const coveredSpan = computed(() => {
  const windows = windowData.value?.windows ?? [];
  if (windows.length === 0) return "—";
  const start = new Date(windows[0].windowStart).getTime();
  const lastWindow = windows[windows.length - 1];
  const end = new Date(lastWindow.windowStart).getTime() + lastWindow.durationSeconds * 1000;
  return formatDuration(Math.max(0, end - start));
});

const generatedAtLabel = computed(() => {
  const generatedAt = windowData.value?.generatedAt;
  if (!generatedAt) return "—";
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(generatedAt));
});

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(new Date(value));
}

function formatDuration(milliseconds: number): string {
  const totalMinutes = Math.round(milliseconds / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}

function formatWindowRange(hrvWindow: HrvWindowSummary): string {
  const start = new Date(hrvWindow.windowStart);
  const end = new Date(start.getTime() + hrvWindow.durationSeconds * 1000);
  const timeFormatter = new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${timeFormatter.format(start)}–${timeFormatter.format(end)}`;
}

function formatNumber(value: number | null | undefined, digits = 2): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function formatHeartRateRange(metric: HrvWindowMetrics | null): string {
  if (!metric || metric.min_hr_bpm === null || metric.max_hr_bpm === null) return "—";
  return `${formatNumber(metric.min_hr_bpm, 0)}–${formatNumber(metric.max_hr_bpm, 0)} bpm`;
}

function metricColumnLabel(item: MetricItem): string {
  return item.unit ? `${item.label} (${item.unit})` : item.label;
}

function formatMetricCell(metric: HrvWindowMetrics | null, item: MetricItem): string {
  if (!metric) return "—";
  const value = metric[item.key];
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value !== "number") return "—";
  return formatNumber(value, item.digits ?? 2);
}

function scheduleRefresh(): void {
  window.clearTimeout(refreshTimer);
  const status = windowData.value?.generationStatus;
  if (status === "pending" || status === "processing") {
    refreshTimer = window.setTimeout(() => void loadWindows(true), 4_000);
  }
}

async function loadWindows(background = false): Promise<void> {
  window.clearTimeout(refreshTimer);
  if (background) isRefreshing.value = true;
  else isLoading.value = true;
  if (!windowData.value) loadError.value = "";

  try {
    windowData.value = await getHrvWindows(recordingId);
  } catch (error) {
    console.error(error);
    if (!windowData.value) {
      loadError.value = "The recording may no longer exist, or the server could not return its windows.";
    }
  } finally {
    isLoading.value = false;
    isRefreshing.value = false;
    scheduleRefresh();
  }
}

onMounted(() => void loadWindows());
onUnmounted(() => window.clearTimeout(refreshTimer));
</script>

<style scoped>
.windows-view {
  width: min(1440px, 100%);
  margin: 0 auto;
  padding: 24px clamp(14px, 3vw, 36px) 48px;
  box-sizing: border-box;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.18s;
}

.back-link:hover {
  color: var(--primary);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 22px;
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
h3,
h4,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 7px;
  font-size: clamp(1.7rem, 4vw, 2.4rem);
}

.recording-meta,
.table-toolbar p,
.detail-header p,
.state-card p,
.generation-banner p,
.empty-state p {
  margin-bottom: 0;
  color: var(--text-secondary);
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 7px 11px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg-surface);
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-weight: 700;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.status-ready {
  color: var(--success);
}

.status-processing {
  color: var(--primary);
}

.status-failed {
  color: var(--danger);
}

.summary-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(130px, 1fr));
  margin-bottom: 18px;
  overflow: hidden;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 15px 18px;
  border-right: 1px solid var(--border);
}

.summary-item:last-child {
  border-right: 0;
}

.summary-item span {
  color: var(--text-secondary);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.summary-item strong {
  font-size: 1rem;
}

.generation-banner,
.state-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;
  padding: 15px 17px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--primary);
  border-radius: 10px;
}

.generation-failed,
.error-state {
  border-left-color: var(--danger);
}

.state-card {
  min-height: 90px;
  margin-top: 30px;
  justify-content: flex-start;
}

.error-state {
  justify-content: space-between;
}

.spinner {
  width: 23px;
  height: 23px;
  flex-shrink: 0;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.secondary-button {
  flex-shrink: 0;
  padding: 8px 12px;
  color: var(--text-main);
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
}

.secondary-button:hover:not(:disabled) {
  border-color: var(--primary);
}

.secondary-button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.table-card {
  overflow: hidden;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--border);
}

.table-toolbar h2 {
  margin-bottom: 5px;
  font-size: 1.1rem;
}

.table-toolbar p {
  font-size: 0.84rem;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
}

.variant-selector {
  display: flex;
  flex-shrink: 0;
  gap: 3px;
  padding: 3px;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 9px;
}

.variant-selector button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 9px;
  color: var(--text-secondary);
  background: transparent;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.78rem;
}

.variant-selector button.active {
  color: var(--text-main);
  background: var(--bg-surface);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.18);
}

.variant-selector button span {
  min-width: 18px;
  padding: 1px 4px;
  color: var(--text-secondary);
  background: var(--bg-main);
  border-radius: 9px;
  font-size: 0.65rem;
}

.expand-table-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 11px;
  color: var(--text-main);
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 9px;
  cursor: pointer;
  font-size: 0.78rem;
  white-space: nowrap;
  transition: border-color 0.18s, background-color 0.18s;
}

.expand-table-button:hover,
.expand-table-button[aria-expanded="true"] {
  background: var(--bg-main);
  border-color: var(--primary);
}

.expand-table-button span {
  color: var(--primary);
  font-size: 1rem;
}

.table-scroll {
  overflow-x: auto;
}

.table-scroll.expanded table {
  width: max-content;
  min-width: 100%;
}

.table-scroll.expanded th:first-child,
.table-scroll.expanded td:first-child {
  position: sticky;
  left: 0;
  z-index: 2;
  min-width: 86px;
  background: var(--bg-surface);
}

.table-scroll.expanded th:first-child {
  z-index: 3;
  background: var(--bg-surface-secondary);
}

table {
  width: 100%;
  min-width: 1080px;
  border-collapse: collapse;
  font-size: 0.82rem;
  font-variant-numeric: tabular-nums;
}

th {
  padding: 10px 12px;
  color: var(--text-secondary);
  background: var(--bg-surface-secondary);
  border-bottom: 1px solid var(--border);
  font-size: 0.68rem;
  letter-spacing: 0.055em;
  text-align: right;
  text-transform: uppercase;
  white-space: nowrap;
}

.metric-group-headings th:not(:first-child):not(:nth-child(2)) {
  color: var(--primary);
  border-left: 1px solid var(--border);
  text-align: center;
}

.all-metric-heading {
  min-width: 105px;
  white-space: normal;
}

.table-scroll.expanded thead tr:nth-child(2) th {
  text-align: right;
}

th:first-child,
th:nth-child(2),
td:first-child,
td:nth-child(2) {
  text-align: left;
}

td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  text-align: right;
  white-space: nowrap;
}

tbody tr {
  transition: background-color 0.15s;
}

tbody tr:hover {
  background: rgba(0, 191, 174, 0.055);
}

.window-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 24px;
  color: var(--primary);
  background: rgba(0, 191, 174, 0.1);
  border-radius: 6px;
  font-weight: 700;
}

.event-tag {
  margin-left: 7px;
  color: var(--text-secondary);
  font-size: 0.72rem;
}

.time-cell {
  color: var(--text-secondary);
}

.missing-metrics {
  color: var(--text-secondary);
  text-align: center;
  font-style: italic;
}

.empty-state {
  padding: 44px 20px;
  color: var(--text-secondary);
  text-align: center;
}

.empty-state h3 {
  margin-bottom: 7px;
  color: var(--text-main);
}

.empty-icon {
  margin-bottom: 10px;
  color: var(--primary);
  font-size: 2rem;
}

@media (max-width: 760px) {
  .windows-view {
    padding-top: 16px;
  }

  .page-header,
  .table-toolbar,
  .generation-banner,
  .error-state {
    align-items: stretch;
    flex-direction: column;
  }

  .status-pill {
    align-self: flex-start;
  }

  .summary-strip {
    grid-template-columns: repeat(2, 1fr);
  }

  .summary-item:nth-child(2) {
    border-right: 0;
  }

  .summary-item:nth-child(-n + 2) {
    border-bottom: 1px solid var(--border);
  }

  .variant-selector {
    align-self: flex-start;
  }

  .toolbar-actions {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
