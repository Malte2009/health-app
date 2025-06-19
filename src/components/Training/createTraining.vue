<template>
  <div class="create-training">
    <h1>Create Training</h1>

    <div class="inputs">
      <input
        placeholder="Training Date (YYYY-MM-DD)"
        id="trainingDate"
        name="trainingDate"
        type="date"
        @keydown.enter="changeFocus('trainingTime')"
      />
      <input
        placeholder="Training Time (HH:MM)"
        id="trainingTime"
        name="trainingTime"
        type="text"
        @keydown.enter="changeFocus('trainingType')"
      />
      <input
        placeholder="Training Type"
        id="trainingType"
        name="trainingType"
        type="text"
        @keydown.enter="changeFocus('trainingDuration')"
      />
      <input
        placeholder="Training Duration (minutes)"
        id="trainingDuration"
        name="trainingDuration"
        type="number"
        @keydown.enter="changeFocus('averageHeartRate')"
      />
      <input
        placeholder="Average Heart Rate"
        id="averageHeartRate"
        name="averageHeartRate"
        type="number"
        @keydown.enter="changeFocus('submitButton')"
      />

      <input id="submitButton" value="Submit" class="btn" type="submit" @click="submit()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.ts";
import type { createTrainingLogRequest } from "@/types/trainingType.ts";
import { createTrainingLog } from "@/services/trainingService.ts";
import { useTrainingStore } from "@/stores/training.ts";

const authStore = useAuthStore();
const trainingStore = useTrainingStore();
const router = useRouter();

async function submit() {
  const trainingType = (document.getElementById("trainingType") as HTMLInputElement).value;
  const trainingDuration = (document.getElementById("trainingDuration") as HTMLInputElement).value;
  const averageHeartRate = (document.getElementById("averageHeartRate") as HTMLInputElement).value;
  const trainingDate = (document.getElementById("trainingDate") as HTMLInputElement).value;
  const trainingTime = (document.getElementById("trainingTime") as HTMLInputElement).value;

  const trainingData: createTrainingLogRequest = {
    type: trainingType,
    duration: parseInt(trainingDuration, 10),
    avgHeartRate: parseInt(averageHeartRate, 10),
    date: trainingDate,
    time: trainingTime,
  };

  const trainingLog = await createTrainingLog(trainingData);

  console.log(trainingLog);

  trainingStore.setCurrentTraining(trainingLog.id);

  await router.push({ name: "training", params: { id: trainingLog.id } });
}

function changeFocus(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.focus();
  }
}
</script>

<style scoped></style>
