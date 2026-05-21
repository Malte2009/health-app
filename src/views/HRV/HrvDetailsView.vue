<template>
  <div class="hrv-details-view">
    <div class="control-panel">
      <div class="filter-panel">
        <input id="adaptive-filter" type="checkbox" v-model="filters.adaptive" />
        <label for="adaptive-filter">Adaptive Filter</label>
        <input id="range-filter" type="checkbox" v-model="filters.range" />
        <label for="range-filter">Range Filter</label>
        <input id="moving-average-filter" type="checkbox" v-model="filters.movingAverage" />
        <label for="moving-average-filter">Moving Average Filter</label>
        <input id="artifact-filter" type="checkbox" v-model="filters.artifact" />
        <label for="artifact-filter">Artifact Filter</label>
        <button @click="applyFilters" :disabled="isLoading" class="apply-btn">
          {{ isLoading ? 'Loading...' : 'Apply Filters' }}
        </button>
        <button @click="resetZoom" class="apply-btn" style="background-color: var(--bg-surface-secondary); color: var(--text-main);">
          Reset Zoom
        </button>
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
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
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
                <td>{{ loadedMetrics.jump_count_100ms_200ms }}</td>
              </tr>
              <tr>
                <td>200 - 300ms</td>
                <td>{{ loadedMetrics.jump_count_200ms_300ms }}</td>
              </tr>
              <tr>
                <td>300 - 400ms</td>
                <td>{{ loadedMetrics.jump_count_300ms_400ms }}</td>
              </tr>
              <tr>
                <td>400 - 500ms</td>
                <td>{{ loadedMetrics.jump_count_400ms_500ms }}</td>
              </tr>
              <tr>
                <td>500 - 600ms</td>
                <td>{{ loadedMetrics.jump_count_500ms_600ms }}</td>
              </tr>
              <tr>
                <td>600 - 700ms</td>
                <td>{{ loadedMetrics.jump_count_600ms_700ms }}</td>
              </tr>
              <tr>
                <td>700 - 800ms</td>
                <td>{{ loadedMetrics.jump_count_700ms_800ms }}</td>
              </tr>
              <tr>
                <td>800 - 900ms</td>
                <td>{{ loadedMetrics.jump_count_800ms_900ms }}</td>
              </tr>
              <tr>
                <td>900 - 1000ms</td>
                <td>{{ loadedMetrics.jump_count_900ms_1000ms }}</td>
              </tr>
              <tr>
                <td>1000ms+</td>
                <td>{{ loadedMetrics.jump_count_1000ms }}</td>
              </tr>
            </table>
          </div>

          <div class="sleep-metrics" v-if="relatedSleepLog">
             <table class="hrv-metrics-table">
               <tr><th colspan="2">Connected Sleep Data</th></tr>
              <tr><td>Bed Time</td><td>{{ relatedSleepLog.bedTime ? formatTime(relatedSleepLog.bedTime) : '' }}</td></tr>
              <tr><td>Wake Time</td><td>{{ relatedSleepLog.wakeTime ? formatTime(relatedSleepLog.wakeTime) : '' }}</td></tr>
               <tr v-if="relatedSleepLog.sleepLatencyMinutes != null"><td>Sleep Latency</td><td>{{ relatedSleepLog.sleepLatencyMinutes }} m</td></tr>
               <tr><td>Total Sleep (m)</td><td>{{ relatedSleepLog.totalSleepMinutes }}</td></tr>
               <tr><td>Awake Minutes</td><td>{{ relatedSleepLog.awakeMinutes }}</td></tr>
               <tr><td>Light Sleep</td><td>{{ relatedSleepLog.lightSleepMinutes }}</td></tr>
               <tr><td>Deep Sleep</td><td>{{ relatedSleepLog.deepSleepMinutes }}</td></tr>
               <tr><td>REM Sleep</td><td>{{ relatedSleepLog.remSleepMinutes }}</td></tr>
               <tr><td>Rested Score</td><td>{{ relatedSleepLog.restedScore }}</td></tr>
               <tr><td>Morning Headache</td><td>{{ relatedSleepLog.morningHeadache ? 'Yes' : 'No' }}</td></tr>
               <tr><td>Morning Dizziness</td><td>{{ relatedSleepLog.morningDizziness ? 'Yes' : 'No' }}</td></tr>
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
import { getHrvData, getHrvRecording, getHrvMetrics } from "@/services/hrvService.ts";
import { toLocalTimeString, formatTime } from '@/utility/date';
import { useRoute } from "vue-router";
import { roundTo } from "@/utility/math.ts";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import type { SleepLog } from "@/types/sleepType.ts";

Chart.defaults.color = '#e0e0e0';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
Chart.register(zoomPlugin);

