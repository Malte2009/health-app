
export default [
  {
    path: "/exercise",
    name: "exercise",
    component: () => import("../views/Exercise/ExercisesView.vue"),
  },
  {
    path: "/exercise/:name",
    name: "exerciseDetails",
    component: () => import("../views/Exercise/ExerciseView.vue"),
  },
  {
    path: "/exercise/edit/:name",
    name: "editExercise",
    component: () => import("../views/Exercise/EditExerciseLogView.vue"),
  },
]
