<template>
  <NavBar v-if="showNavBar"></NavBar>
  <RouterView @loginSuccess="showNavBar = true"/>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";

import { onMounted, ref } from "vue";
import { isAuthenticated } from "@/services/authService.ts";
import NavBar from "@/components/General/NavBar.vue";
import { useTypeStore } from "@/stores/type.ts";

const typeStore = useTypeStore();

const showNavBar = ref(false);

function setViewport(scale: number) {
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement("meta");
    document.head.appendChild(viewport);
  }
  viewport.setAttribute("content", `width=device-width, initial-scale=${scale}, maximum-scale=3.0, user-scalable=yes`);
}

onMounted(async () => {
  setViewport(window.innerWidth <= 768 ? 0.59 : 1);
  if (await isAuthenticated()) {
    await typeStore.loadTypes();
    showNavBar.value = true;
  }
});
</script>

<style scoped></style>
