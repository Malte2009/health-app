<template>
  <div class="createExerciseLogViewContainer">
    <h1 class="heading">Edit Exercise Log</h1>

    <div class="inputs">
      <input placeholder="Exercise Name" id="exerciseName" name="exerciseName" type="text" @keydown.enter="submit"/>

      <button id="submitButton" value="Submit" type="submit" @click="submit">Submit</button>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useExerciseStore } from "@/stores/exerciseStore.ts";
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import { updateExercise } from "@/services/exerciseService.ts";
import router from "@/router";

const exerciseStore = useExerciseStore();

const route = useRoute();

const exerciseName = route.params.name as string;

function loadOldValues(): void {
  const exerciseNameInput = document.getElementById("exerciseName") as HTMLInputElement;

  const exercise = exerciseStore.getExerciseByName(exerciseName);

  if (exercise) {
    exerciseNameInput.value = exercise.name;
  } else {
    exerciseNameInput.value = exerciseName;
  }
}

async function submit() {
  if (!checkInputs()) {
    return;
  }

  const exerciseNameInput = document.getElementById("exerciseName") as HTMLInputElement;

  const response = await updateExercise(exerciseName, exerciseNameInput.value);

  if (!response) {
    alert("An error occurred while updating the exercise.");
    return;
  }

  exerciseStore.updateExercise(exerciseName, response);

  await router.push("/exercise");
}

function checkInputs(): boolean {
  const exerciseNameInput = document.getElementById("exerciseName") as HTMLInputElement;

  let isValid = true;

  if (!exerciseNameInput.value) {

    exerciseNameInput.style.borderColor = " var(--danger)";

    const eventListener = () => {
      exerciseNameInput.style.borderColor = "var(--border)";
      exerciseNameInput.removeEventListener("focus", eventListener);
    };

    exerciseNameInput.addEventListener("focus", eventListener);

    isValid = false;
  }

  return isValid;
}

onMounted(() => {
  loadOldValues();
});
</script>

<style scoped>
.heading {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
}

.inputs {
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

.inputs input,
button {
  background-color: var(--bg-surface-secondary);
  color: var(--text-main);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  width: 250px;
}

.inputs input:focus {
  border-color: var(--primary);
}

.inputs button {
  background-color: var(--primary);
  color: var(--text-main);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.inputs button:hover {
  background-color: #00a495;
}
</style>
