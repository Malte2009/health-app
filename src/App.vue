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

const router = useRouter();
const authStore = useAuthStore();

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

    if (router.currentRoute.value.name === "/home") await router.push({ name: "trainings" });
    if (router.currentRoute.value.name === "/") await router.push({ name: "trainings" });
    if (router.currentRoute.value.name === "/login") await router.push({ name: "trainings" });
  } else {
    await router.push({ name: "login" });
  }
});
</script>

<style scoped></style>
