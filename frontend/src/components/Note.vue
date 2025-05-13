<script setup lang="ts">
import { Content } from "../stores/notesStore";

const { type, content, title, author, correspondent } = defineProps<{
  type: string;
  content?: Content[];
  title?: string;
  author?: string;
  correspondent?: string;
}>();
</script>

<template>
  <div :class="`card ${type}`">
    <div class="innersquare">
      <svg
        width="92"
        height="81"
        viewBox="0 0 92 81"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="92" height="81" fill="#D9D9D9" />
        <rect x="13" y="35" width="66" height="10" fill="black" />
        <rect x="41" y="7" width="10" height="66" fill="black" />
      </svg>
    </div>

    <div class="title">
      <p>{{ title }}</p>
    </div>
    <div class="content">
      <div v-for="(task, index) in content" :key="index">
        <p :class="`task-${task.status}`">{{ task.task }}</p>
      </div>
    </div>
    <div class="author">
      <p>From: {{ author }}</p>
    </div>
    <div class="user">
      <p>to: {{ correspondent }}</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 210px;
  height: 295px;
  overflow: hidden;
  border-radius: 10px;
  border: rgba(0, 0, 0, 0.08) solid 1.5px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2), 0 4px 20px 0 rgba(0, 0, 0, 0.19);
}

.card.create {
  background: #a2a2a2;
}

.card.send {
  background: #7ee2ff;
}

.card.received {
  background: #ff7ee2;
}

.task-true {
  text-decoration: line-through;
}

.card.self {
  background: #e2ff7e;
}

.card.group {
  background: #9a7eff;
}
.innersquare {
  display: none;
}

.title {
  justify-content: center;
  height: 10%;
  display: none;
  overflow: hidden;
}

.content {
  height: 80%;
  margin-inline: 10px;
  overflow: hidden;
  display: none;
  flex-wrap: wrap;
  flex-direction: column;
}

.author,
.user {
  margin-right: 10px;
  height: 10%;
  justify-content: end;
  display: none;
}

.create .innersquare {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.send .title,
.send .content,
.send .user {
  display: flex;
}

.received .title,
.received .content,
.received .author {
  display: flex;
}

.self .title,
.self .content {
  display: flex;
}
</style>
