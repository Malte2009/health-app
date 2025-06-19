<template>
  <div class="home">
    <h1>Welcome to the Home Page</h1>
    <create-training></create-training>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.ts";
import CreateTraining from "@/components/Training/createTraining.vue";

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  if (!authStore.isAuthenticated) {
    console.log(2);
    router.push({ name: "login" });
  }
});
</script>

<style scoped></style>
