import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

import bodyRoutes from "@/router/body.routes.ts";
import trainingRoutes from "@/router/training.routes.ts";
import loginRoutes from "@/router/login.routes.ts";

const routes = [
  ...loginRoutes,
  ...trainingRoutes,
  ...bodyRoutes
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    ...routes
  ],
});

export default router;
