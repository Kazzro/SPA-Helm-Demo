<script setup lang="ts">
import { ref } from "vue";
const { title } = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
});
const openModal = ref(true);

const emit = defineEmits<{
  (e: "ok"): void;
  (e: "cancel"): void;
}>();

const emitOK = () => {
  emit("ok");
};

const emitCancel = () => {
  emit("cancel");
  openModal.value = false;
};
</script>

<template>
  <Teleport to="#app">
    <Transition>
      <div v-if="open" class="modal">
        <h1 data-test="title" class="title">{{ title }}</h1>
        <div data-test="content" class="content">
          <slot />
        </div>
        <div class="footer">
          <button
            data-test="cancelButton"
            key="cancel"
            class="button cancel"
            @click="emitCancel()"
          ></button>
          <button
            data-test="submitButton"
            key="submit"
            class="button submit"
            @click="emitOK()"
          ></button>
        </div>
      </div>
    </Transition>
  </Teleport>
  <!--<a-modal
    :title="title"
    centered
    clickable
    :closable="false"
    v-bind:open="open"
  >
    <template #footer>
      <div class="footer">
        <button
          data-test="cancelButton"
          key="cancel"
          class="button cancel"
          @click="emitCancel()"
        ></button>
        <button
          data-test="submitButton"
          key="submit"
          class="button submit"
          @click="emitOK()"
        ></button>
      </div>
    </template>
    <slot />
  </a-modal>-->
</template>

<style scoped>
@import "/src/styles/modal.css";
</style>
