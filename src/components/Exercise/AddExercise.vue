<template>
  <div class="add-exercise">
    <div class="container">
      <div @click="$emit('close')" class="close">x</div>
      <h1>Add Exercise</h1>
      <div class="inputs">
        <input
          placeholder="Exercise Name"
          id="exerciseName"
          name="exerciseName"
          type="text"
          @keydown.enter="submit()"
        />
        <button class="button" @click="submit">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createExercise } from "@/services/exerciseService.ts";
import type { createExerciseLogRequest } from "@/types/exerciseType.ts";

const emit = defineEmits(["close", "reload"]);

const props = defineProps<{
  trainingId: string;
}>();

async function submit() {
  const exerciseName = (document.getElementById("exerciseName") as HTMLInputElement).value;
  if (exerciseName.trim() === "") {
    alert("Please enter an exercise name.");
    return;
  }

  // Here you would typically call a service to create the exercise
  console.log(`Exercise created: ${exerciseName}`);

  const exerciseData: createExerciseLogRequest = {
    name: exerciseName,
    trainingId: props.trainingId,
  };

  await createExercise(exerciseData);

  emit("close");

  emit("reload");
}
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

.container input:focus {
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
  transition: background-color 0.2s, transform 0.1s;
}

.button:hover {
  background-color: #00a495;
}
</style>
