<template>
  <div class="edit-workout">
    <h1 class="heading">Edit Workout</h1>

    <div class="inputs">
      <form id="workoutForm" @submit.prevent="submit">
        <select @change="checkInput()" id="workoutNameSelect" name="workoutName" @keydown.enter.prevent="changeFocus('workoutDate')">
          <option value="" disabled selected>Select Workout Name</option>
          <option v-for="name in workoutNames" :key="name" :value="name">{{ name }}</option>
          <option value="Custom">Custom</option>
        </select>
        <input
          v-if="showCustomInput"
          placeholder="Workout Name"
          id="workoutName"
          name="workoutName"
          type="text"
          @keydown.enter.prevent="changeFocus('workoutType')"
        />
        <select id="workoutType" name="workoutType" @keydown.enter.prevent="changeFocus('averageHeartRate')">
          <option value="" disabled selected>Select Workout Type</option>
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
          @keydown.enter.prevent="changeFocus('workoutDuration')"
        />
        <input
          placeholder="Workout Duration (minutes)"
          id="workoutDuration"
          name="workoutDuration"
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
import WorkoutService from "@/services/workout/workout.service";
import { useWorkoutStore } from "@/stores/workoutStore.ts";
import { onMounted, ref } from "vue";
import { useTypeStore } from "@/stores/type.ts";
import { getUserAge, isAuthenticated } from "@/services/authService.ts";
import type { updateWorkoutType } from "@/types/workout/workout.type.ts";

const workoutStore = useWorkoutStore();
const typeStore = useTypeStore();
const router = useRouter();
const route = useRoute();

const HFmax = ref(0);

const workoutNames = ref<string[]>([]);
const showCustomInput = ref(false);

const workoutId = route.params.id as string;

function loadValues() {
  const workoutNameSelect = document.getElementById("workoutNameSelect") as HTMLSelectElement;
  const workoutNameInput = document.getElementById("workoutName") as HTMLInputElement;
  const workoutType = document.getElementById("workoutType") as HTMLSelectElement;
  const averageHeartRateInput = document.getElementById("averageHeartRate") as HTMLInputElement;
  const workoutDurationInput = document.getElementById("workoutDuration") as HTMLInputElement;
  const notesInput = document.getElementById("notes") as HTMLInputElement;
  const pausesInput = document.getElementById("pauses") as HTMLInputElement;
  const pauseLengthInput = document.getElementById("pauseLength") as HTMLInputElement;

  const workout = workoutStore.getWorkoutById(workoutId);

  if (workout) {
    if (showCustomInput.value) {
      workoutNameInput.value = workout.type || "";
    } else {
      workoutNameSelect.value = workout.type || "";
    }

    console.log("Workout:", workout);

    workoutNameSelect.value = workout.name;
    workoutType.value = workout.type || "";
    averageHeartRateInput.value = workout?.avgHeartRate?.toString() || "";
    workoutDurationInput.value = workout?.duration?.toString() || "";
    notesInput.value = workout.notes || "";
    pausesInput.value = workout.pauses?.toString() || "";
    pauseLengthInput.value = workout.pauseLength?.toString() || "";
  }
}

function checkInput() {
  const input = document.getElementById("workoutNameSelect") as HTMLSelectElement;

  showCustomInput.value = input.value === "Custom";
}

function optionalInteger(value: string): number | undefined {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

async function submit() {
  let workoutName = (document.getElementById("workoutNameSelect") as HTMLInputElement).value;
  const workoutType = (document.getElementById("workoutType") as HTMLInputElement).value;
  const workoutDuration = (document.getElementById("workoutDuration") as HTMLInputElement).value;
  const averageHeartRate = (document.getElementById("averageHeartRate") as HTMLInputElement).value;
  const pauses = optionalInteger((document.getElementById("pauses") as HTMLInputElement).value);
  const pauseLength = optionalInteger((document.getElementById("pauseLength") as HTMLInputElement).value);

  if (showCustomInput.value) {
    workoutName = (document.getElementById("workoutName") as HTMLInputElement).value;
  }

  const currentWorkout = workoutStore.getWorkoutById(workoutId);

  if (!currentWorkout) {
    console.error("Workout not found");
    return;
  }

  const workoutData: updateWorkoutType = {
    name: workoutName,
    type: workoutType || undefined,
    duration: optionalInteger(workoutDuration),
    avgHeartRate: optionalInteger(averageHeartRate),
    notes: (document.getElementById("notes") as HTMLInputElement).value || undefined,
    ...(pauses !== undefined ? { pauses } : {}),
    ...(pauseLength !== undefined ? { pauseLength } : {}),
  };

  if (!workoutData.name) {
    const workoutNameInput = showCustomInput.value
      ? (document.getElementById("workoutName") as HTMLInputElement)
      : (document.getElementById("workoutNameSelect") as HTMLInputElement);
    workoutNameInput.style.borderColor = "var(--danger)";

    workoutNameInput.addEventListener("keydown", () => {
      workoutNameInput.style.borderColor = "var(--border)";
    });

    return;
  }

  if (!workoutData.type) {
    const workoutTypeInput = document.getElementById("workoutType") as HTMLInputElement;
    workoutTypeInput.style.borderColor = "var(--danger)";

    workoutTypeInput.addEventListener("focus", () => {
      workoutTypeInput.style.borderColor = "var(--border)";
    });

    return;
  }

  try {
    const updatedWorkout = await WorkoutService.updateWorkout(workoutId, workoutData);
    if (updatedWorkout) {
      workoutStore.changeWorkout(workoutId, updatedWorkout);
    }
  } catch (error) {
    console.error("Failed to update workout:", error);
    return;
  }

  workoutStore.setCurrentWorkout(workoutId);

  const workouts = await WorkoutService.getWorkouts(false, false);

  workoutStore.setWorkouts(workouts);

  await router.push({ name: "workoutDetails", params: { id: workoutId } });
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
    workoutNames.value = typeStore.getWorkoutNames;
  } catch (error) {
    console.error("Failed to fetch workout types:", error);
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
