<script setup lang="ts">
import { computed } from "vue";
import Avatar from "vue-boring-avatars";
import { useRouter } from "vue-router";

const { currentRoute } = useRouter();

const origin = computed(() => {
  return window.location.origin;
});

const displayName = computed(() => {
  return "";
});
</script>

<template>
  <nav class="mb-12 grid w-full grid-cols-3 bg-orange-300 p-2 pr-4">
    <router-link v-slot="{ navigate, href, route }" class="w-fit" to="/" custom>
      <ElLink
        :underline="false"
        class="ml-8 w-fit text-xl font-bold text-red-600 duration-200 hover:text-red-500"
        :href="href"
      >
        Logo
      </ElLink>
    </router-link>
    <div class="flex w-full justify-center self-center">
      <div
        class="flex w-fit cursor-pointer items-center justify-center rounded-full bg-red-600 text-xl text-white shadow-sm duration-200 hover:bg-red-500 hover:shadow-lg"
      >
        <div class="mx-4 self-center">{{ displayName }}</div>
        <Avatar :size="30" variant="bauhaus" :name="displayName" />
      </div>
    </div>
    <div class="flex w-full justify-end self-center">
      <ElLink
        :underline="false"
        class="bg-red-6000 mx-2 h-12 w-32 bg-red-600 text-white duration-200 hover:bg-red-500 hover:text-white hover:shadow-md"
      >
        login
      </ElLink>
      <router-link
        v-if="!currentRoute.name?.toString().startsWith('dashboard')"
        v-slot="{ navigate, href, route }"
        to="/dashboard"
        custom
      >
        <ElLink
          :underline="false"
          class="bg-red-6000 mx-2 h-12 w-32 bg-red-600 text-white duration-200 hover:bg-red-500 hover:text-white hover:shadow-md"
          :href="href"
        >
          dashboard
        </ElLink>
      </router-link>
      <ElLink
        :underline="false"
        class="bg-red-6000 mx-2 h-12 w-32 bg-red-600 text-white duration-200 hover:bg-red-500 hover:text-white hover:shadow-md"
      >
        logout
      </ElLink>
    </div>
  </nav>
</template>
