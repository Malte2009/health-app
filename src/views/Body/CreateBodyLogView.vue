<template>
  <div class="create-body-log-view">
    <h1 class="heading">Create Body Log</h1>

    <div class="inputs">
      <input @keydown.enter="changeFocus('height')" placeholder="Weight (kg)" id="weight" name="weight" type="number" step="0.1" />
      <input @keydown.enter="changeFocus('fatMass')" placeholder="Height (cm)" id="height" name="height" type="number" step="0.1" />
      <input
        @keydown.enter="changeFocus('fatPercentage')"
        placeholder="Body Fat Mass (kg) (optional)"
        id="fatMass"
        name="fatMass"
        type="number"
        step="0.1"
      />
      <input
        @keydown.enter="changeFocus('muscleMass')"
        placeholder="Body Fat (%) (optional)"
        id="fatPercentage"
        name="fatPercentage"
        type="number"
        step="0.1"
      />
      <input
        @keydown.enter="changeFocus('waterMass')"
        placeholder="Muscle Mass (kg) (optional)"
        id="muscleMass"
        name="muscleMass"
        type="number"
        step="0.1"
      />
      <input @keydown.enter="submit" placeholder="Water Mass (kg) (optional)" id="waterMass" name="waterMass" type="number" step="0.1" />
      <button id="submitButton" value="Submit" type="submit" @click="submit">Submit</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { bodyLog, createBodyLogType } from "@/types/bodyType.ts";
import { createBodyLog } from "@/services/bodyService.ts";
import { useBodyStore } from "@/stores/bodyStore.ts";
import router from "@/router";

const bodyStore = useBodyStore();

function changeFocus(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.focus();
  }
}

async function submit() {
  if (!checkInputs()) {
    return;
  }

  const weight = parseFloat((document.getElementById("weight") as HTMLInputElement).value);
  const height = parseFloat((document.getElementById("height") as HTMLInputElement).value);
  const fatMassValue = (document.getElementById("fatMass") as HTMLInputElement).value;
  const fatPercentageValue = (document.getElementById("fatPercentage") as HTMLInputElement).value;
  const muscleMassValue = (document.getElementById("muscleMass") as HTMLInputElement).value;
  const waterMassValue = (document.getElementById("waterMass") as HTMLInputElement).value;

  const fatMass = fatMassValue ? parseFloat(fatMassValue) : undefined;
  const fatPercentage = fatPercentageValue ? parseFloat(fatPercentageValue) : undefined;
  const muscleMass = muscleMassValue ? parseFloat(muscleMassValue) : undefined;
  const waterMass = waterMassValue ? parseFloat(waterMassValue) : undefined;

  const data: createBodyLogType = {
    weight,
    height,
    fatMass,
    fatPercentage,
    muscleMass,
    waterMass,
  };

  let bodyLog: bodyLog | void;

  try {
    bodyLog = await createBodyLog(data);
  } catch (error) {
    console.error("Error creating body log:", error);
    return;
  }

  if (!bodyLog) return;

  bodyStore.addBodyLog(bodyLog);

  await router.push({ name: "body" });
}
function checkInputs(): boolean {
  const weightInput = document.getElementById("weight") as HTMLInputElement;
  const heightInput = document.getElementById("height") as HTMLInputElement;

  let isValid = true;

  if (!weightInput.value) {
    weightInput.style.borderColor = " var(--danger)";

    const eventListener = () => {
      weightInput.style.borderColor = "var(--border)";
      weightInput.removeEventListener("focus", eventListener);
    };
    weightInput.addEventListener("focus", eventListener);

    isValid = false;
  }

  if (!heightInput.value) {
    heightInput.style.borderColor = " var(--danger)";

    const eventListener = () => {
      heightInput.style.borderColor = "var(--border)";
      heightInput.removeEventListener("focus", eventListener);
    };
    heightInput.addEventListener("focus", eventListener);

    isValid = false;
  }

  return isValid;
}
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
