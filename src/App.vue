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

onMounted(async () => {
  const token = await isAuthenticated();
  if (token) {
    authStore.setToken(token);
  } else {
    await router.push({ name: "login" });
  }
});
</script>

<style scoped></style>
