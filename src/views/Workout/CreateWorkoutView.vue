<template>
  <div class="create-workout">
    <h1 class="heading">Create Workout</h1>

    <div class="inputs">
      <form id="workoutForm" @submit.prevent="submit">
        <select @change="checkInput()" id="workoutNameSelect" name="workoutName" @keydown.enter.prevent="changeFocus('workoutDate')">
          <option value="" disabled selected>Select Workout Name</option>
          <option v-for="name in typeStore.getWorkoutNames" :key="name" :value="name">{{ name }}</option>
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
          <option value="" disabled selected>Select Workout Mode</option>
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
import { useRouter } from "vue-router";
import type { createWorkoutType } from "@/types/workout/workout.type.ts";
import WorkoutService from "@/services/workout/workout.service";
import { useWorkoutStore } from "@/stores/workoutStore.ts";
import { onMounted, ref } from "vue";
import type { AxiosError } from "axios";
import { useTypeStore } from "@/stores/type.ts";
import AuthService from "@/services/auth/auth.service.ts";

const workoutStore = useWorkoutStore();
const typeStore = useTypeStore();
const router = useRouter();

const showCustomInput = ref(false);

const HFmax = ref(0);

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

  const workoutData: createWorkoutType = {
    name: workoutName,
    type: workoutType || undefined,
    duration: optionalInteger(workoutDuration),
    avgHeartRate: optionalInteger(averageHeartRate),
    ...(pauses !== undefined ? { pauses } : {}),
    ...(pauseLength !== undefined ? { pauseLength } : {}),
    notes: (document.getElementById("notes") as HTMLInputElement).value || undefined,
  };

  let workout;

  try {
    workout = await WorkoutService.createWorkout(workoutData);
  } catch (error) {
    handleError(error as AxiosError);
    return;
  }

  if (!workout) return;

  workoutStore.setCurrentWorkout(workout.id);

  await router.push({ name: "workoutDetails", params: { id: workout.id } });
}

function handleError(error: AxiosError) {
  if (error?.response?.data) {
    switch (error.response.data) {
      case "Workout type is required":
        let workoutTypeInput = document.getElementById("workoutTypeSelect") as HTMLInputElement;

        if (showCustomInput.value) workoutTypeInput = document.getElementById("workoutType") as HTMLInputElement;

        workoutTypeInput.style.borderColor = "var(--danger)";

        workoutTypeInput.addEventListener("keydown", () => {
          workoutTypeInput.style.borderColor = "var(--border)";
        });
        break;
      case "Invalid date format, use YYYY-MM-DD":
        const workoutDateInput = document.getElementById("workoutDate") as HTMLInputElement;

        workoutDateInput.style.borderColor = "var(--danger)";

        workoutDateInput.addEventListener("focus", () => {
          workoutDateInput.style.borderColor = "var(--border)";
        });
        break;
      case "Invalid heart rate (30-220)":
        const averageHeartRateInput = document.getElementById("averageHeartRate") as HTMLInputElement;

        averageHeartRateInput.style.borderColor = "var(--danger)";

        averageHeartRateInput.addEventListener("keydown", () => {
          averageHeartRateInput.style.borderColor = "var(--border)";
        });
        break;
      case "Invalid duration (1-600 minutes)":
        const workoutDurationInput = document.getElementById("workoutDuration") as HTMLInputElement;

        workoutDurationInput.style.borderColor = "var(--danger)";

        workoutDurationInput.addEventListener("keydown", () => {
          workoutDurationInput.style.borderColor = "var(--border)";
        });
        break;
    }
  }
}

function changeFocus(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.focus();
  }
}

onMounted(async () => {
  const userAge = await AuthService.getUserAge();

  if (userAge) HFmax.value = 220 - userAge;

  checkInput();
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
