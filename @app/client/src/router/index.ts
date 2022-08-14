import { createRouter, createWebHistory } from "vue-router";
import AuthVue from "../views/Auth.vue";
import HomeVue from "../views/Home.vue";
import ProtectedVue from "../views/Protected.vue";

const routes = [
  {
    name: "home",
    path: "/",
    component: HomeVue,
  },
  {
    name: "login",
    path: "/login",
    component: AuthVue,
  },
  {
    name: "dashboard",
    path: "/dashboard",
    component: ProtectedVue,
    meta: {
      requireAuth: true,
    },
  },
];

async function checkAuth(to, _from, next) {
  return next();
}

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(checkAuth);
