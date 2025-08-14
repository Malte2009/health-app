<template>
  <div class="home">
    <trainings-view></trainings-view>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.ts";
import TrainingsView from "@/views/Training/TrainingsView.vue";

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
