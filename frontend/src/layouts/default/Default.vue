<script lang="ts" setup>
import { onMounted } from "vue";
import DefaultBar from "@/components/AuthBar.vue";
import DefaultView from "./View.vue";
import { useUserStore } from "@/stores/usersStore";



onMounted(() => {
  const userStore = useUserStore();
  userStore.getUser();
});
</script>

<template>
  <v-app>
    <default-bar />
    <default-view />
  </v-app>
</template>

