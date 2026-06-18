<template>
  <div class="edit-training">
    <h1 class="heading">Edit Training</h1>

    <div class="inputs">
      <form id="trainingForm" @submit.prevent="submit">
        <select @change="checkInput()" id="trainingNameSelect" name="trainingsName" @keydown.enter.prevent="changeFocus('trainingDate')">
          <option value="" disabled selected>Select Training Name</option>
          <option v-for="name in trainingNames" :key="name" :value="name">{{ name }}</option>
          <option value="Custom">Custom</option>
        </select>
        <input
          v-if="showCustomInput"
          placeholder="Training Name"
          id="trainingName"
          name="trainingName"
          type="text"
          @keydown.enter.prevent="changeFocus('trainingType')"
        />
        <select id="trainingType" name="trainingType" @keydown.enter.prevent="changeFocus('averageHeartRate')">
          <option value="" disabled selected>Select Training Type</option>
          <option value="Weights">Weights</option>
          <option value="Cardio">Cardio</option>
        </select>
        <input
          placeholder="Average Heart Rate (30 - 220)"
          id="averageHeartRate"
          name="averageHeartRate"
          type="number"
          min="30"
          max="220"
          @keydown.enter.prevent="changeFocus('trainingDuration')"
        />
        <input
          placeholder="Training Duration (minutes)"
          id="trainingDuration"
          name="trainingDuration"
          type="number"
          min="1"
          max="600"
          @keydown.enter.prevent="changeFocus('pauses')"
        />
        <input placeholder="Pauses (optional)" id="pauses" name="pauses" type="text" @keydown.enter.prevent="changeFocus('pauseLength')" />
        <input placeholder="Pauses Length (optional)" id="pauseLength" name="pauseLength" type="text" @keydown.enter.prevent="changeFocus('notes')" />
        <input placeholder="Notes (optional)" id="notes" name="notes" type="text" @keydown.enter.prevent="changeFocus('submitButton')" />
        <button id="submitButton" value="Submit" class="btn" type="submit">Submit</button>
        <br />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import WorkoutService from "@/services/trainingService.ts";
import { useTrainingStore } from "@/stores/trainingStore.ts";
import { onMounted, ref } from "vue";
import { useTypeStore } from "@/stores/type.ts";
import { getUserAge, isAuthenticated } from "@/services/authService.ts";
import type { createWorkoutRequest } from "@/types/trainingType.ts";

const trainingStore = useTrainingStore();
const typeStore = useTypeStore();
const router = useRouter();
const route = useRoute();

const HFmax = ref(0);

const trainingNames = ref<string[]>([]);
const showCustomInput = ref(false);

const trainingsId = route.params.id as string;

function loadValues() {
  const trainingNameSelect = document.getElementById("trainingNameSelect") as HTMLSelectElement;
  const trainingNameInput = document.getElementById("trainingName") as HTMLInputElement;
  const trainingType = document.getElementById("trainingType") as HTMLSelectElement;
  const averageHeartRateInput = document.getElementById("averageHeartRate") as HTMLInputElement;
  const trainingDurationInput = document.getElementById("trainingDuration") as HTMLInputElement;
  const notesInput = document.getElementById("notes") as HTMLInputElement;
  const pausesInput = document.getElementById("pauses") as HTMLInputElement;
  const pauseLengthInput = document.getElementById("pauseLength") as HTMLInputElement;

  const training = trainingStore.getTrainingById(trainingsId);

  if (training) {
    if (showCustomInput.value) {
      trainingNameInput.value = training.type;
    } else {
      trainingNameSelect.value = training.type;
    }

    console.log("Training:", training);

    trainingNameSelect.value = training.name;
    trainingType.value = training.type || "";
    averageHeartRateInput.value = training?.avgHeartRate?.toString() || "";
    trainingDurationInput.value = training?.duration?.toString() || "";
    notesInput.value = training.notes || "";
    pausesInput.value = training.pauses?.toString() || "";
    pauseLengthInput.value = training.pauseLength?.toString() || "";
  }
}

