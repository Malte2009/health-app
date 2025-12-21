<template>
  <NavBar v-if="authStore.isAuthenticated"></NavBar>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";

import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.ts";
import { isAuthenticated } from "@/services/authService.ts";
import NavBar from "@/components/General/NavBar.vue";
import { useTypeStore } from "@/stores/type.ts";
import { useTrainingStore } from "@/stores/training.ts";

const router = useRouter();
const authStore = useAuthStore();
const typeStore = useTypeStore();
const trainingsStore = useTrainingStore();

function setViewport(scale: number) {
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement("meta");
    document.head.appendChild(viewport);
  }
  viewport.setAttribute("content", `width=device-width, initial-scale=${scale}, maximum-scale=3.0, user-scalable=yes`);
}

onMounted(async () => {
  const token = await isAuthenticated();
  setViewport(window.innerWidth <= 768 ? 0.59 : 1);
  if (token) {
    authStore.setToken(token);
    await typeStore.loadTypes();
    await trainingsStore.loadTrainings();
  } else {
    await router.push({ name: "login" });
  }
});
</script>

<style scoped></style>
