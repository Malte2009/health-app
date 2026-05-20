<template>
  <div class="change-hrvRecording">
    <div class="container">
      <div @click="$emit('close')" class="close">x</div>
      <h1>Edit HRV Recording</h1>
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

        <label>RR Data (Leave blank to keep unchanged)</label>
        <textarea v-model="rrdata" placeholder="Paste new RR data here to overwrite..." rows="4"></textarea>

        <button class="button" @click="submit">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { updateHrvRecording, getHrvRecording } from "@/services/hrvService.ts";

const props = defineProps<{
  id: string;
}>();

const emit = defineEmits(["close", "reload"]);

const name = ref("");
const date = ref("");
const startTime = ref("");
const endTime = ref("");
const device = ref("");
const context = ref("");
const trainingLogId = ref("");
const sleepLogId = ref("");
const rrdata = ref("");

function toDateTimeLocal(d: string | Date | undefined) {
  if (!d) return "";
  const dateObj = new Date(d);
  if (isNaN(dateObj.getTime())) return "";
  const offset = dateObj.getTimezoneOffset() * 60000;
  return new Date(dateObj.getTime() - offset).toISOString().slice(0, 16);
}

onMounted(async () => {
  try {
    const r = await getHrvRecording(props.id);
    if (r) {
      name.value = r.name || "";
      date.value = r.date ? new Date(r.date).toISOString().split('T')[0] : "";
      startTime.value = toDateTimeLocal(r.startDateTime);
      endTime.value = toDateTimeLocal(r.endDateTime);
      device.value = r.device || "";
      context.value = r.context || "";
      trainingLogId.value = r.trainingLogId || "";
      sleepLogId.value = r.sleepLogId || "";
    }
  } catch (error) {
    console.error("Failed to load recording:", error);
  }
});

async function submit() {
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
    await updateHrvRecording(props.id, rrdata.value || undefined, queryParams);
    console.log("Successfully submitted");
    emit("reload");
    emit("close");
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.response?.data || error.message || String(error);
    alert("Failed to edit HRV recording: " + errorMsg);
    console.error("Failed to edit HRV recording:", error);
  }
}
</script>

<style scoped>
.change-hrvRecording {
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

