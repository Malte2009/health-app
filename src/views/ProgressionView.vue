<template>
  <div>
    <div class="progression-container">
      <h1>Progression</h1>
      <div class="exercise-selector">
        <select v-model="exerciseId" id="exercise-selector" @change="updateChartData()">
          <option v-for="exercise in exerciseStore.getExercises" :key="exercise.id" :value="exercise.id">{{ exercise.name }}</option>
        </select>
      </div>
      <div class="progression-chart">
        <canvas id="progression-canvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import ProgressionService from "@/services/workout/progression.service.ts";
import { useExerciseStore } from "@/stores/exerciseStore.ts";
import ExerciseService from "@/services/workout/exercise.service.ts";
import { Chart, TimeScale, LinearScale, PointElement, LineElement, LineController, Title, Tooltip, Legend } from "chart.js";
import "chartjs-adapter-date-fns";

Chart.register(TimeScale, LinearScale, PointElement, LineElement, LineController, Title, Tooltip, Legend);

const exerciseStore = useExerciseStore();

const exerciseId = ref("");
type ProgressionPoint = { x: Date; y: number };

const chartData = ref<
  {
    createdAt: Date;
    score: number;
  }[]
>([]);

let progressionChart: Chart<"line", ProgressionPoint[], unknown> | null = null;

async function updateChartData() {
  chartData.value = [];
  const data = await ProgressionService.getProgression(exerciseId.value);

  for (const entry of data) {
    const date = new Date(entry.createdAt);
    // Convert UTC to local time by adjusting for the timezone offset
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));

    chartData.value.push({
      createdAt: localDate,
      score: entry.score,
    });
  }
  await createChart();
}

async function createChart() {
  if (progressionChart) progressionChart.destroy();

  const canvas = document.getElementById("progression-canvas") as HTMLCanvasElement;
  if (!canvas) return;

  progressionChart = new Chart<"line", ProgressionPoint[], unknown>(canvas, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Progression Score",
          data: chartData.value.map((d) => ({ x: d.createdAt, y: d.score })),
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1
        }
      ]
    },
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day'
          }
        }
      }
    }
  });
}

onMounted(async () => {
  exerciseStore.setExercises(await ExerciseService.getAllExercises());

  if (exerciseStore.getExercises.length > 0) {
    exerciseId.value = exerciseStore.getExercises[0].id;
    await updateChartData();
  }
});
</script>

<style scoped></style>
