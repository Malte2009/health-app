<template>
  <div class="add-set">
    <div class="container">
      <div @click="$emit('close')" class="close">x</div>
      <h1>Edit Set</h1>
      <div class="inputs">
        <select id="type-selection" @change="checkTypeInput()">
          <option v-for="setType in setTypes" :key="setType || ''" :value="setType">
            {{ setType }}
          </option>
          <option value="Custom">Custom</option>
        </select>
        <input placeholder="Type" id="type" name="type" type="text" v-if="customTypeInput" @keydown.enter="changeFocus('repUnit-selection')" />
        <select id="repUnit-selection" @change="checkSetUnitInput()">
          <option v-for="setRepUnit in setRepUnits" :key="setRepUnit" :value="setRepUnit">
            {{ setRepUnit }}
          </option>
          <option value="Custom">Custom</option>
        </select>
        <input placeholder="Repetition Unit" id="repUnit" name="repUnit" type="text" v-if="customRepUnitInput" @keydown.enter="changeFocus('reps')" />
        <input placeholder="Repetitions" id="reps" name="reps" type="number" @keydown.enter="changeFocus('weight')" />
        <input placeholder="Weight (kg)" id="weight" name="weight" type="number" @keydown.enter="submit()" />
        <button class="button" @click="submit">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { changeSetRequest } from "@/services/setService.ts";
import { onMounted, ref } from "vue";
import type { changeSetRequestType } from "@/types/setType.ts";
import type { AxiosError } from "axios";
import { useTypeStore } from "@/stores/type.ts";
import { useTrainingStore } from "@/stores/training.ts";

const emit = defineEmits(["close", "reload"]);

const typeStore = useTypeStore();
const trainingStore = useTrainingStore();

const props = defineProps<{
  setId: string;
}>();

const setTypes = ref<string[]>([]);
const setRepUnits = ref<string[]>([]);

const customTypeInput = ref(false);
const customRepUnitInput = ref(false);

function checkTypeInput() {
  const input = document.getElementById("type-selection") as HTMLSelectElement;

  if (input.value === "Pause") {
    const weightInput = document.getElementById("weight") as HTMLInputElement;
    const repUnitInput = document.getElementById("repUnit-selection") as HTMLInputElement;
    weightInput.value = "0";
    repUnitInput.value = "s";
    weightInput.style.display = "none";
  } else {
    const weightInput = document.getElementById("weight") as HTMLInputElement;
    const repUnitInput = document.getElementById("repUnit-selection") as HTMLInputElement;
    const oldWeight = trainingStore.getSetById(props.setId)?.weight;
    const oldRepUnit = trainingStore.getSetById(props.setId)?.repUnit;

    weightInput.style.display = "block";

    if (weightInput.value === "0" || weightInput.value === "") {
      weightInput.value = oldWeight?.toString() || "0";
    }

    if (repUnitInput.value === "" || repUnitInput.value === "s") {
      repUnitInput.value = oldRepUnit || "";
    }
  }

  customTypeInput.value = input.value === "Custom";
}

function checkSetUnitInput() {
  const input = document.getElementById("repUnit-selection") as HTMLSelectElement;

  customRepUnitInput.value = input.value === "Custom";
}

async function submit() {
  const reps = parseInt((document.getElementById("reps") as HTMLInputElement).value);
  const weight = parseFloat((document.getElementById("weight") as HTMLInputElement).value);
  let type = (document.getElementById("type-selection") as HTMLInputElement).value;
  let repUnit = (document.getElementById("repUnit-selection") as HTMLInputElement).value;

  if (customTypeInput.value) type = (document.getElementById("type") as HTMLInputElement).value;

  if (customRepUnitInput.value) repUnit = (document.getElementById("repUnit") as HTMLInputElement).value;

  const setData: changeSetRequestType = {
    id: props.setId,
    type,
    reps,
    weight,
    repUnit,
  };

  try {
    const changedSet = await changeSetRequest(setData);

    if (changedSet) {
      trainingStore.updateSet(changedSet);

      if (customRepUnitInput.value) typeStore.addSetUnitType(type);
      if (customTypeInput.value) typeStore.addSetType(type);
    }
  } catch (error) {
    if (error as AxiosError) {
      handleError(error as AxiosError);
      return;
    }
  }

  emit("close");

  emit("reload");
}

