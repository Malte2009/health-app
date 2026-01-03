<template>
  <div class="chart-container" :style="{ width: width + legendOffset + 'px', height: height + 'px' }">
    <div class="chart" :style="{ width: width + 'px', height: height - legendOffset + 'px' }">
      <svg :width="width" :height="height - legendOffset">
        <polyline
          :points="xDataNumbers.map((x, i) => x + ',' + (height - legendOffset - yScaledData[i])).join(' ')"
          fill="none"
          stroke="var(--primary)"
          stroke-width="2"
        />
      </svg>
    </div>
    <div class="x-divider" :style="{ width: width + 2 + 'px', marginTop: height - legendOffset + 'px' }"></div>
    <div class="y-divider" :style="{ height: height - legendOffset + 2 + 'px', marginRight: width + 'px' }"></div>
    <div id="makers-labels" :style="{ marginRight: width + 'px' }"></div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUpdate, onMounted, onUpdated, ref } from "vue";
import { roundTo } from "@/utility/math.ts";

const xScaledData = ref([] as number[]);
const xDataNumbers = ref([] as number[]);
const yScaledData = ref([] as number[]);
const yDataNumbers = ref([] as number[]);

const legendOffset = 50; // Px = value - 10
const paddingOffset = 10; // Px

const props = defineProps<{
  chartData: {
    xData: number[];
    yData: number[];
  };
  chartUnits?: {
    xUnit?: string;
    yUnit?: string;
  };
  width: number;
  height: number;
}>();

function scaleData(data: number[], maxValue: number): number[] {
  const factor = maxValue / Math.max(...data);
  return data.map((value) => Math.round(value * factor));
}

function generateXDataNumbers(length: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < length; i++) {
    result.push(i);
  }
  return result;
}

function generateYDataNumbers(maxValue: number, steps: number): number[] {
  const result: number[] = [];
  const stepValue = maxValue / steps;
  for (let i = 0; i <= steps; i++) {
    result.push(roundTo(i * stepValue, 2) || 0);
  }
  return result;
}

function displayLegend() {
  // Clear existing marks
  document.getElementById("makers-labels")!.innerHTML = "";

  const length = xScaledData.value.length;
  const chartWidth = props.width
  const chartHeight = props.height - legendOffset;

  const marginTop = props.height - legendOffset;

  for (let i = 0; i < length; i++) {
    if (i === 0) continue;

    const xPos = (i / (length - 1)) * chartWidth;

    // Generate label
    const xValue = props.chartData.xData[i];

    const xValueLabel = document.createElement("div");

    xValueLabel.className = "x-axis-label";
    xValueLabel.style.marginTop = marginTop + 10 + "px";
    xValueLabel.style.marginLeft = xPos + "px";

    xValueLabel.innerText = xValue.toString();

    document.getElementById("makers-labels")?.appendChild(xValueLabel);

    xValueLabel.style.marginLeft = xPos - xValueLabel.offsetWidth / 2 + "px";

    // Generate X-axis mark
    const xMark = document.createElement("div");

    xMark.className = "x-axis-mark";

    xMark.style.marginTop = marginTop - 3.5 + "px";
    xMark.style.marginLeft = xPos + "px";

    document.getElementById("makers-labels")?.appendChild(xMark);

/*    // Generate Y-axis marks

    const yMark = document.createElement("div");

    yMark.className = "y-axis-mark";

    yMark.style.marginTop = (yScaledData.value[i] + chartHeight) - (yScaledData.value[i] * 2) - 1 + "px";
    yMark.style.marginLeft = -5.5 + "px";

    document.getElementById("makers-labels")?.appendChild(yMark);

    // Generate Y-axis labels

    const yValue = props.chartData.yData[i];

    const yValueLabel = document.createElement("div");

    yValueLabel.className = "y-axis-label";

    yValueLabel.style.marginTop = (yScaledData.value[i] + chartHeight) - (yScaledData.value[i] * 2) - 7 + "px";

    yValueLabel.style.marginLeft = -15 - yValueLabel.offsetWidth + "px";

    yValueLabel.innerText = yValue.toString();

    document.getElementById("makers-labels")?.appendChild(yValueLabel);*/
  }

  const yLength = yDataNumbers.value.length;

  for (let i = 0; i < yLength; i++) {

    if (i === 0) continue;

    const yPos = chartHeight - (i / (yLength - 1)) * chartHeight;

    // Generate Y-axis labels
    const yValue = yDataNumbers.value[i];

    const labelLength = yValue.toString().length;

    const yValueLabel = document.createElement("div");

    yValueLabel.className = "y-axis-label";

    yValueLabel.style.marginTop = yPos - 7 + "px";

    yValueLabel.style.marginLeft = -(labelLength * 5 + 10) - yValueLabel.offsetWidth + "px";

    yValueLabel.innerText = yValue.toString();

    document.getElementById("makers-labels")?.appendChild(yValueLabel);

    // Generate Y-axis marks

    const yMark = document.createElement("div");

    yMark.className = "y-axis-mark";

    yMark.style.marginTop = yPos - 1 + "px";
    yMark.style.marginLeft = -5.5 + "px";

    document.getElementById("makers-labels")?.appendChild(yMark);
  }
}

function beforeHook() {
  xScaledData.value = props.chartData.xData;
  yScaledData.value = props.chartData.yData;

  if (!xScaledData.value || !yScaledData.value) {
    console.error("Invalid chart data provided.");
  }

  if (xScaledData.value.length !== yScaledData.value.length) {
    console.error("xData and yData must have the same length.");
  }

  xScaledData.value = scaleData(xScaledData.value, props.width);
  yScaledData.value = scaleData(yScaledData.value, props.height - legendOffset);
  xDataNumbers.value = scaleData(generateXDataNumbers(yScaledData.value.length), props.width);
  yDataNumbers.value = generateYDataNumbers(Math.max(...props.chartData.yData), 10);
}

onBeforeMount(() => {
  beforeHook();
});

onBeforeUpdate(() => {
  beforeHook();
});

onMounted(() => {
  displayLegend();
});

onUpdated(() => {
  displayLegend();
});
</script>
<style scoped>

.chart-container {
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: var(--bg-surface);
  margin-top: 20px;
  display: flex;
  justify-content: right;
  align-items: flex-start;
}

:deep(.x-axis-mark) {
  position: absolute;
  height: 9px;
  width: 2px;
  background-color: black;
}

:deep(.y-axis-mark) {
  position: absolute;
  width: 9px;
  height: 2px;
  background-color: black;
}

:deep(.x-axis-label) {
  position: absolute;
  font-size: 0.75rem;
  color: var(--text-secondary);
  width: fit-content;
  height: fit-content;
  text-align: center;
}

:deep(.y-axis-label) {
  position: absolute;
  font-size: 0.75rem;
  color: var(--text-secondary);
  width: max-content;
  height: fit-content;
  text-align: center;
}

#makers-labels {
  position: absolute;
  height: 20px;
  width: fit-content;
}

.x-divider {
  height: 2px;
  background-color: black;
  position: absolute;
}

.y-divider {
  width: 2px;
  background-color: black;
  position: absolute;
}

</style>
