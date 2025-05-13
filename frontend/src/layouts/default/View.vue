<script lang="ts" setup>
//
import { storeToRefs } from "pinia";
import ContainerCenter from "../container/ContainerCenter.vue";
import ContainerLeft from "../container/ContainerLeft.vue";
import ContainerRight from "../container/ContainerRight.vue";
import { useUserStore } from "@/stores/usersStore";

const userStore = useUserStore();
const { username } = storeToRefs(userStore);
</script>

<template>
  <v-main>
    <div class="container">
      <ContainerLeft v-if="username != ''" />
      <ContainerCenter>
        <router-view :key="$route.path" />
      </ContainerCenter>
      <ContainerRight v-if="username != ''" />
    </div>
  </v-main>
</template>

<style scoped>
.container {
  display: flex;
  height: 100%;
}
</style>
