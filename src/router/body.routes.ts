
export default [
  {
    path: "/body",
    name: "body",
    component: () => import("../views/Body/BodyView.vue"),
  },
  {
    path: "/body/createBodyLog",
    name: "createBodyLog",
    component: () => import("../views/Body/CreateBodyLogView.vue"),
  },
  {
    path: "/body/editBodyLog/:id",
    name: "editBodyLog",
    component: () => import("../views/Body/EditBodyLogView.vue"),
  }
];
