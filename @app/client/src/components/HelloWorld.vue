<script setup lang="ts">
import { UserQueryVariables, useUserQuery } from "@starter/gql";
import { computed, defineProps, onMounted, ref, watch } from "vue";
import { initializeKeycloak, useKeycloak } from "../plugins/keycloak";

defineProps<{ msg: string }>();

const { keycloak, isAuthenticated, authError } = useKeycloak();

onMounted(async () => {
  await initializeKeycloak();
  if (!isAuthenticated.value) {
    await keycloak.login();
  }
});

const count = ref(0);

// expample usage of graphql composables
const userQueryVariables: UserQueryVariables = {
  id: "1",
};

const { result, error, loading } = useUserQuery(userQueryVariables, {
  fetchPolicy: "network-only",
});

watch(result, () => {
  console.log(result);
});
watch(error, () => {
  console.log(error);
});

const user = computed(() => {
  return result?.data?.user;
});
</script>

<template>
  <h1 class="text-4xl font-bold text-gray-500">{{ isAuthenticated }}</h1>
  <h1 class="text-4xl font-bold text-gray-500">
    {{ keycloak.tokenParsed?.family_name }}
  </h1>
  <h1 class="text-4xl font-bold text-gray-500">
    {{ keycloak.tokenParsed?.given_name }}
  </h1>
  <h1 class="text-4xl font-bold text-gray-500">{{ authError }}</h1>

  <h1 v-if="!loading">{{ user }}</h1>
  <h1 v-if="error">{{ error }}</h1>
  <h1 class="text-4xl font-bold text-gray-500">{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>See <code>README.md</code> for more information.</p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Docs
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
  </p>

  <button type="button" @click="count++">count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
