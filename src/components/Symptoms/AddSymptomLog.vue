<template>
  <div class="add-symptom-log">
    <div class="container">
      <div @click="$emit('close')" class="close">x</div>
      <h1>Add Symptom Log</h1>
      <div class="inputs">
        <label>Type</label>
        <select v-model="type">
          <option value="SYMPTOM">Symptom</option>
          <option value="SYNCOPE">Syncope</option>
        </select>
        <label>Timestamp</label>
        <input v-model="timestamp" type="datetime-local" />
        <label>Severity (1-10)</label>
        <div style="display: flex; flex-direction: row; align-items: center">
          <input v-model="severity" min="1" max="10" type="range" />
          <div style="margin-left: 10px">{{ severity }}</div>
        </div>
        <label>Name</label>
        <select v-if="type === 'SYMPTOM'" v-model="name">
          <option value="HEADACHE">Headache</option>
          <option value="DIZZINESS">Dizziness</option>
          <option value="VISUAL_DISTURBANCE">Visual Disturbance</option>
          <option value="PULSATILE_TINNITUS">Pulsatile Tinnitus</option>
          <option value="NECK_PULSATION">Neck Pulsation</option>
          <option value="POSITIONAL_PULSE_SPIKE">Positional Pulse Spike</option>
          <option value="CONGESTION_FEELING">Congestion Feeling</option>
          <option value="NAUSEA">Nausea</option>
          <option value="COGNITIVE_FOG">Cognitive Fog</option>
          <option value="FATIGUE">Fatigue</option>
          <option value="FLUSHING">Flushing</option>
          <option value="URTICARIA">Urticaria</option>
          <option value="DERMATOGRAPHISM">Dermatographism</option>
          <option value="DYSPNEA">Dyspnea</option>
          <option value="CHEST_PRESSURE">Chest Pressure</option>
          <option value="LIGHTHEADEDNESS">Lightheadedness</option>
          <option value="OTHER">Other</option>
        </select>
        <select v-model="name" v-else-if="type === 'SYNCOPE'">
          <option value="ORTHOSTATIC">Orthostatic</option>
          <option value="SITTING">Sitting</option>
          <option value="SITUATIONAL">Situational</option>
          <option value="UNCLASSIFIED">Unclassified</option>
        </select>

        <label>Trigger</label>
        <input placeholder="e.g Leg Press" v-model="trigger" />

        <label>Position</label>
        <input placeholder="e.g. Standing, Sitting" v-model="position" />

        <label v-if="type === 'SYMPTOM'">ICP Trigger</label>
        <div v-if="type === 'SYMPTOM'">
          <select v-model="icpTrigger">
            <option value="">No ICP Trigger</option>
            <option value="BENDING_FORWARD">Worse on Bending Forward</option>
            <option value="LYING_DOWN">Worse on Lying Down</option>
            <option value="BETTER_LYING_DOWN">Better on Lying Down</option>
          </select>
        </div>

        <div v-if="type === 'SYMPTOM'" style="display: flex; flex-direction: row; align-items: center">
          <label>Pulsatile</label>
          <input style="width: fit-content; margin-left: 10px" type="checkbox" v-model="pulsatile" />
        </div>
        <label v-if="type === 'SYMPTOM'">Syncope ID</label>
        <input v-if="type === 'SYMPTOM'" v-model="syncopeId" />

        <label v-if="type === 'SYNCOPE'">Outcome</label>
        <select v-if="type === 'SYNCOPE'" v-model="outcome">
          <option value="PRESYNCOPE">Presyncope</option>
          <option value="SYNCOPE">Syncope</option>
        </select>

        <div v-if="type === 'SYNCOPE'" style="display: flex; flex-direction: row; align-items: center">
          <label>Amnesia</label>
          <input style="width: fit-content; margin-left: 10px" type="checkbox" v-model="hadAmnesia" />
        </div>

        <label v-if="hadAmnesia === true && type === 'SYNCOPE'">Amnesia Length</label>
        <input placeholder="Minutes" v-if="hadAmnesia === true && type === 'SYNCOPE'" v-model="amnesiaLength" type="number" />

        <label v-if="type === 'SYNCOPE'">Activity Before</label>
        <input v-if="type === 'SYNCOPE'" v-model="activityBefore" placeholder="e.g Gym" />

        <label v-if="type === 'SYNCOPE'">Injuries</label>
        <input v-if="type === 'SYNCOPE'" v-model="injuries" placeholder="e.g Cut" />

        <label v-if="type === 'SYNCOPE'">Training Log ID</label>
        <input v-if="type === 'SYNCOPE'" v-model="trainingLogId" />

        <label>Notes</label>
        <textarea v-model="notes" placeholder="Additional notes..." rows="4"></textarea>

        <button class="button" @click="submit">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { toLocalDateTimeString } from "@/utility/date.ts";
import { syncopeService } from "@/services/syncopeService.ts";
import type { SyncopeLog } from "@/types/symptoms/syncopeType.ts";
import type { SymptomLog } from "@/types/symptoms/symptomType.ts";
import SymptomService from "@/services/symptomService.ts";

const emit = defineEmits(["close", "reload"]);

const type = ref<"SYMPTOM" | "SYNCOPE">("SYMPTOM");
const timestamp = ref(toLocalDateTimeString());
const severity = ref<string>("5");
const name = ref();
const notes = ref(undefined);
const icpTrigger = ref(undefined);
const pulsatile = ref(false);
const trigger = ref(undefined);
const position = ref(undefined);
const outcome = ref<"PRESYNCOPE" | "SYNCOPE">("PRESYNCOPE");
const syncopeId = ref(undefined);
const hadAmnesia = ref(false);
const amnesiaLength = ref();
const injuries = ref(undefined);
const trainingLogId = ref(undefined);
const activityBefore = ref(undefined);

async function submit() {
  if (type.value === "SYNCOPE") {
    const data: SyncopeLog = {
      type: type.value,
      timestamp: timestamp.value,
      severity: parseInt(severity.value),
      name: name.value,
      notes: notes.value,
      trigger: trigger.value,
      position: position.value,
      outcome: outcome.value,
      amnesia: hadAmnesia.value,
      amnesiaDurationMinutes: parseInt(amnesiaLength.value),
      injuries: injuries.value,
      trainingLogId: trainingLogId.value,
      activityBefore: activityBefore.value,
    };

    await syncopeService.createSyncope(data);
  } else if (type.value === "SYMPTOM") {
    const data: SymptomLog = {
      type: type.value,
      timestamp: timestamp.value,
      severity: parseInt(severity.value),
      name: name.value,
      notes: notes.value,
      trigger: trigger.value,
      position: position.value,
      worseOnBendingForward: icpTrigger.value === "BENDING_FORWARD",
      worseOnLyingDown: icpTrigger.value === "LYING_DOWN",
      betterOnLyingDown: icpTrigger.value === "BETTER_LYING_DOWN",
      pulsatile: pulsatile.value,
      syncopeLogId: syncopeId.value || undefined,
    };

    await SymptomService.createSymptom(data);
  }

  emit("reload");
  emit("close");
}
</script>

<style scoped>
.add-symptom-log {
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

.container input,
.container select,
.container textarea {
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
  resize: none;
}

.container input:focus,
.container textarea:focus {
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