const route = useRoute();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hrvRecording = ref<any>({});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadedMetrics = ref<any>({});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rrdata = ref<any>([]);

const relatedSleepLog = ref<SleepLog | null>(null);

const recordingId = route.params.id as string;

const isLoading = ref(false);

const filters = reactive({
  adaptive: false,
  range: true,
  movingAverage: true,
  artifact: true,
});

let rrChartInst: Chart | null = null;
let hrChartInst: Chart | null = null;
let hrvChartInst: Chart | null = null;

const syncZoom = ({ chart }: { chart: Chart }) => {
  const min = chart.scales.x?.min;
  const max = chart.scales.x?.max;

  const charts = [rrChartInst, hrChartInst, hrvChartInst];
  charts.forEach(c => {
    if (c && c !== chart) {
      if (c.options.scales && c.options.scales.x) {
        c.options.scales.x.min = min;
        c.options.scales.x.max = max;
        c.update('none');
      }
    }
  });
};

const createChart = (canvasId: string, label: string, dataInstant: number[], dataSmoothed: number[], instantColor: string, smoothedColor: string, existingChart: Chart | null, times: number[]) => {
  if (existingChart) {
    existingChart.destroy();
  }
  return new Chart(document.getElementById(canvasId) as HTMLCanvasElement, {
    type: 'line',
    data: {
      labels: times,
      datasets: [
        {
          label: label + ' (Instant)',
          data: dataInstant,
          borderColor: instantColor,
          borderWidth: 1,
          pointRadius: 0,
          tension: 0.1,
          order: 2
        },
        {
          label: label + ' (Smoothed)',
          data: dataSmoothed,
          borderColor: smoothedColor,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          order: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'linear',
          title: { display: true, text: 'Time (s)' },
          max: times.length > 0 ? times[times.length - 1] : 0,
          ticks: {
            includeBounds: false
          }
        }
      },
      plugins: {
        zoom: {
          zoom: {
            drag: {
              enabled: true,
            },
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true
            },
            mode: 'x',
            onZoom: syncZoom,
            onZoomComplete: syncZoom
          },
          pan: {
            enabled: true,
            mode: 'x',
            modifierKey: 'alt',
          }
        }
      },
      animation: false
    }
  });
};

const loadData = async (filterString: string) => {
  isLoading.value = true;
  loadedMetrics.value = {};
  try {
    const rawRrStr = await getHrvData(recordingId, filterString !== 'none' ? filterString : undefined);
    const rawRr = rawRrStr.split("\n").filter((x: string) => x).map((x: string) => Number(x));
    rrdata.value = rawRr;

    const times: number[] = [];
    let currentTime = 0;
    for (let i = 0; i < rawRr.length; i++) {
      currentTime += rawRr[i] / 1000;
      times.push(currentTime);
    }

    const bpmData = rawRr.map((rr: number) => 60000 / rr);

    const hrvData = [0];
    for (let i = 1; i < rawRr.length; i++) {
      hrvData.push(Math.abs(rawRr[i] - rawRr[i-1]));
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

    rrChartInst = createChart('rr-graph-canvas', 'RR Interval (ms)', rawRr, smoothedRr, 'rgba(54, 162, 235, 0.5)', '#1d4ed8', rrChartInst, times);
    hrChartInst = createChart('hr-graph-canvas', 'Heart Rate (bpm)', bpmData, smoothedBpm, 'rgba(255, 99, 132, 0.5)', '#b91c1c', hrChartInst, times);
    hrvChartInst = createChart('hrv-graph-canvas', 'HRV - Successive Diff (ms)', hrvData, smoothedHrv, 'rgba(255, 159, 64, 0.5)', '#c2410c', hrvChartInst, times);

    if (filterString !== 'none') {
       loadedMetrics.value = await getHrvMetrics(recordingId, filterString);
    } else {
       // fallback for no filters if already loaded in recording
       for (const metric of hrvRecording.value.metrics || []) {
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
  } catch(e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const applyFilters = async () => {
  const activeFilters = [];
  if (filters.adaptive) activeFilters.push('adaptive');
  if (filters.range) activeFilters.push('range');
  if (filters.movingAverage) activeFilters.push('movingAverage');
  if (filters.artifact) activeFilters.push('artifact');

  const filterString = activeFilters.length > 0 ? activeFilters.join(',') : 'none';
  await loadData(filterString);
};

const resetZoom = () => {
  rrChartInst?.resetZoom();
  hrChartInst?.resetZoom();
  hrvChartInst?.resetZoom();
};

onMounted(async () => {
  try {
    hrvRecording.value = await getHrvRecording(recordingId);
    relatedSleepLog.value = hrvRecording.value?.sleepLog || null;
  } catch (e) {
    console.error(e);
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
  border: 3px solid rgba(0,0,0,0.1);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s ease-in-out infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
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
