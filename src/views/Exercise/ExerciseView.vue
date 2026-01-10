<template>
  <div class="exerciseView">
    <h1>Exercise View</h1>

    <div class="exercise">
      <h2>Main Panel</h2>
    </div>
    <div class="chart">
      <h2>Chart Panel</h2>

      <Chart :chart-data="chartData" :width="width" :height="height"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from "@/components/General/Chart.vue";
import { useExerciseStore } from "@/stores/exerciseStore.ts";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { getExerciseScoresByName } from "@/services/exerciseScoreService.ts";

const route = useRoute();

const chartData = ref({
  xData: [] as string[],
  yData: [] as number[],
});

const width = ref(0);
const height = ref(0);

onBeforeMount(() => {
  width.value = window.innerWidth * 0.8;
  height.value = window.innerHeight * 0.6;
})
</script>

<style scoped></style>
