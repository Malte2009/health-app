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
      component: () => import("../views/Login/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/Login/SignUpView.vue"),
    },
    {
      path: "/trainings",
      name: "trainings",
      component: () => import("../views/Training/TrainingsView.vue"),
    },
    {
      path: "/training/create",
      name: "createTraining",
      component: () => import("../views/Training/CreateTrainingView.vue"),
    },
    {
      path: "/training/:id",
      name: "training",
      component: () => import("../views/Training/TrainingView.vue"),
      props: true,
    },
    {
      path: "/training/edit/:id",
      name: "editTraining",
      component: () => import("../views/Training/EditTrainingView.vue"),
    },
    {
      path: "/trainingsplan",
      name: "trainingsplan",
      component: () => import("../views/Trainingsplan/TrainingsPlanView.vue"),
    },
  ],
});

export default router;
