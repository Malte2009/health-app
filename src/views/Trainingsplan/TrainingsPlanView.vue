<template>
  <div class="trainingsplan-view">
    <table class="trainingsplan-table">
      <thead>
        <tr>
          <th>Montag</th>
          <th>Dienstag</th>
          <th>Mittwoch</th>
          <th>Donnerstag</th>
          <th>Freitag</th>
          <th>Samstag</th>
          <th>Sonntag</th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.trainingsplan-view {
  margin-top: 20px;
}

.trainingsplan-table {
  width: fit-content;
  border-collapse: collapse;
  margin-top: 20px;
  text-align: center;
  background: var(--bg-surface);
}

.trainingsplan-table td {
  padding: 10px;
  border: 1px solid var(--border);
}

.trainingsplan-table th {
  padding: 10px;
  border: 1px solid var(--border);
  background-color: var(--bg-surface-secondary);
}
</style>
