<script setup lang="ts">
import { computed, onMounted } from "vue";
import { initializeKeycloak, useKeycloak } from "../plugins/keycloak";
const { keycloak, isAuthenticated } = useKeycloak();

const origin = computed(() => {
  return window.location.origin;
});

onMounted(async () => {
  await initializeKeycloak();
});
</script>

<template>
  <nav class="mb-12 flex w-full bg-orange-300 p-2 pr-4">
    <div class="self-center text-xl font-bold text-blue-500">Logo</div>
    <div class="ml-auto flex w-fit self-center text-xl">
      <span class="mr-2">{{ keycloak.tokenParsed?.given_name }}</span>
      <span>{{ keycloak.tokenParsed?.family_name }}</span>
    </div>
    <div class="ml-auto w-fit">
      <button
        v-if="!isAuthenticated"
        class="mx-2 h-12 w-32 bg-blue-300 hover:bg-blue-100"
        @click="keycloak.login()"
      >
        login
      </button>
      <button
        v-else
        class="mx-2 h-12 w-32 bg-blue-300 hover:bg-blue-100"
        @click="keycloak.logout({ redirectUri: origin })"
      >
        logout
      </button>
    </div>
  </nav>
</template>
