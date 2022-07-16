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
    beforeEnter: [checkAuth],
    component: ProtectedVue,
  },
];

function checkAuth(to, _from, next) {
  const { isAuthenticated, keycloak, ready } = useKeycloak();
  if (!ready.value) {
    initializeKeycloak().then(() => {
      if (!isAuthenticated.value) {
        return keycloak.login({
          redirectUri: `${window.location.origin}${to.path}`,
        });
      } else {
        return next();
      }
    });
  }
}

export default createRouter({
  history: createWebHistory(),
  routes,
});
