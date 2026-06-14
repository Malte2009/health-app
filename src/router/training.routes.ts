

export default [
  {
    path: "/training",
    name: "training",
    component: () => import("../views/Training/TrainingsView.vue"),
  },
  {
    path: "/training/:id",
    name: "trainingDetails",
    component: () => import("../views/Training/TrainingView.vue"),
  },
  {
    path: "/training/edit/:id",
    name: "editTraining",
    component: () => import("../views/Training/EditTrainingView.vue"),
  },
  {
    path: "/training/createTraining",
    name: "createTraining",
    component: () => import("../views/Training/CreateTrainingView.vue"),
  },
  {
    path: "/training/progression",
    name: "progression",
    component: () => import("../views/ProgressionView.vue"),
  }
];