function checkInput() {
  const input = document.getElementById("trainingNameSelect") as HTMLSelectElement;

  showCustomInput.value = input.value === "Custom";
}

function optionalInteger(value: string): number | undefined {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

async function submit() {
  let trainingName = (document.getElementById("trainingNameSelect") as HTMLInputElement).value;
  const trainingType = (document.getElementById("trainingType") as HTMLInputElement).value;
  const trainingDuration = (document.getElementById("trainingDuration") as HTMLInputElement).value;
  const averageHeartRate = (document.getElementById("averageHeartRate") as HTMLInputElement).value;
  const pauses = optionalInteger((document.getElementById("pauses") as HTMLInputElement).value);
  const pauseLength = optionalInteger((document.getElementById("pauseLength") as HTMLInputElement).value);

  if (showCustomInput.value) {
    trainingName = (document.getElementById("trainingName") as HTMLInputElement).value;
  }

  const newTraining = trainingStore.getTrainingById(trainingsId);

  if (!newTraining) {
    console.error("Training not found");
    return;
  }

  const workoutData: createWorkoutRequest = {
    name: trainingName,
    type: trainingType || undefined,
    duration: optionalInteger(trainingDuration),
    avgHeartRate: optionalInteger(averageHeartRate),
    notes: (document.getElementById("notes") as HTMLInputElement).value || undefined,
    ...(pauses !== undefined ? { pauses } : {}),
    ...(pauseLength !== undefined ? { pauseLength } : {}),
  };

  if (!workoutData.name) {
    const trainingNameInput = showCustomInput.value
      ? (document.getElementById("trainingName") as HTMLInputElement)
      : (document.getElementById("trainingNameSelect") as HTMLInputElement);
    trainingNameInput.style.borderColor = "var(--danger)";

    trainingNameInput.addEventListener("keydown", () => {
      trainingNameInput.style.borderColor = "var(--border)";
    });

    return;
  }

  if (!workoutData.type) {
    const trainingTypeInput = document.getElementById("trainingType") as HTMLInputElement;
    trainingTypeInput.style.borderColor = "var(--danger)";

    trainingTypeInput.addEventListener("focus", () => {
      trainingTypeInput.style.borderColor = "var(--border)";
    });

    return;
  }

  try {
    const updatedWorkout = await WorkoutService.updateWorkout(trainingsId, workoutData);
    if (updatedWorkout) {
      trainingStore.changeTraining(trainingsId, updatedWorkout);
    }
  } catch (error) {
    console.error("Failed to update training:", error);
    return;
  }

  trainingStore.setCurrentTraining(trainingsId);

  const trainings = await WorkoutService.getWorkouts();

  trainingStore.setTrainings(trainings);

  await router.push({ name: "trainingDetails", params: { id: trainingsId } });
}

function changeFocus(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.focus();
  }
}

onMounted(async () => {
  if (!(await isAuthenticated())) {
    await router.push({ name: "login" });
  }

  try {
    trainingNames.value = typeStore.getTrainingNames;
  } catch (error) {
    console.error("Failed to fetch training types:", error);
  }

  const userAge = await getUserAge();

  if (userAge) HFmax.value = 220 - userAge;

  loadValues();
});
</script>

<style scoped>
.heading {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
}
form {
  background-color: var(--bg-surface);
  padding: 20px;
  border-radius: 12px;
  max-width: fit-content;
  min-width: 20vw;
  margin: 20px auto;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  flex-direction: column;
}

form select {
  min-width: 275px !important;
}

form input,
form select,
form button {
  background-color: var(--bg-surface-secondary);
  color: var(--text-main);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

form input:focus,
form select:focus {
  border-color: var(--primary);
}

form input[type="date"],
form input[type="time"],
form input[type="number"],
form input[type="text"],
form select {
  min-width: 250px;
}

form button {
  background-color: var(--primary);
  color: var(--text-main);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

form button:hover {
  background-color: #00a495;
}
</style>
