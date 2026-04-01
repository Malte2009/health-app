<template>
  <div class="exerciseView">
    <h1>Exercise View</h1>

    <div class="exercise">
      <h2>Main Panel</h2>
    </div>
    <div class="chart">
      <h2>Chart Panel</h2>

      <Chart :width="width" :height="height"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from "@/components/General/Chart.vue";
import { onBeforeMount, ref } from "vue";

const width = ref(0);
const height = ref(0);

onBeforeMount(() => {
  width.value = window.innerWidth * 0.8;
  height.value = window.innerHeight * 0.6;
});
</script>

<style scoped></style>
