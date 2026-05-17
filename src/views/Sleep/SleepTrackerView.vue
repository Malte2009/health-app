<template>
  <div class="sleep-tracker">
    <h2>Sleep Tracker</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>Date:</label>
        <input type="date" v-model="form.date" />
      </div>
      <div class="form-group">
        <label>Bed Time:</label>
        <input type="time" v-model="form.bedTime" />
      </div>
      <div class="form-group">
        <label>Wake Time:</label>
        <input type="time" v-model="form.wakeTime" />
      </div>

      <div class="form-group">
        <label>Sleep Latency (Minutes):</label>
        <input type="number" v-model.number="form.sleepLatencyMinutes" />
      </div>
      <div class="form-group">
        <label>Wake Episodes:</label>
        <input type="number" v-model.number="form.wakeEpisodes" />
      </div>
      <div class="form-group">
        <label>Subjective Hours:</label>
        <input type="number" step="0.1" v-model.number="form.subjectiveHours" />
      </div>

      <div class="form-group">
        <label>Rested Score (1-10):</label>
        <input type="range" min="1" max="10" v-model.number="form.restedScore" /> {{ form.restedScore }}
      </div>

      <div class="form-group">
        <label><input type="checkbox" v-model="form.morningHeadache" /> Morning Headache</label>
      </div>
      <div class="form-group">
        <label><input type="checkbox" v-model="form.morningDizziness" /> Morning Dizziness</label>
      </div>

      <h3>Smartwatch Data (Read-only / Import)</h3>
      <div class="form-group">
        <label>Total Sleep Minutes:</label>
        <input type="number" v-model.number="form.totalSleepMinutes" />
      </div>
      <div class="form-group">
        <label>Awake Minutes:</label>
        <input type="number" v-model.number="form.awakeMinutes" />
      </div>
      <div class="form-group">
        <label>Light Sleep Minutes:</label>
        <input type="number" v-model.number="form.lightSleepMinutes" />
      </div>
      <div class="form-group">
        <label>Deep Sleep Minutes:</label>
        <input type="number" v-model.number="form.deepSleepMinutes" />
      </div>
      <div class="form-group">
        <label>REM Sleep Minutes:</label>
        <input type="number" v-model.number="form.remSleepMinutes" />
      </div>
      <div class="form-group">
        <label>Turning Spike Count:</label>
        <input type="number" v-model.number="form.turningSpikeCount" />
      </div>
      <div class="form-group">
        <label>Turning Spike Max HR:</label>
        <input type="number" v-model.number="form.turningSpikeMaxHr" />
      </div>

      <button type="submit">Save Sleep</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const form = ref({
  date: new Date().toISOString().substring(0, 10),
  bedTime: '22:00',
  wakeTime: '07:00',
  sleepLatencyMinutes: 15,
  wakeEpisodes: 0,
  subjectiveHours: 8,
  restedScore: 5,
  morningHeadache: false,
  morningDizziness: false,
  totalSleepMinutes: 0,
  awakeMinutes: 0,
  lightSleepMinutes: 0,
  deepSleepMinutes: 0,
  remSleepMinutes: 0,
  turningSpikeCount: 0,
  turningSpikeMaxHr: 0
});

const submitForm = () => {
  console.log('Submit Sleep Log', form.value);
};
</script>

<style scoped>
.form-group { margin-bottom: 1rem; }
</style>
