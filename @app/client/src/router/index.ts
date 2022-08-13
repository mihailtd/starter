import { createRouter, createWebHistory } from "vue-router";
import { initializeKeycloak, useKeycloak } from "../plugins/keycloak";
import HomeVue from "../views/Home.vue";
import ProtectedVue from "../views/Protected.vue";
const routes = [
  {
    name: "home",
    path: "/",
    component: HomeVue,
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
  console.log(to);
  if (!to.meta.requireAuth) return next();
  const { isAuthenticated, keycloak, ready } = useKeycloak();
  console.log(to);
  console.log(isAuthenticated.value);
  console.log(ready.value);
  if (!ready.value) {
    await initializeKeycloak();
  }

  if (!isAuthenticated.value) {
    console.log(`${window.location.origin}/${to.path}`);
    await keycloak.login({
      redirectUri: `${window.location.origin}/${to.path}`,
    });
  } else {
    return next();
  }
}

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(checkAuth);
