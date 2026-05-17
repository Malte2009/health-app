<template>
  <div class="intake-log">
    <h2>Intake Log</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>Timestamp:</label>
        <input type="datetime-local" v-model="form.timestamp" />
      </div>

      <div class="form-group">
        <label>Beverage Type:</label>
        <select v-model="form.beverageType">
          <option value="Water">Wasser</option>
          <option value="Electrolytes">Elektrolyte</option>
          <option value="Tea">Tee</option>
          <option value="Coffee">Kaffee</option>
          <option value="Other">Andere</option>
        </select>
      </div>

      <div class="form-group">
        <label>Water (ml):</label>
        <input type="number" v-model.number="form.water_ml" />
      </div>
      <div class="form-group">
        <label>Other Fluid (ml):</label>
        <input type="number" v-model.number="form.otherFluid_ml" />
      </div>

      <div class="form-group">
        <label>Salt Source:</label>
        <select v-model="form.saltSource">
          <option value="Tablet">Tablette</option>
          <option value="Powder">Elektrolyt-Pulver</option>
          <option value="ExtraSalt">Zusätzliches Salz</option>
          <option value="None">Keine</option>
        </select>
      </div>
      <div class="form-group">
        <label>Salt (mg):</label>
        <input type="number" v-model.number="form.saltMg" />
      </div>

      <div class="form-group">
        <label>Caffeine (mg):</label>
        <input type="number" v-model.number="form.caffeine_mg" />
      </div>
      <div class="form-group">
        <label>Alcohol (g):</label>
        <input type="number" v-model.number="form.alcohol_g" />
      </div>

      <div class="form-group">
        <label>Notes:</label>
        <input type="text" v-model="form.notes" />
      </div>

      <button type="submit">Save Intake</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const form = ref({
  timestamp: new Date().toISOString().substring(0, 16),
  beverageType: 'Water',
  water_ml: 0,
  otherFluid_ml: 0,
  saltSource: 'None',
  saltMg: 0,
  caffeine_mg: 0,
  alcohol_g: 0,
  notes: ''
});

const submitForm = () => {
  console.log('Submit Intake Log', form.value);
};
</script>

<style scoped>
.form-group { margin-bottom: 1rem; }
</style>
