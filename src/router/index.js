import { createRouter, createWebHashHistory } from "vue-router";
import Index from "../views/Index.vue";

const routes = [
  {
    path: "/",
    name: "",
    component: Index,
  },
  {
    path: "/Market",
    name: "Market",
    component: () => import("../views/Market.vue"),
  },
  {
    path: "/MarketVR",
    name: "MarketVR",
    component: () => import("../views/MarketVR.vue"),
  },
  {
    path: "/Swordfish",
    name: "Swordfish",
    component: () => import("../views/Swordfish.vue"),
  },
  {
    path: "/Pisirian",
    name: "Pisirian",
    component: () => import("../views/Pisirian.vue"),
  },
  {
    path: "/diningTable",
    name: "diningTable",
    component: () => import("../views/DiningTable.vue"),
  },
  {
    path: "/Final",
    name: "Final",
    component: () => import("../views/Final.vue"),
  },
  {
    path: "/Sensor",
    name: "Sensor",
    component: () => import("../views/Sensor.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// router.afterEach(function (to, from, next) {
//   // window.location.reload();
//   next();
// });

export default router;
