<template>
  <div class="create-body-log-view">
    <h1 class="heading">Edit Body Log</h1>

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
import { updateBodyLog } from "@/services/bodyService.ts";
import { useBodyStore } from "@/stores/bodyStore.ts";
import { useRoute } from "vue-router";
import router from "@/router";
import { onMounted } from "vue";

const route = useRoute();

const bodyStore = useBodyStore();

const bodyLogId = route.params.id as string;

function changeFocus(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.focus();
  }
}

function loadOldValues() {
  const weightInput = document.getElementById("weight") as HTMLInputElement;
  const heightInput = document.getElementById("height") as HTMLInputElement;
  const fatMassInput = document.getElementById("fatMass") as HTMLInputElement;
  const fatPercentageInput = document.getElementById("fatPercentage") as HTMLInputElement;
  const muscleMassInput = document.getElementById("muscleMass") as HTMLInputElement;
  const waterMassInput = document.getElementById("waterMass") as HTMLInputElement;

  const bodyLog = bodyStore.getBodyLogById(bodyLogId);

  if (bodyLog) {
    weightInput.value = bodyLog.weight.toString();
    heightInput.value = bodyLog.height.toString();
    fatMassInput.value = bodyLog.fatMass?.toString() || "";
    fatPercentageInput.value = bodyLog.fatPercentage?.toString() || "";
    muscleMassInput.value = bodyLog.muscleMass?.toString() || "";
    waterMassInput.value = bodyLog.waterMass?.toString() || "";
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

  const oldBodyLog = bodyStore.getBodyLogById(bodyLogId);

  if (!oldBodyLog) {
    console.error("Old body log not found");
    return;
  }

  const oldData: createBodyLogType = {
    weight: oldBodyLog.weight,
    height: oldBodyLog.height,
    fatMass: oldBodyLog.fatMass || undefined,
    fatPercentage: oldBodyLog.fatPercentage || undefined,
    muscleMass: oldBodyLog.muscleMass || undefined,
    waterMass: oldBodyLog.waterMass || undefined,
  };

  if (JSON.stringify(data) === JSON.stringify(oldData)) {
    await router.push({ name: "body" });
    return;
  }

  let bodyLog: bodyLog | void;

  try {
    bodyLog = await updateBodyLog(bodyLogId, data);
  } catch (error) {
    console.error("Error creating body log:", error);
    return;
  }

  if (!bodyLog) return;

  bodyStore.editBodyLog(bodyLog);
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
