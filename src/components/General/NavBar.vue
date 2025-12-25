<template>
  <div class="navbar">
    <div class="start"></div>
    <div class="middle">
      <button :class="{ active: route.name === 'trainings' }" @click="router.push('/trainings')">Trainings Overview</button>
      <button :class="{ active: route.name === 'body' }" @click="router.push('/body')">Body Overview</button>
    </div>
    <div class="end"></div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";

const router = useRouter();
const route = useRoute();

onMounted(() => {
  console.log(route.name);
});
</script>
<style scoped>
.active {
  background: #1c2839 !important;
  color: #90caf9 !important;
  box-shadow: 0 2px 8px 0 rgba(70, 130, 230, 0.13) !important;
}

.navbar button {
  background: #32363a;
  color: #e0e0e0;
  border: none;
  border-radius: 10px;
  font-size: 1.08rem;
  font-weight: 600;
  cursor: pointer;
  margin: 0 6px;
  transition:
    background 0.18s,
    color 0.18s,
    box-shadow 0.18s;
  outline: none;
  position: relative;
  height: 40px;
  padding: 0 16px;
}

.navbar {
  width: 100%;
  height: 50px;
  background-color: var(--bg-surface);
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.start {
  width: 33.33%;
  display: flex;
}

.middle {
  width: 33.33%;
  display: flex;
  justify-content: center;
}

.end {
  width: 33.33%;
  display: flex;
  justify-content: flex-end;
}
</style>
