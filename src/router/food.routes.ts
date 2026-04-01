export default [
  {
    path: "/food",
    name: "food",
    component: () => import("../views/Food/FoodDashboardView.vue"),
  },
  {
    path: "/food/progress",
    name: "foodProgress",
    component: () => import("../views/Food/FoodProgressView.vue"),
  },
  {
    path: "/food/manage",
    name: "foodManage",
    component: () => import("../views/Food/FoodManageView.vue"),
  },
  {
    path: "/food/recipes",
    name: "foodRecipes",
    component: () => import("../views/Food/MealRecipesView.vue"),
  },
  {
    path: "/food/goals",
    name: "foodGoals",
    component: () => import("../views/Food/GoalsView.vue"),
  },
];
