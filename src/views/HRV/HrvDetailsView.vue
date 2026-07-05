<template>
  <div class="hrv-details-view">
    <div v-if="loadError" class="error-state" role="alert">{{ loadError }}</div>
    <div class="control-panel">
      <div class="filter-panel">
        <input id="range-filter" type="checkbox" v-model="filters.range" />
        <label for="range-filter">Range Filter</label>
        <input id="moving-average-filter" type="checkbox" v-model="filters.movingAverage" />
        <label for="moving-average-filter">Moving Average Filter</label>
        <input id="artifact-filter" type="checkbox" v-model="filters.artifact" />
        <label for="artifact-filter">Artifact Filter</label>
        <button @click="applyFilters" :disabled="isLoading" class="apply-btn">
          {{ isLoading ? "Loading..." : "Apply Filters" }}
        </button>
        <button @click="resetZoom" class="apply-btn" style="background-color: var(--bg-surface-secondary); color: var(--text-main)">
          Reset Zoom
        </button>
        <button @click="copyVisibleRR" class="apply-btn" style="background-color: var(--bg-surface-secondary); color: var(--text-main)">
          Copy Visible RR
        </button>
        <RouterLink
          :to="{ name: 'hrvWindows', params: { id: recordingId } }"
          class="windows-link"
          title="Compare the recording's five-minute HRV windows"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <rect x="3" y="4" width="7" height="7" rx="1" />
            <rect x="14" y="4" width="7" height="7" rx="1" />
            <rect x="3" y="15" width="7" height="5" rx="1" />
            <rect x="14" y="15" width="7" height="5" rx="1" />
          </svg>
          <span>
            <strong>Window analysis</strong>
            <small>5-minute segments</small>
          </span>
          <span class="windows-link-arrow" aria-hidden="true">→</span>
        </RouterLink>
      </div>
      <div v-if="isLoading" class="loading-spinner"></div>
    </div>
    <div class="hrv-content">
      <div class="hrv-graphs">
        <div class="rr-graph graph">
          <canvas id="rr-graph-canvas"></canvas>
        </div>
        <div class="hr-graph graph">
          <canvas id="hr-graph-canvas"></canvas>
        </div>
        <div class="hrv-graph graph">
          <canvas id="hrv-graph-canvas"></canvas>
        </div>
      </div>

      <div class="hrv-metrics-display">
        <div style="display: flex; gap: 20px; flex-wrap: wrap">
          <div class="hrv-metrics">
            <table class="hrv-metrics-table">
              <tr class="hrv-metrics-row">
                <th colspan="2">Time Domain</th>
              </tr>
              <tr class="hrv-metrics-row">
                <td>Mean RR (ms)</td>
                <td>{{ roundTo(loadedMetrics.mean_rr_ms, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row second-metrics-row">
                <td>Mean HR (bpm)</td>
                <td>{{ roundTo(loadedMetrics.mean_hr_bpm, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row">
                <td>Max HR (bpm)</td>
                <td>{{ roundTo(loadedMetrics.max_hr_bpm, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row second-metrics-row">
                <td>Min HR (bpm</td>
                <td>{{ roundTo(loadedMetrics.min_hr_bpm, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row">
                <td>SDNN (ms)</td>
                <td>{{ roundTo(loadedMetrics.sdnn_ms, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row second-metrics-row">
                <td>RMSSD (ms)</td>
                <td>{{ roundTo(loadedMetrics.rmssd_ms, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row">
                <td>pNN50 (%)</td>
                <td>{{ roundTo(loadedMetrics.pnn50_percent, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row">
                <th colspan="2">Frequency Domain</th>
              </tr>
              <tr class="hrv-metrics-row">
                <td>VLF Power (ms²)</td>
                <td>{{ roundTo(loadedMetrics.vlf_power, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row">
                <td>LF Power (ms²)</td>
                <td>{{ roundTo(loadedMetrics.lf_power, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row">
                <td>HF Power (ms²)</td>
                <td>{{ roundTo(loadedMetrics.hf_power, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row">
                <td>LF / HF Ratio</td>
                <td>{{ roundTo(loadedMetrics.lf_hf_ratio, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row">
                <td>HF Peak (Hz)</td>
                <td>{{ roundTo(loadedMetrics.hf_peak_hz, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row">
                <td>RSA Peak (breaths/min)</td>
                <td>{{ roundTo(loadedMetrics.rsa_bpm, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row">
                <th colspan="2">Non-linear / Poincare</th>
              </tr>
              <tr class="hrv-metrics-row">
                <td>SD1 (ms)</td>
                <td>{{ roundTo(loadedMetrics.sd1_ms, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row">
                <td>SD2 (ms)</td>
                <td>{{ roundTo(loadedMetrics.sd2_ms, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row">
                <td>SD1 / SD2 Ratio</td>
                <td>{{ roundTo(loadedMetrics.sd1_sd2_ratio, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row">
                <td>Baevsky Stress Index</td>
                <td>{{ roundTo(loadedMetrics.baevsky_si, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row">
                <td>Cardiac Sympathetic Index</td>
                <td>{{ roundTo(loadedMetrics.csi, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row">
                <td>Cardiac Vagal Index</td>
                <td>{{ roundTo(loadedMetrics.cvi, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row">
                <th colspan="2">Entropy / Complexity</th>
              </tr>
              <tr class="hrv-metrics-row">
                <td>Sample Entropy</td>
                <td>{{ roundTo(loadedMetrics.sample_entropy, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row">
                <td>Approx. Entropy</td>
                <td>{{ roundTo(loadedMetrics.approx_entropy, 2) }}</td>
              </tr>
              <tr class="hrv-metrics-row">
                <td>DFA alpha 1</td>
                <td>{{ roundTo(loadedMetrics.dfa_alpha1, 2) }}</td>
              </tr>
              <tr>
                <th colspan="2">Jump Histogram</th>
              </tr>
              <tr>
                <td>100 - 200ms</td>
                <td>{{ formatMetricValue(loadedMetrics.jump_count_100ms_200ms) }}</td>
              </tr>
              <tr>
                <td>200 - 300ms</td>
                <td>{{ formatMetricValue(loadedMetrics.jump_count_200ms_300ms) }}</td>
              </tr>
              <tr>
                <td>300 - 400ms</td>
                <td>{{ formatMetricValue(loadedMetrics.jump_count_300ms_400ms) }}</td>
              </tr>
              <tr>
                <td>400 - 500ms</td>
                <td>{{ formatMetricValue(loadedMetrics.jump_count_400ms_500ms) }}</td>
              </tr>
              <tr>
                <td>500 - 600ms</td>
                <td>{{ formatMetricValue(loadedMetrics.jump_count_500ms_600ms) }}</td>
              </tr>
              <tr>
                <td>600 - 700ms</td>
                <td>{{ formatMetricValue(loadedMetrics.jump_count_600ms_700ms) }}</td>
              </tr>
              <tr>
                <td>700 - 800ms</td>
                <td>{{ formatMetricValue(loadedMetrics.jump_count_700ms_800ms) }}</td>
              </tr>
              <tr>
                <td>800 - 900ms</td>
                <td>{{ formatMetricValue(loadedMetrics.jump_count_800ms_900ms) }}</td>
              </tr>
              <tr>
                <td>900 - 1000ms</td>
                <td>{{ formatMetricValue(loadedMetrics.jump_count_900ms_1000ms) }}</td>
              </tr>
              <tr>
                <td>1000ms+</td>
                <td>{{ formatMetricValue(loadedMetrics.jump_count_1000ms) }}</td>
              </tr>
            </table>
          </div>

          <div class="sleep-metrics" v-if="relatedSleepLog">
            <table class="hrv-metrics-table">
              <tr>
                <th colspan="2">Connected Sleep Data</th>
              </tr>
              <tr>
                <td>Bed Time</td>
                <td>{{ relatedSleepLog.bedTime ? formatTime(relatedSleepLog.bedTime) : "" }}</td>
              </tr>
              <tr>
                <td>Wake Time</td>
                <td>{{ relatedSleepLog.wakeTime ? formatTime(relatedSleepLog.wakeTime) : "" }}</td>
              </tr>
              <tr v-if="relatedSleepLog.sleepLatencyMinutes != null">
                <td>Sleep Latency</td>
                <td>{{ relatedSleepLog.sleepLatencyMinutes }} m</td>
              </tr>
              <tr>
                <td>Total Sleep (m)</td>
                <td>{{ relatedSleepLog.totalSleepMinutes }}</td>
              </tr>
              <tr>
                <td>Awake Minutes</td>
                <td>{{ relatedSleepLog.awakeMinutes }}</td>
              </tr>
              <tr>
                <td>Light Sleep</td>
                <td>{{ relatedSleepLog.lightSleepMinutes }}</td>
              </tr>
              <tr>
                <td>Deep Sleep</td>
                <td>{{ relatedSleepLog.deepSleepMinutes }}</td>
              </tr>
              <tr>
                <td>REM Sleep</td>
                <td>{{ relatedSleepLog.remSleepMinutes }}</td>
              </tr>
              <tr>
                <td>Rested Score</td>
                <td>{{ relatedSleepLog.restedScore }}</td>
              </tr>
              <tr>
                <td>Morning Headache</td>
                <td>{{ relatedSleepLog.morningHeadache ? "Yes" : "No" }}</td>
              </tr>
              <tr>
                <td>Morning Dizziness</td>
                <td>{{ relatedSleepLog.morningDizziness ? "Yes" : "No" }}</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="artifacts"></div>
        <div class="jump-histogram">
          <table></table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import HrvService from "@/services/hrv/hrv.service.ts";
import { formatTime } from "@/utility/date";
import { useRoute } from "vue-router";
import { roundTo as roundMetric } from "@/utility/math.ts";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import axios from "axios";
import type { SleepLog } from "@/types/sleepType.ts";
import type { HrvMetric, HrvRecording } from "@/types/hrvType.ts";
import { buildHrvFilterParam, parseRrIntervals, type HrvFilterToken } from "@/utility/hrv.ts";

Chart.defaults.color = "#e0e0e0";
Chart.defaults.borderColor = "rgba(255, 255, 255, 0.1)";
Chart.register(zoomPlugin);

const route = useRoute();

const hrvRecording = ref<HrvRecording | null>(null);
const loadedMetrics = ref<HrvMetric>({});
const rrdata = ref<number[]>([]);
const rrTimes = ref<number[]>([]);

const relatedSleepLog = ref<SleepLog | null>(null);

const recordingId = route.params.id as string;

const isLoading = ref(false);
const loadError = ref("");

const filters = reactive({
  range: true,
  movingAverage: true,
  artifact: true,
});

function roundTo(value: HrvMetric[keyof HrvMetric], digits = 2): string {
  return typeof value === "number" && Number.isFinite(value) ? String(roundMetric(value, digits)) : "—";
}

function formatMetricValue(value: HrvMetric[keyof HrvMetric]): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.trim()) return value;
  return "—";
}

let rrChartInst: Chart | null = null;
let hrChartInst: Chart | null = null;
let hrvChartInst: Chart | null = null;

const syncZoom = ({ chart }: { chart: Chart }) => {
  const min = chart.scales.x?.min;
  const max = chart.scales.x?.max;

  const charts = [rrChartInst, hrChartInst, hrvChartInst];
  charts.forEach((c) => {
    if (c && c !== chart) {
      if (c.options.scales && c.options.scales.x) {
        c.options.scales.x.min = min;
        c.options.scales.x.max = max;
        c.update("none");
      }
    }
  });
};

const formatChartTime = (seconds: number): string => {
  const startDateTime = hrvRecording.value?.startDateTime;
  if (!startDateTime || !Number.isFinite(seconds)) return "";

  const absoluteTime = new Date(new Date(startDateTime).getTime() + seconds * 1000);
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(absoluteTime);
};

const createChart = (
  canvasId: string,
  label: string,
  dataInstant: number[],
  dataSmoothed: number[],
  instantColor: string,
  smoothedColor: string,
  existingChart: Chart | null,
  times: number[],
) => {
  if (existingChart) {
    existingChart.destroy();
  }
  return new Chart(document.getElementById(canvasId) as HTMLCanvasElement, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          label: label + " (Instant)",
          data: dataInstant,
          borderColor: instantColor,
          borderWidth: 1,
          pointRadius: 0,
          tension: 0.1,
          order: 2,
        },
        {
          label: label + " (Smoothed)",
          data: dataSmoothed,
          borderColor: smoothedColor,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          order: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "linear",
          title: { display: true, text: "Clock time" },
          max: times.length > 0 ? times[times.length - 1] : 0,
          ticks: {
            includeBounds: false,
            callback: (tickValue) => formatChartTime(Number(tickValue)),
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: (items) => {
              const seconds = Number(items[0]?.parsed.x ?? items[0]?.label);
              const clockTime = formatChartTime(seconds);
              return clockTime ? `Clock time: ${clockTime}` : "Clock time unavailable";
            },
          },
        },
        zoom: {
          zoom: {
            drag: {
              enabled: true,
            },
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "x",
            onZoom: syncZoom,
            onZoomComplete: syncZoom,
          },
          pan: {
            enabled: true,
            mode: "x",
            modifierKey: "alt",
          },
        },
      },
      animation: false,
    },
  });
};

const loadData = async (filterString: string) => {
  isLoading.value = true;
  loadedMetrics.value = {};
  try {
    const rawRrStr = await HrvService.getHrvData(recordingId, filterString !== "none" ? filterString : undefined);
    const rawRr = parseRrIntervals(rawRrStr);
    rrdata.value = rawRr;

    const times: number[] = [];
    let currentTime = 0;
    for (let i = 0; i < rawRr.length; i++) {
      currentTime += rawRr[i] / 1000;
      times.push(currentTime);
    }
    rrTimes.value = times;

    const bpmData = rawRr.map((rr: number) => 60000 / rr);

    const hrvData = [0];
    for (let i = 1; i < rawRr.length; i++) {
      hrvData.push(Math.abs(rawRr[i] - rawRr[i - 1]));
    }

    const smooth = (data: number[], windowSize: number = 20) => {
      return data.map((_, idx, arr) => {
        const start = Math.max(0, idx - windowSize + 1);
        const windowSlice = arr.slice(start, idx + 1);
        return windowSlice.reduce((sum, val) => sum + val, 0) / windowSlice.length;
      });
    };

    const smoothedRr = smooth(rawRr);
    const smoothedBpm = smooth(bpmData);
    const smoothedHrv = smooth(hrvData);

    rrChartInst = createChart("rr-graph-canvas", "RR Interval (ms)", rawRr, smoothedRr, "rgba(54, 162, 235, 0.5)", "#1d4ed8", rrChartInst, times);
    hrChartInst = createChart("hr-graph-canvas", "Heart Rate (bpm)", bpmData, smoothedBpm, "rgba(255, 99, 132, 0.5)", "#b91c1c", hrChartInst, times);
    hrvChartInst = createChart(
      "hrv-graph-canvas",
      "HRV - Successive Diff (ms)",
      hrvData,
      smoothedHrv,
      "rgba(255, 159, 64, 0.5)",
      "#c2410c",
      hrvChartInst,
      times,
    );

    if (filterString !== "none") {
      loadedMetrics.value = await HrvService.getHrvMetrics(recordingId, filterString);
    } else {
      // fallback for no filters if already loaded in recording
      for (const metric of hrvRecording.value?.metrics || []) {
        if (
          !metric.adaptiveFilteringApplied &&
          !metric.rangeFilteringApplied &&
          !metric.artifactFilteringApplied &&
          !metric.movingAverageFilteringApplied
        ) {
          loadedMetrics.value = metric;
          break;
        }
      }
    }
  } catch (e) {
    loadError.value = axios.isAxiosError(e) && e.response?.status === 404
      ? "This HRV recording no longer exists."
      : "HRV recording data could not be loaded.";
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const applyFilters = async () => {
  const activeFilters: HrvFilterToken[] = [];
  if (filters.range) activeFilters.push("range");
  if (filters.movingAverage) activeFilters.push("movingAverage");
  if (filters.artifact) activeFilters.push("artifact");

  const filterString = activeFilters.length === 3 ? "standard" : buildHrvFilterParam(activeFilters);
  await loadData(filterString);
};

const resetZoom = () => {
  rrChartInst?.resetZoom();
  hrChartInst?.resetZoom();
  hrvChartInst?.resetZoom();
};

const copyVisibleRR = async () => {
  if (!rrChartInst) return;

  const minTime = rrChartInst.scales.x?.min ?? 0;
  const maxTime = rrChartInst.scales.x?.max ?? rrTimes.value[rrTimes.value.length - 1];

  const visibleRRs = [];
  for (let i = 0; i < rrTimes.value.length; i++) {
    if (rrTimes.value[i] >= minTime && rrTimes.value[i] <= maxTime) {
      visibleRRs.push(rrdata.value[i]);
    }
  }

  try {
    await navigator.clipboard.writeText(visibleRRs.join("\n"));
    alert(`Copied ${visibleRRs.length} RR intervals to clipboard!`);
  } catch (err) {
    console.error("Failed to copy visible RR intervals: ", err);
  }
};

onMounted(async () => {
  try {
    hrvRecording.value = await HrvService.getHrvRecording(recordingId);
    relatedSleepLog.value = hrvRecording.value?.sleepLog || null;
  } catch (e) {
    loadError.value = axios.isAxiosError(e) && e.response?.status === 404
      ? "This HRV recording no longer exists."
      : "HRV recording details could not be loaded.";
    console.error(e);
    return;
  }
  await applyFilters();
});
</script>

<style scoped>
.second-metrics-row {
}

.apply-btn {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: var(--primary);
  color: var(--bg-main);
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
.apply-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.loading-spinner {
  margin-left: 15px;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s ease-in-out infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

table {
  border-collapse: collapse;
  border: 1px solid #ddd;
}

table tr {
  border: 1px solid #ddd;
}

table th {
  color: var(--bg-main);
  background-color: var(--primary);
}

table,
td {
  padding: 5px 10px;
  border: 1px solid #ddd;
}

.filter-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.windows-link {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-left: auto;
  padding: 7px 10px;
  color: var(--text-main);
  text-decoration: none;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition:
    border-color 0.18s,
    background-color 0.18s;
}

.windows-link:hover {
  background: var(--bg-main);
  border-color: var(--primary);
}

.windows-link svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: var(--primary);
  stroke-width: 1.6;
}

.windows-link span:not(.windows-link-arrow) {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.windows-link strong {
  font-size: 0.82rem;
}

.windows-link small {
  margin-top: 3px;
  color: var(--text-secondary);
  font-size: 0.68rem;
}

.windows-link-arrow {
  color: var(--text-secondary);
}

@media (max-width: 900px) {
  .windows-link {
    margin-left: 0;
  }
}

.control-panel {
  width: 100%;
  padding: 10px;
  background: var(--bg-surface);
  display: flex;
  align-items: center;
  user-select: none;
  margin-bottom: 20px;
  box-sizing: border-box;
}

.hrv-details-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

.hrv-content {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  gap: 20px;
  box-sizing: border-box;
  padding: 0 10px;
}

.hrv-metrics-display {
  background-color: var(--bg-surface);
  flex: 1 1 300px;
  min-width: 300px;
  max-width: 100%;
  border-radius: 8px;
  padding: 15px;
  box-sizing: border-box;
}

.hrv-metrics-display div {
  margin-bottom: 10px;
}

.hrv-graphs {
  display: flex;
  flex-direction: column;
  flex: 2 1 600px;
  min-width: 300px;
  max-width: 100%;
  gap: 15px;
}

.graph {
  background-color: var(--bg-surface);
  border-radius: 8px;
  height: 300px;
  width: 100%;
  position: relative;
}
</style>
