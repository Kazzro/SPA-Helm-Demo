<script setup lang="ts">
import { useNoteStore } from "@/stores/notesStore";
import { RouterLink } from "vue-router";

const noteStore = useNoteStore();
</script>

<template>
  <div class="container">
    <div class="correspondents">
      <ul>
        <li class="item">
          <RouterLink to="/">Quicktasks</RouterLink>
        </li>
        <li v-for="correspondent in noteStore.correspondentList" class="item">
          <RouterLink :to="`/specific/${correspondent}`">
            {{ correspondent }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.correspondents {
  margin: 20px auto;
}

@counter-style space-counter {
  system: cyclic;
  symbols: "\1F4DC""\1F5D2""\1F4C3""\1F4C4";
  suffix: " ";
}

.item {
  font-size: large;
  list-style-type: space-counter;
}
.container {
  width: 200px;
  height: 100%;
  margin-left: auto;
  overflow: hidden;
  display: flex;
}
</style>
@/stores/notesStore