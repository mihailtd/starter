<script setup lang="ts">
import {
  CreateUserInput,
  useCreateUserMutation,
  useUserQuery,
} from "@starter/gql";
import { computed, ref, watch } from "vue";
import NavBarVue from "./components/NavBar.vue";
import { useKeycloak } from "./plugins/keycloak";
const { ready, isAuthenticated, keycloak } = useKeycloak();

const sub = ref();

const params = computed(() => {
  return {
    id: sub.value,
  };
});
const { onResult } = useUserQuery(params);
const { mutate } = useCreateUserMutation({});

watch(isAuthenticated, () => {
  if (isAuthenticated) {
    sub.value = keycloak.idTokenParsed?.sub;
  }
});

onResult((result) => {
  if (!result.loading && !result.data?.user) {
    const input: CreateUserInput = {
      user: {
        id: keycloak.idTokenParsed?.sub,
        email: keycloak.idTokenParsed?.email,
      },
    };
    mutate({
      input,
    });
  }
});
</script>

<template>
  <div v-loading.fullscreen.lock="!ready">
    <NavBarVue />
    <router-view></router-view>
  </div>
</template>
