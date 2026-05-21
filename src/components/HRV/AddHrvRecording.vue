<template>
  <div class="add-hrvRecording">
    <div class="container">
      <div @click="$emit('close')" class="close">x</div>
      <h1>Create HRV Recording</h1>
      <div class="inputs">
        <label>Name</label>
        <input v-model="name" type="text" placeholder="Name" />

        <label>Date</label>
        <input v-model="date" type="date" />

        <label>Start Time</label>
        <input v-model="startTime" type="datetime-local" />

        <label>End Time</label>
        <input v-model="endTime" type="datetime-local" />

        <label>Device</label>
        <input v-model="device" type="text" placeholder="e.g. Polar H10" />

        <label>Context</label>
        <input v-model="context" type="text" placeholder="e.g. Awake, Sleeping" />

        <label>Training Log ID (optional)</label>
        <input v-model="trainingLogId" type="text" placeholder="Training Log ID" />

        <label>Sleep Log ID (optional)</label>
        <input v-model="sleepLogId" type="text" placeholder="Sleep Log ID" />

        <label>RR Data (comma separated or multiline)</label>
        <textarea v-model="rrdata" placeholder="Paste RR data here..." rows="4"></textarea>

        <button class="button" @click="submit">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { createHrvRecording } from "@/services/hrvService.ts";
import { toLocalDateTimeString, toLocalIsoDate } from "@/utility/date";

const emit = defineEmits(["close", "reload"]);

const name = ref("");
const date = ref(toLocalIsoDate());
const startTime = ref(toLocalDateTimeString());
const endTime = ref(toLocalDateTimeString());
const device = ref("");
const context = ref("");
const trainingLogId = ref("");
const sleepLogId = ref("");
const rrdata = ref("");

async function submit() {
  if (!rrdata.value.trim()) {
    alert("RR Data is required");
    return;
  }

  const queryParams = {
    name: name.value || undefined,
    date: date.value || undefined,
    startTime: startTime.value ? new Date(startTime.value).toISOString() : undefined,
    endTime: endTime.value ? new Date(endTime.value).toISOString() : undefined,
    device: device.value || undefined,
    context: context.value || undefined,
    trainingLogId: trainingLogId.value || undefined,
    sleepLogId: sleepLogId.value || undefined,
  };

  try {
    await createHrvRecording(rrdata.value, queryParams);
    emit("reload");
    emit("close");
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.response?.data || error.message || String(error);
    alert("Failed to create HRV recording: " + errorMsg);
    console.error("Failed to create HRV recording:", error);
  }
}
</script>

<style scoped>
.add-hrvRecording {
  padding: 20px;
  background-color: var(--bg-surface);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  overflow-y: auto;
  max-height: 90vh;
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
  width: 100%;
}

.container input, .container textarea {
  background-color: var(--bg-surface-secondary);
  color: var(--text-main);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.container input:focus, .container textarea:focus {
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
  margin-top: 10px;
  transition:
    background-color 0.2s,
    transform 0.1s;
}

.button:hover {
  background-color: #00a495;
}
</style>