function handleError(error: AxiosError) {
  if (error?.response?.data) {
    switch (error.response.data) {
      case "Type must be a string":
      case "Type must be less than 50 characters":
      case "Type cannot be empty":
        const typeInput = document.getElementById("type-selection") as HTMLInputElement;

        if (typeInput.value === "Custom") {
          const customTypeInput = document.getElementById("type") as HTMLInputElement;
          customTypeInput.style.borderColor = "var(--danger)";

          customTypeInput.addEventListener("focus", () => {
            customTypeInput.style.borderColor = "var(--border)";
          });
        } else {
          typeInput.style.borderColor = "var(--danger)";

          typeInput.addEventListener("focus", () => {
            typeInput.style.borderColor = "var(--border)";
          });
        }
        break;
      case "Rep unit cannot be empty":
      case "Rep unit must be a string":
      case "Rep unit must be between 1 and 10 characters":
        const repUnitInput = document.getElementById("repUnit-selection") as HTMLInputElement;

        if (repUnitInput.value === "Custom") {
          const customRepUnitInput = document.getElementById("repUnit") as HTMLInputElement;
          customRepUnitInput.style.borderColor = "var(--danger)";

          customRepUnitInput.addEventListener("focus", () => {
            customRepUnitInput.style.borderColor = "var(--border)";
          });
        } else {
          repUnitInput.style.borderColor = "var(--danger)";

          repUnitInput.addEventListener("focus", () => {
            repUnitInput.style.borderColor = "var(--border)";
          });
        }
        break;
      case "Reps must be a number":
      case "Reps must be between 1 and 1000":
        const repsInput = document.getElementById("reps") as HTMLInputElement;

        repsInput.style.borderColor = "var(--danger)";

        repsInput.addEventListener("keydown", () => {
          repsInput.style.borderColor = "var(--border)";
        });
        break;
      case "Invalid weight (0-1000 kg)":
      case "Weight must be a number":
        const weightInput = document.getElementById("weight") as HTMLInputElement;

        weightInput.style.borderColor = "var(--danger)";

        weightInput.addEventListener("keydown", () => {
          weightInput.style.borderColor = "var(--border)";
        });
        break;
    }
  }
}

function changeFocus(elementId: string) {
  const element = document.getElementById(elementId);
  const repUnitInput = document.getElementById("repUnit-selection") as HTMLInputElement;

  if (repUnitInput.value === "s" && elementId === "weight") {
    submit();
    return;
  }
  if (element) {
    element.focus();
  }
}

async function loadOldSetData() {
  const setId = props.setId;

  if (!setId) return;

  try {
    const setData = trainingStore.getSetById(setId);

    if (setData) {
      if (setData.type) {
        (document.getElementById("type-selection") as HTMLSelectElement).value = setData.type;
      }
      (document.getElementById("reps") as HTMLInputElement).value = setData.reps.toString();
      (document.getElementById("weight") as HTMLInputElement).value = setData.weight.toString();
      if (setData.repUnit) {
        (document.getElementById("repUnit-selection") as HTMLSelectElement).value = setData.repUnit;
      }
    }
  } catch (error) {
    console.error("Failed to load set data:", error);
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

onMounted(async () => {
  const repsInput = document.getElementById("reps") as HTMLInputElement;
  setTypes.value = typeStore.getSetTypes;
  setRepUnits.value = typeStore.getSetRepUnitTypes;
  if (repsInput) {
    repsInput.focus();
  }

  await sleep(10);
  await loadOldSetData();
  await sleep(10);
  checkSetUnitInput();
  checkTypeInput();
});
</script>

<style scoped>
.add-set {
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

.inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
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
