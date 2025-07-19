<template>
  <div class="add-set">
    <div class="container">
      <div @click="$emit('close')" class="close">x</div>
      <h1>Edit Set</h1>
      <div class="inputs">
        <select id="type-selection" @change="checkInput()">
          <option :selected="setType === 'Work'" v-for="setType in setTypes" :key="setType || ''" :value="setType">
            {{ setType }}
          </option>
          <option value="Custom">Custom</option>
        </select>
        <input placeholder="Type" id="type" name="type" type="text" v-if="customInput" @keydown.enter="changeFocus('reps')" />
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

const customInput = ref(false);

function checkInput() {
  const input = document.getElementById("type-selection") as HTMLSelectElement;

  customInput.value = input.value === "Custom";
}

async function submit() {
  const reps = parseInt((document.getElementById("reps") as HTMLInputElement).value);
  const weight = parseFloat((document.getElementById("weight") as HTMLInputElement).value);
  const type = customInput.value
    ? (document.getElementById("type") as HTMLInputElement).value
    : (document.getElementById("type-selection") as HTMLSelectElement).value;

  const setData: changeSetRequestType = {
    id: props.setId,
    type,
    reps,
    weight,
  };

  try {
    const changedSet = await changeSetRequest(setData);

    if (changedSet) {
      trainingStore.updateSet(changedSet);
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
    console.log(error.response.data);

    switch (error.response.data) {
      case "Invalid type":
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
      case "Invalid reps (1-100)":
        const repsInput = document.getElementById("reps") as HTMLInputElement;

        repsInput.style.borderColor = "var(--danger)";

        repsInput.addEventListener("keydown", () => {
          repsInput.style.borderColor = "var(--border)";
        });
        break;
      case "Invalid weight (0-1000 kg)":
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
  if (element) {
    element.focus();
  }
}

async function loadOldSetData() {
  const setId = props.setId;

  if (!setId) return;

  try {
    const setData = trainingStore.getSetById(setId)

    if (setData) {
      if (setData.type) {
        (document.getElementById("type-selection") as HTMLSelectElement).value = setData.type;
      }
      (document.getElementById("reps") as HTMLInputElement).value = setData.reps.toString();
      (document.getElementById("weight") as HTMLInputElement).value = setData.weight.toString();
    }
  } catch (error) {
    console.error("Failed to load set data:", error);
  }
}

onMounted(async () => {
  const repsInput = document.getElementById("reps") as HTMLInputElement;
  setTypes.value = typeStore.getSetTypes;
  await loadOldSetData();
  if (repsInput) {
    repsInput.focus();
  }

  checkInput();
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
