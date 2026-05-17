<template>
  <div class="daily-tracking">
    <h2>Daily Tracking & Hydration</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>Date:</label>
        <input type="date" v-model="form.date" />
      </div>

      <h3>Energy & Feeling</h3>
      <div class="form-group">
        <label>Energy Morning (1-10):</label>
        <input type="range" min="1" max="10" v-model.number="form.energyMorning" /> {{ form.energyMorning }}
      </div>
      <div class="form-group">
        <label>Energy Noon (1-10):</label>
        <input type="range" min="1" max="10" v-model.number="form.energyNoon" /> {{ form.energyNoon }}
      </div>
      <div class="form-group">
        <label>Energy Afternoon (1-10):</label>
        <input type="range" min="1" max="10" v-model.number="form.energyAfternoon" /> {{ form.energyAfternoon }}
      </div>
      <div class="form-group">
        <label>Energy Evening (1-10):</label>
        <input type="range" min="1" max="10" v-model.number="form.energyEvening" /> {{ form.energyEvening }}
      </div>

      <div class="form-group">
        <label>Overall Score (1-10):</label>
        <input type="range" min="1" max="10" v-model.number="form.overallScore" /> {{ form.overallScore }}
      </div>
      <div class="form-group">
        <label>Symptom Burden Score (1-10):</label>
        <input type="range" min="1" max="10" v-model.number="form.symptomBurdenScore" /> {{ form.symptomBurdenScore }}
      </div>

      <div class="form-group">
        <label>Work Capacity:</label>
        <input type="text" v-model="form.workCapacity" />
      </div>
      <div class="form-group">
        <label>Activity Level:</label>
        <select v-model="form.activityLevel">
          <option value="none">None</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="vigorous">Vigorous</option>
        </select>
      </div>
      <div class="form-group">
        <label>Worst Symptom:</label>
        <input type="text" v-model="form.worstSymptom" />
      </div>
      <div class="form-group">
        <label>Notes:</label>
        <textarea v-model="form.notes"></textarea>
      </div>

      <h3>Hydration & Salt</h3>
      <div class="form-group">
        <label>Target Water (ml):</label>
        <input type="number" v-model.number="form.targetWater_ml" />
      </div>
      <div class="form-group">
        <label>Actual Water (ml):</label>
        <input type="number" v-model.number="form.actualWater_ml" />
      </div>
      <div class="form-group">
        <label>Salt Supplemented (mg):</label>
        <input type="number" v-model.number="form.saltSupplementedMg" />
      </div>

      <h3>General Checks</h3>
      <div class="form-group">
        <label><input type="checkbox" v-model="form.headElevatedSleep" /> Head Elevated Sleep</label>
      </div>
      <div class="form-group">
        <label><input type="checkbox" v-model="form.neckPositionManaged" /> Neck Position Managed</label>
      </div>
      <div class="form-group">
        <label><input type="checkbox" v-model="form.emergencyAction" /> Emergency Action Taken</label>
      </div>

      <h3>Events</h3>
      <div class="form-group">
        <label>Syncope Count:</label>
        <input type="number" v-model.number="form.syncopeCount" />
      </div>
      <div class="form-group">
        <label>Presyncope Count:</label>
        <input type="number" v-model.number="form.presyncopeCount" />
      </div>

      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const form = ref({
  date: new Date().toISOString().substring(0, 10),
  energyMorning: 5,
  energyNoon: 5,
  energyAfternoon: 5,
  energyEvening: 5,
  overallScore: 5,
  symptomBurdenScore: 5,
  workCapacity: '',
  activityLevel: 'none',
  worstSymptom: '',
  notes: '',
  targetWater_ml: 2000,
  actualWater_ml: 0,
  saltSupplementedMg: 0,
  headElevatedSleep: false,
  neckPositionManaged: false,
  emergencyAction: false,
  syncopeCount: 0,
  presyncopeCount: 0
});

const submitForm = () => {
  console.log('Submit Daily Tracking', form.value);
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
</style>
