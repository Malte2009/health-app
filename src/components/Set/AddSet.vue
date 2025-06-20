<template>
  <div class="add-set">
    <div @click="$emit('close')" class="close">x</div>
    <div class="container">
      <h1>Add Set</h1>
      <div class="inputs">
        <select id="type-selection" @change="checkInput()">
          <option value="" disabled selected>Select Type</option>
          <option value="work">Workset</option>
          <option value="warumup">Warmupset</option>
          <option value="Custom">Custom</option>
        </select>
        <input placeholder="Type" id="type" name="type" type="text" v-if="customInput" @keydown.enter="changeFocus('reps')" />
        <input placeholder="Repetitions" id="reps" name="reps" type="number" @keydown.enter="changeFocus('weight')" />
        <input placeholder="Weight (kg)" id="weight" name="weight" type="number" @keydown.enter="submit()" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { createSetRequestType } from "@/types/setType.ts";
import { createSetRequest } from "@/services/setService.ts";
import { onMounted, ref } from "vue";

const emit = defineEmits(["close", "reload"]);

const props = defineProps<{
  exerciseId: string;
}>();

const customInput = ref(false);

function checkInput() {
  const input = document.getElementById("type-selection") as HTMLSelectElement;

  customInput.value = input.value === "Custom";
}

async function submit() {
  const reps = parseInt((document.getElementById("reps") as HTMLInputElement).value);
  const weight = parseFloat((document.getElementById("weight") as HTMLInputElement).value);

  const setData: createSetRequestType = {
    reps,
    weight,
    exerciseId: props.exerciseId,
  };

  await createSetRequest(setData);

  emit("close");

  emit("reload");
}

function changeFocus(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.focus();
  }
}

onMounted(() => {
  const repsInput = document.getElementById("reps") as HTMLInputElement;
  if (repsInput) {
    repsInput.focus();
  }
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
  position: absolute;
  top: 10px;
  right: 10px;
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
</style>
