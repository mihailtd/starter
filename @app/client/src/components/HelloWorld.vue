<script setup lang="ts">
import { UserQueryVariables, useUserQuery } from "@starter/gql";
import { computed, ref } from "vue";

import NavBar from "./NavBar.vue";

const count = ref(0);

// expample usage of graphql composables
const userQueryVariables: UserQueryVariables = {
  id: "1",
};

const { result, error, loading } = useUserQuery(userQueryVariables, {
  fetchPolicy: "network-only",
});

const user = computed(() => {
  return result?.data?.user;
});
</script>

<template>
  <NavBar />

  <h1 v-if="!loading">{{ user }}</h1>
  <h1 v-if="error">{{ error }}</h1>
  <h1 class="text-4xl font-bold text-gray-500">
    Hello Vue 3 + TypeScript + Vite + TailwindCSS
  </h1>

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
