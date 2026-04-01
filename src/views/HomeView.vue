<template>
  <div class="home"></div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { isAuthenticated } from "@/services/authService.ts";

const router = useRouter();

onMounted(async () => {
  if (await isAuthenticated()) {
    await router.push({ name: "training" });
  } else {
    await router.push({ name: "login" });
  }
});
</script>

<style scoped></style>
