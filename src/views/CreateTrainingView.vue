<template>
  <div class="create-training">
    <h1 class="heading">Create Training</h1>

    <div class="inputs">
      <form id="trainingForm" @submit.prevent="submit">
        <select @change="checkInput()" id="trainingTypeSelect" name="trainingType" @keydown.enter.prevent="changeFocus('trainingDate')">
          <option value="" disabled selected>Select Training Type</option>
          <option v-for="type in trainingTypes" :key="type.type" :value="type.type">{{ type.type }}</option>
          <option value="Custom">Custom</option>
        </select>
        <input
          v-if="showCustomInput"
          placeholder="Training Type"
          id="trainingType"
          name="trainingType"
          type="text"
          @keydown.enter.prevent="changeFocus('trainingDate')"
        />
        <input id="trainingDate" name="trainingDate" type="date" @keydown.enter.prevent="changeFocus('averageHeartRate')" />
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
        <input placeholder="Pauses (optional)" id="pauses" name="pauses" type="text" @keydown.enter.prevent="changeFocus('pausesLength')" />
        <input
          placeholder="Pauses Length (optional)"
          id="pausesLength"
          name="pausesLength"
          type="text"
          @keydown.enter.prevent="changeFocus('notes')"
        />
        <input placeholder="Notes (optional)" id="notes" name="notes" type="text" @keydown.enter.prevent="changeFocus('trainingTime')" />
        <input
          placeholder="Training Time (HH:MM)"
          id="trainingTime"
          name="trainingTime"
          type="text"
          @keydown.enter.prevent="changeFocus('submitButton')"
        />
        <button id="submitButton" value="Submit" class="btn" type="submit">Submit</button>
        <br />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.ts";
import type { createTrainingLogRequestType, getTrainingTypesResponseType } from "@/types/trainingType.ts";
import { createTrainingLog, getTrainingTypes } from "@/services/trainingService.ts";
import { useTrainingStore } from "@/stores/training.ts";
import { onMounted, ref } from "vue";
import type { AxiosError } from "axios";

const authStore = useAuthStore();
const trainingStore = useTrainingStore();
const router = useRouter();

const trainingTypes = ref<getTrainingTypesResponseType>([]);
const showCustomInput = ref(false);

function checkInput() {
  const input = document.getElementById("trainingTypeSelect") as HTMLSelectElement;

  showCustomInput.value = input.value === "Custom";
}

async function submit() {
  let trainingType = (document.getElementById("trainingTypeSelect") as HTMLInputElement).value;
  const trainingDuration = (document.getElementById("trainingDuration") as HTMLInputElement).value;
  const averageHeartRate = (document.getElementById("averageHeartRate") as HTMLInputElement).value;
  const pauses = parseInt((document.getElementById("pauses") as HTMLInputElement).value);
  const pausesLength = parseInt((document.getElementById("pausesLength") as HTMLInputElement).value);

  if (showCustomInput.value) {
    trainingType = (document.getElementById("trainingType") as HTMLInputElement).value;
  }

  console.log(trainingType, trainingDuration, averageHeartRate, pauses, pausesLength);

  const trainingData: createTrainingLogRequestType = {
    type: trainingType,
    durationMinutes: parseInt(trainingDuration, 10),
    avgHeartRate: parseInt(averageHeartRate, 10),
    pauses,
    pausesLength,
    notes: (document.getElementById("notes") as HTMLInputElement).value || "",
  };

  let trainingLog;

  try {
    trainingLog = await createTrainingLog(trainingData);
  } catch (error) {
    handleError(error as AxiosError);
    return;
  }

  console.log(trainingLog);

  trainingStore.setCurrentTraining(trainingLog.id);

  await router.push({ name: "training", params: { id: trainingLog.id } });
}

function handleError(error: AxiosError) {
  if (error?.response?.data) {
    console.log(error.response.data);

    switch (error.response.data) {
      case "Training type is required":
        let trainingTypeInput = document.getElementById("trainingType") as HTMLInputElement;

        if (showCustomInput.value) trainingTypeInput = document.getElementById("trainingTypeSelect") as HTMLInputElement;

        trainingTypeInput.style.borderColor = "var(--danger)";

        trainingTypeInput.addEventListener("keydown", () => {
          trainingTypeInput.style.borderColor = "var(--border)";
        });
        break;
      case "Invalid date format, use YYYY-MM-DD":
        const trainingDateInput = document.getElementById("trainingDate") as HTMLInputElement;

        trainingDateInput.style.borderColor = "var(--danger)";

        trainingDateInput.addEventListener("focus", () => {
          trainingDateInput.style.borderColor = "var(--border)";
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
        const trainingDurationInput = document.getElementById("trainingDuration") as HTMLInputElement;

        trainingDurationInput.style.borderColor = "var(--danger)";

        trainingDurationInput.addEventListener("keydown", () => {
          trainingDurationInput.style.borderColor = "var(--border)";
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
  if (!authStore.isAuthenticated) {
    await router.push({ name: "login" });
  }

  try {
    trainingTypes.value = await getTrainingTypes();
  } catch (error) {
    console.error("Failed to fetch training types:", error);
  }

  const now = new Date();
  const today = new Date();
  (document.getElementById("trainingDate") as HTMLInputElement).valueAsDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  (document.getElementById("trainingTime") as HTMLInputElement).value = now.toTimeString().substring(0, 5);

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
