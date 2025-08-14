<template>
  <div class="add-exercise">
    <div class="container">
      <div @click="$emit('close')" class="close">x</div>
      <h1>Change Exercise</h1>
      <div class="inputs">
        <select id="exerciseName" @change="checkInput()">
          <option value="" disabled selected>Select an exercise</option>
          <option v-for="exercise in typeStore.getExerciseTypes" :key="exercise" :value="exercise">
            {{ exercise }}
          </option>
          <option value="Custom">Custom</option>
        </select>
        <input v-if="showCustomInput" id="customName" placeholder="Exercise Name" type="text" @keydown.enter="submit()" />
        <input id="exerciseNotes" placeholder="Notes (optional)" type="text" />
        <button class="button" @click="submit">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { changeExerciseInTraining } from "@/services/exerciseService.ts";
import type { changeExerciseInTrainingRequest, exercise } from "@/types/exerciseType.ts";
import { onMounted, ref } from "vue";
import { useTypeStore } from "@/stores/type.ts";
import { useTrainingStore } from "@/stores/training.ts";

const typeStore = useTypeStore();
const trainingStore = useTrainingStore();

const emit = defineEmits(["close", "reload"]);

const exercise = ref<exercise>();

const props = defineProps<{
  exerciseId: string;
}>();

const showCustomInput = ref(false);

function checkInput() {
  const input = document.getElementById("exerciseName") as HTMLSelectElement;

  showCustomInput.value = input.value === "Custom";
}

async function submit() {
  let exerciseName = (document.getElementById("exerciseName") as HTMLInputElement).value;

  if (showCustomInput.value) {
    exerciseName = (document.getElementById("customName") as HTMLInputElement).value;
  }

  if (exerciseName.trim() === "") {
    const exercise = document.getElementById("exerciseName") as HTMLInputElement;

    exercise.style.borderColor = "var(--danger)";

    exercise.addEventListener("focus", () => {
      exercise.style.borderColor = "var(--border)";
    });
    return;
  }

  const exerciseData: changeExerciseInTrainingRequest = {
    id: props.exerciseId,
    name: exerciseName,
    notes: (document.getElementById("exerciseNotes") as HTMLInputElement).value || "",
  };

  const changedExercise = await changeExerciseInTraining(exerciseData);

  if (!changedExercise) {
    console.error("Failed to change exercise");
    return;
  }

  trainingStore.updateExercise(changedExercise);

  emit("close");

  emit("reload");
}

onMounted(async () => {
  const exerciseNameInput = document.getElementById("exerciseName") as HTMLInputElement;
  const exerciseNotes = document.getElementById("exerciseNotes") as HTMLInputElement;
  exerciseNameInput.focus();

  try {
    const oldExercise = trainingStore.getExerciseById(props.exerciseId);

    if (oldExercise) {
      exercise.value = oldExercise;
      exerciseNameInput.value = oldExercise.name;
      exerciseNotes.value = oldExercise.notes || "";
    } else {
      console.error("Exercise not found");
    }
  } catch (error) {
    console.error("Failed to fetch exercise names:", error);
  }

  checkInput();
});
</script>

<style scoped>
.add-exercise {
  padding: 20px;
  background-color: var(--bg-surface);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.close {
  cursor: pointer;
  color: var(--danger);
  font-weight: bold;
  text-align: right;
  width: 100%;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.container input {
  background-color: var(--bg-surface-secondary);
  color: var(--text-main);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.container select {
  background-color: var(--bg-surface-secondary);
  color: var(--text-main);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 40px 10px 16px;
  font-size: 1rem;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  box-shadow: 0 2px 8px 0 rgba(60, 60, 100, 0.06);
  cursor: pointer;
  min-width: 180px;
  font-weight: 500;
  position: relative;
}

.container input:focus,
.container select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(0, 191, 174, 0.2);
}

.button {
  background-color: var(--primary);
  color: var(--text-main);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition:
    background-color 0.2s,
    transform 0.1s;
}

.button:hover {
  background-color: #00a495;
}
</style>
