<template>
  <h1 class="text-xl font-bold">Protected Route</h1>
  {{ JSON.stringify(user) }}
</template>

<script setup lang="ts">
import { useUserQuery } from "@starter/gql";
import { computed } from "vue";
import { useKeycloak } from "../plugins/keycloak";
const { tokenParsed } = useKeycloak();

const params = computed(() => {
  return {
    id: tokenParsed.value.sub,
  };
});

const { result } = useUserQuery(params);
const user = computed(() => {
  return result.value?.user;
});
</script>
