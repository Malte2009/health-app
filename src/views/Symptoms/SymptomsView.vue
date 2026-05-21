<template>
  <div class="symptoms-log">
    <h2>Acute Symptoms & Syncope</h2>

    <h3>Symptom Log</h3>
    <form @submit.prevent="submitSymptom">
      <div class="form-group">
        <label>Type:</label>
        <select v-model="symptomForm.type">
          <option value="Headache">Headache</option>
          <option value="Dizziness">Dizziness</option>
          <option value="Nausea">Nausea</option>
          <option value="Brain_Fog">Brain Fog</option>
          <option value="Fatigue">Fatigue</option>
          <option value="Flushing">Flushing</option>
          <option value="Dyspnea">Dyspnea</option>
        </select>
      </div>
      <div class="form-group">
        <label>Severity (1-10):</label>
        <input type="range" min="1" max="10" v-model.number="symptomForm.severity" /> {{ symptomForm.severity }}
      </div>
      <div class="form-group">
        <label>Timestamp:</label>
        <input type="datetime-local" v-model="symptomForm.timestamp" />
      </div>
      <div class="form-group">
        <label>Onset DateTime:</label>
        <input type="datetime-local" v-model="symptomForm.onsetDateTime" />
      </div>
      <div class="form-group">
        <label>Offset DateTime:</label>
        <input type="datetime-local" v-model="symptomForm.offsetDateTime" />
      </div>
      <div class="form-group">
        <label>Duration Minutes:</label>
        <input type="number" v-model.number="symptomForm.durationMinutes" />
      </div>

      <div class="form-group">
        <label><input type="checkbox" v-model="symptomForm.worseOnBendingForward" /> Worse On Bending Forward</label><br/>
        <label><input type="checkbox" v-model="symptomForm.worseOnLyingDown" /> Worse On Lying Down</label><br/>
        <label><input type="checkbox" v-model="symptomForm.betterOnLyingDown" /> Better On Lying Down</label><br/>
        <label><input type="checkbox" v-model="symptomForm.pulsatile" /> Pulsatile</label>
      </div>

      <div class="form-group">
        <label>Trigger:</label>
        <input type="text" v-model="symptomForm.trigger" />
      </div>
      <div class="form-group">
        <label>Location:</label>
        <input type="text" v-model="symptomForm.location" />
      </div>
      <button type="submit">Save Symptom</button>
    </form>

    <hr/>

    <h3>Syncope Log</h3>
    <form @submit.prevent="submitSyncope">
      <div class="form-group">
        <label>Outcome:</label>
        <select v-model="syncopeForm.outcome">
          <option value="Presyncope">Presyncope</option>
          <option value="Syncope">Syncope</option>
        </select>
      </div>
      <div class="form-group">
        <label>Type:</label>
        <select v-model="syncopeForm.type">
          <option value="Orthostatic">Orthostatic</option>
          <option value="Sitting">Sitting</option>
          <option value="Situational">Situational</option>
        </select>
      </div>
      <div class="form-group">
        <label>Position Before:</label>
        <input type="text" v-model="syncopeForm.positionBefore" />
      </div>
      <div class="form-group">
        <label>Position During:</label>
        <input type="text" v-model="syncopeForm.positionDuring" />
      </div>
      <div class="form-group">
        <label>Activity Before:</label>
        <input type="text" v-model="syncopeForm.activityBefore" />
      </div>

      <div class="form-group">
        <label><input type="checkbox" v-model="syncopeForm.hadProdromi" /> Had Prodromi</label>
      </div>
      <div class="form-group" v-if="syncopeForm.hadProdromi">
        <label>Prodrome Description:</label>
        <input type="text" v-model="syncopeForm.prodromeDescription" />
      </div>

      <div class="form-group">
        <label><input type="checkbox" v-model="syncopeForm.amnesia" /> Amnesia</label>
      </div>
      <div class="form-group" v-if="syncopeForm.amnesia">
        <label>Amnesia Duration Minutes:</label>
        <input type="number" v-model.number="syncopeForm.amnesiaDurationMinutes" />
      </div>

      <div class="form-group">
        <label>Hours Since Last Meal:</label>
        <input type="number" step="0.1" v-model.number="syncopeForm.hoursSinceLastMeal" />
      </div>
      <div class="form-group">
        <label>Hours Since Last Drink:</label>
        <input type="number" step="0.1" v-model.number="syncopeForm.hoursSinceLastDrink" />
      </div>
      <div class="form-group">
        <label>Salt Supplementation:</label>
        <input type="checkbox" v-model="syncopeForm.saltSupplementation" />
      </div>

      <button type="submit">Save Syncope</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { SymptomLog } from '@/types/healthTrackingType';
import { toLocalDateTimeString } from "@/utility/date";

const symptomForm = ref({
  timestamp: toLocalDateTimeString(),
  type: 'Headache',
  name: '',
  severity: 5,
  description: '',
  treatedWith: '',
  durationHours: 0,
  durationMinutes: 0,
  triggerContext: '',
  trigger: '',
  location: '',
  outcome: '',
  onsetDateTime: '',
  offsetDateTime: '',
  worseOnBendingForward: false,
  worseOnLyingDown: false,
  betterOnLyingDown: false,
  pulsatile: false
});

const syncopeForm = ref({
  outcome: 'Presyncope',
  type: 'Orthostatic',
  positionBefore: '',
  positionDuring: '',
  activityBefore: '',
  hadProdromi: false,
  prodromeDescription: '',
  amnesia: false,
  amnesiaDurationMinutes: 0,
  hoursSinceLastMeal: 0,
  hoursSinceLastDrink: 0,
  saltSupplementation: false
});

const submitSymptom = () => console.log('Symptom', symptomForm.value);
const submitSyncope = () => console.log('Syncope', syncopeForm.value);
const openSymptomAddModal = () => {
  symptomForm.value = {
    timestamp: toLocalDateTimeString(),
    type: 'Headache',
    name: '',
    severity: 5,
    description: '',
    treatedWith: '',
    durationHours: 0,
    durationMinutes: 0,
    triggerContext: '',
    trigger: '',
    location: '',
    outcome: '',
    onsetDateTime: '',
    offsetDateTime: '',
    worseOnBendingForward: false,
    worseOnLyingDown: false,
    betterOnLyingDown: false,
    pulsatile: false
  };
  showSymptomModal.value = true;
};

const showSymptomModal = ref(false);
</script>

<style scoped>
.form-group { margin-bottom: 1rem; }
</style>
