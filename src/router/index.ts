import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/SignUpView.vue"),
    },
    {
      path: "/trainings",
      name: "trainings",
      component: () => import("../views/TrainingsView.vue"),
    },
    {
      path: "/training/create",
      name: "createTraining",
      component: () => import("../views/CreateTrainingView.vue"),
    },
    {
      path: "/training/:id",
      name: "training",
      component: () => import("../views/TrainingView.vue"),
      props: true,
    },
  ],
});

export default router;
