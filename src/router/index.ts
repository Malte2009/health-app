import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuthStore } from "@/stores/authStore.ts";

import bodyRoutes from "@/router/body.routes.ts";
import workoutRoutes from "@/router/workout.routes.ts";
import loginRoutes from "@/router/login.routes.ts";
import exerciseRoutes from "@/router/exercise.routes.ts";
import foodRoutes from "@/router/food.routes.ts";
import healthTrackingRoutes from "@/router/healthTracking.routes.ts";

const routes = [
  ...loginRoutes,
  ...workoutRoutes,
  ...bodyRoutes,
  ...exerciseRoutes,
  ...foodRoutes,
  ...healthTrackingRoutes,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    ...routes,
  ],
});

const PUBLIC_ROUTE_NAMES = new Set(["login", "signup"]);

router.beforeEach(async (to) => {
  const isPublicRoute = to.name ? PUBLIC_ROUTE_NAMES.has(String(to.name)) : false;
  const authStore = useAuthStore();
  const authenticated = await authStore.checkAuthenticated();

  if (!isPublicRoute && !authenticated) {
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
  }

  if (isPublicRoute && authenticated) {
    return { name: "home" };
  }

  return true;
});

export default router;
