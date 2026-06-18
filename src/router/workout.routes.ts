

export default [
  {
    path: "/workouts",
    name: "workouts",
    component: () => import("../views/Workout/WorkoutsView.vue"),
  },
  {
    path: "/workouts/edit/:id",
    name: "editWorkout",
    component: () => import("../views/Workout/EditWorkoutView.vue"),
  },
  {
    path: "/workouts/create",
    name: "createWorkout",
    component: () => import("../views/Workout/CreateWorkoutView.vue"),
  },
  {
    path: "/workouts/progression",
    name: "progression",
    component: () => import("../views/ProgressionView.vue"),
  },
  {
    path: "/workouts/:id",
    name: "workoutDetails",
    component: () => import("../views/Workout/WorkoutView.vue"),
  }
];
