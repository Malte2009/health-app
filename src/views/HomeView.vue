<template>
  <div class="home"></div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.ts";

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  if (!authStore.isAuthenticated) {
    console.log(2);
    router.push({ name: "login" });
  }

  router.push({ path: "/trainings" });
});
</script>

<style scoped></style>
