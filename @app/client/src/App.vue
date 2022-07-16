<script setup lang="ts">
import NavBarVue from "./components/NavBar.vue";
import { useKeycloak } from "./plugins/keycloak";
const { ready } = useKeycloak();
</script>

<template>
  <div v-loading.fullscreen.lock="!ready">
    <NavBarVue />
    <router-view></router-view>
  </div>
</template>
