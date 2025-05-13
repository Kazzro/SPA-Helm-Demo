<script setup lang="ts"></script>

<template>
  <div class="container">
    <slot />
  </div>
</template>

<style scoped>
.container {
  margin: 0 auto;
  width: 1000px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.26);
}
</style>
