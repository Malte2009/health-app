

export default [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login/LoginView.vue"),
  },
  {
    path: "/login/signup",
    name: "signup",
    component: () => import("../views/Login/SignUpView.vue"),
  },
];
