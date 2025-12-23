<template>
  <div class="home"></div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.ts";

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
