<template>
  <div>
    <div class="progression-container">
      <h1>Progression</h1>
      <div class="exercise-selector">
        <select v-model="exerciseId" id="exercise-selector" @change="updateChartData()">
          <option v-for="exercise in exerciseStore.getExercises" :key="exercise.id" :value="exercise.id">{{ exercise.name }}</option>
        </select>
        <button class="copy-progress-button" :disabled="!exerciseId || isCopyingProgress" @click="copyProgressToClipboard">
          {{ isCopyingProgress ? "Copying..." : "Copy Progress" }}
        </button>
      </div>
      <p v-if="copyProgressMessage" class="copy-progress-message">{{ copyProgressMessage }}</p>
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
import type { Exercise } from "@/types/exerciseType.ts";
import type { WorkoutExercise } from "@/types/workout/workoutExercise.type.ts";
import { Chart, TimeScale, LinearScale, PointElement, LineElement, LineController, Title, Tooltip, Legend } from "chart.js";
import "chartjs-adapter-date-fns";

Chart.register(TimeScale, LinearScale, PointElement, LineElement, LineController, Title, Tooltip, Legend);

const exerciseStore = useExerciseStore();

const exerciseId = ref("");
const isCopyingProgress = ref(false);
const copyProgressMessage = ref("");
type ProgressionPoint = { x: Date; y: number };
type ExerciseWithProgress = Exercise & { workoutExercises?: WorkoutExercise[] };

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

function getProgressExportText(exercise: ExerciseWithProgress): string {
  const workoutExercises = [...(exercise.workoutExercises ?? [])].sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const rows = workoutExercises
    .map((workoutExercise) => ({
      date: new Date(workoutExercise.createdAt).toISOString().slice(0, 10),
      sets: [...(workoutExercise.workoutSets ?? [])].sort((a, b) => a.order - b.order),
    }))
    .filter((entry) => entry.sets.length > 0)
    .map((entry) => {
      const { date, sets } = entry;
      const cells = sets.map((set) => `${set.weight}:${set.reps} (${set.repUnit})`);
      return [date, exercise.name, ...cells];
    });

  if (rows.length === 0) return "";

  const maxSetCount = Math.max(...rows.map((row) => row.length - 2));
  const header = ["Date", "ExerciseName", ...Array.from({ length: maxSetCount }, (_, index) => `Weight ${index + 1}:reps (RepUnit)`)];

  return [header, ...rows]
    .map((row) => row.join(", "))
    .join("\n");
}

async function writeToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  const successful = document.execCommand("copy");
  textArea.remove();
  return successful;
}

async function copyProgressToClipboard() {
  if (!exerciseId.value) return;

  isCopyingProgress.value = true;
  copyProgressMessage.value = "";

  try {
    const exercise = await ExerciseService.getExerciseById(exerciseId.value, true) as ExerciseWithProgress | void;
    if (!exercise) {
      copyProgressMessage.value = "Could not load exercise progress.";
      return;
    }

    const text = getProgressExportText(exercise);
    if (!text) {
      copyProgressMessage.value = "No sets found for this exercise.";
      return;
    }

    if (await writeToClipboard(text)) {
      copyProgressMessage.value = "Progress copied to clipboard.";
    } else {
      copyProgressMessage.value = "Failed to copy progress.";
    }
  } catch (error) {
    console.error("Failed to copy progression:", error);
    copyProgressMessage.value = "Failed to copy progress.";
  } finally {
    isCopyingProgress.value = false;
  }
}

onMounted(async () => {
  exerciseStore.setExercises(await ExerciseService.getAllExercises());

  if (exerciseStore.getExercises.length > 0) {
    exerciseId.value = exerciseStore.getExercises[0].id;
    await updateChartData();
  }
});
</script>

<style scoped>
.exercise-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

#exercise-selector {
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border);
  color: var(--text-main);
  border-radius: 6px;
  padding: 8px 10px;
  outline: none;
}

.copy-progress-button {
  background: var(--primary);
  border: none;
  border-radius: 6px;
  color: var(--bg-main);
  cursor: pointer;
  padding: 8px 12px;
  transition: opacity 0.15s, transform 0.15s;
}

.copy-progress-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.copy-progress-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.copy-progress-message {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 8px 0 0;
}
</style>
