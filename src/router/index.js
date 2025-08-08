import { createRouter, createWebHistory } from "vue-router";

import { handleRouteGuard } from "./router.guard";
import routerAuth from "./router.auth";
import routerPanel from "./router.panel";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "active",
  linkExactActiveClass: "active",
  routes: [
    routerAuth,
    routerPanel,
    {
      path: "/:pathMatch(.*)*",
      component: () => import("@/pages/errors/PageNotFound.vue"),
    },
  ],
});

router.beforeEach(handleRouteGuard);

export default router;
