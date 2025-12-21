<template>
  <div class="home">
    <trainings-view></trainings-view>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.ts";
import TrainingsView from "@/views/TrainingsView.vue";

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await router.push({ name: "login" });
  } else {
    await router.push({ name: "trainings" });
  }
});
</script>

<style scoped></style>
