export default [
  {
    path: "/daily-tracking",
    name: "daily-tracking",
    component: () => import("@/views/Daily/DailyTrackingView.vue")
  },
  {
    path: "/intake-log",
    name: "intake-log",
    component: () => import("@/views/Intake/IntakeLogView.vue")
  },
  {
    path: "/sleep-tracker",
    name: "sleep-tracker",
    component: () => import("@/views/Sleep/SleepTrackerView.vue")
  },
  {
    path: "/vitals",
    name: "vitals",
    component: () => import("@/views/Vitals/VitalsView.vue")
  },
  {
    path: "/symptoms",
    name: "symptoms",
    component: () => import("@/views/Symptoms/SymptomsView.vue")
  },
  {
    path: "/mcas",
    name: "mcas",
    component: () => import("@/views/MCAS/MCASView.vue")
  },
  {
    path: "/hrv",
    name: "hrv",
    component: () => import("@/views/HRV/HrvView.vue")
  },
  {
    path: "/hrv/:id",
    name: "hrvDetails",
    component: () => import("../views/HRV/HrvDetailsView.vue")
  }
];
