<template>
  <div class="mcas-log">
    <h2>MCAS / Allergy Reactions</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>Reaction Type:</label>
        <select v-model="form.reactionType">
          <option value="Flush">Flush</option>
          <option value="Urticaria">Urticaria</option>
          <option value="GI_Symptoms">GI Symptoms</option>
          <option value="Respiratory">Respiratory</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div class="form-group">
        <label>Severity (1-10):</label>
        <input type="range" min="1" max="10" v-model.number="form.severity" /> {{ form.severity }}
      </div>

      <div class="form-group">
        <label>Timestamp:</label>
        <input type="datetime-local" v-model="form.timestamp" />
      </div>
      <div class="form-group">
        <label>Onset Minutes:</label>
        <input type="number" v-model.number="form.onsetMinutes" />
      </div>
      <div class="form-group">
        <label>Duration Minutes:</label>
        <input type="number" v-model.number="form.durationMinutes" />
      </div>

      <div class="form-group">
        <label>Suspected Food:</label>
        <input type="text" v-model="form.suspectedFood" />
      </div>
      <div class="form-group">
        <label>Hours Since Meal:</label>
        <input type="number" step="0.1" v-model.number="form.hoursSinceMeal" />
      </div>

      <div class="form-group">
        <label><input type="checkbox" v-model="form.histamineRichFood" /> Histamine Rich Food</label>
      </div>
      <div class="form-group">
        <label><input type="checkbox" v-model="form.additiveRich" /> Additive Rich</label>
      </div>
      <div class="form-group">
        <label><input type="checkbox" v-model="form.ultraProcessed" /> Ultra Processed</label>
      </div>

      <button type="submit">Save MCAS Reaction</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const form = ref({
  reactionType: 'Flush',
  severity: 5,
  timestamp: new Date().toISOString().substring(0, 16),
  onsetMinutes: 0,
  durationMinutes: 0,
  suspectedFood: '',
  hoursSinceMeal: 0,
  histamineRichFood: false,
  additiveRich: false,
  ultraProcessed: false
});

const submitForm = () => {
  console.log('Submit MCAS Reaction', form.value);
};
</script>

<style scoped>
.form-group { margin-bottom: 1rem; }
</style>
