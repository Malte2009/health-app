<template>
  <div class="add-exercise">
    <div @click="$emit('close')" class="close">x</div>
    <h1>Add Exercise</h1>
    <input
      placeholder="Exercise Name"
      id="exerciseName"
      name="exerciseName"
      type="text"
      @keydown.enter="submit()"
    />
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
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
