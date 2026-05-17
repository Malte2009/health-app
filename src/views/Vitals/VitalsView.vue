<template>
  <div class="vitals">
    <h2>Vitals & Heart Events</h2>

    <h3>Blood Pressure Log</h3>
    <form @submit.prevent="submitBpForm">
      <div class="form-group">
        <label>Timestamp:</label>
        <input type="datetime-local" v-model="bpForm.timestamp" />
      </div>
      <div class="form-group">
        <label>Minutes After Position Change:</label>
        <input type="number" v-model.number="bpForm.minutesAfterPositionChange" />
      </div>

      <div class="form-group">
        <label>Pulse:</label>
        <input type="number" v-model.number="bpForm.pulse" />
      </div>
      <div class="form-group">
        <label>Systolic:</label>
        <input type="number" v-model.number="bpForm.systolic" />
      </div>
      <div class="form-group">
        <label>Diastolic:</label>
        <input type="number" v-model.number="bpForm.diastolic" />
      </div>

      <div class="form-group">
        <label>Position:</label>
        <select v-model="bpForm.position">
          <option value="Lying_Supine">Lying Supine</option>
          <option value="Lying_Lateral">Lying Lateral</option>
          <option value="Sitting">Sitting</option>
          <option value="Standing">Standing</option>
          <option value="Bending_Forward">Bending Forward</option>
          <option value="Transition">Transition</option>
        </select>
      </div>

      <div class="form-group">
        <label>Context:</label>
        <select v-model="bpForm.context">
          <option value="Morning_Rest">Morning Rest</option>
          <option value="Orthostatic_Test">Orthostatic Test</option>
          <option value="Post_Exercise">Post Exercise</option>
          <option value="Routine">Routine</option>
        </select>
      </div>

      <div class="form-group">
        <label>Arm:</label>
        <input type="text" v-model="bpForm.arm" placeholder="Left / Right" />
      </div>
      <div class="form-group">
        <label>Symptoms:</label>
        <input type="text" v-model="bpForm.symptoms" />
      </div>
      <button type="submit">Save Blood Pressure</button>
    </form>

    <hr/>

    <h3>Heart Rate Event</h3>
    <form @submit.prevent="submitHeForm">
      <div class="form-group">
        <label>Timestamp:</label>
        <input type="datetime-local" v-model="heForm.timestamp" />
      </div>
      <div class="form-group">
        <label>Heart Rate:</label>
        <input type="number" v-model.number="heForm.heartRate" />
      </div>
      <div class="form-group">
        <label>Duration (Seconds):</label>
        <input type="number" v-model.number="heForm.durationSeconds" />
      </div>
      <div class="form-group">
        <label>RR Interval (Ms):</label>
        <input type="number" v-model.number="heForm.rrIntervalMs" />
      </div>
      <div class="form-group">
        <label>HRV RMSSD:</label>
        <input type="number" v-model.number="heForm.hrvRMSSD" />
      </div>

      <div class="form-group">
        <label>Context:</label>
        <select v-model="heForm.context">
          <option value="Sleep_Turning">Sleep Turning</option>
          <option value="Orthostatic_Test">Orthostatic Test</option>
          <option value="Post_Exercise">Post Exercise</option>
          <option value="Presyncope">Presyncope</option>
        </select>
      </div>

      <div class="form-group">
        <label>Position Before:</label>
        <select v-model="heForm.positionBefore">
          <option value="Lying_Supine">Lying Supine</option>
          <option value="Sitting">Sitting</option>
          <option value="Standing">Standing</option>
        </select>
      </div>
      <div class="form-group">
        <label>Position After:</label>
        <select v-model="heForm.positionAfter">
          <option value="Lying_Supine">Lying Supine</option>
          <option value="Sitting">Sitting</option>
          <option value="Standing">Standing</option>
        </select>
      </div>
      <button type="submit">Save Heart Event</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const bpForm = ref({
  timestamp: new Date().toISOString().substring(0, 16),
  minutesAfterPositionChange: 0,
  systolic: 120,
  diastolic: 80,
  pulse: 60,
  position: 'Sitting',
  context: 'Routine',
  arm: '',
  symptoms: ''
});

const heForm = ref({
  timestamp: new Date().toISOString().substring(0, 16),
  heartRate: 100,
  durationSeconds: 0,
  rrIntervalMs: 0,
  hrvRMSSD: 0,
  context: 'Presyncope',
  positionBefore: 'Sitting',
  positionAfter: 'Standing'
});

const submitBpForm = () => {
  console.log('Submit BP', bpForm.value);
};

const submitHeForm = () => {
  console.log('Submit Heart Event', heForm.value);
};
</script>

<style scoped>
.form-group { margin-bottom: 1rem; }
</style>
