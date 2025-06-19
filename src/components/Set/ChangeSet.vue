<template>
  <div class="add-set">
    <div @click="$emit('close')" class="close">x</div>
    <div class="container">
      <h1>Add Set</h1>
      <div class="inputs">
        <input
          placeholder="Repetitions"
          id="reps"
          name="reps"
          type="number"
          @keydown.enter="changeFocus('weight')"
        />
        <input
          placeholder="Weight (kg)"
          id="weight"
          name="weight"
          type="number"
          @keydown.enter="submit()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { changeSetRequest } from "@/services/setService.ts";
import { onMounted } from "vue";
import type { changeSetRequestType } from "@/types/setType.ts";

const emit = defineEmits(["close", "reload"]);

const props = defineProps<{
  setId: string;
}>();

async function submit() {
  const reps = parseInt((document.getElementById("reps") as HTMLInputElement).value);
  const weight = parseFloat((document.getElementById("weight") as HTMLInputElement).value);

  const setData: changeSetRequestType = {
    id: props.setId,
    reps,
    weight,
  };

  await changeSetRequest(setData);

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
