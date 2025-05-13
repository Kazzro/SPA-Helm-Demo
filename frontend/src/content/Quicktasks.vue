<script setup lang="ts">
import { ref, watch, Ref} from "vue";
import { useUserStore} from "@/stores/usersStore";
import {useNoteStore, NoteType } from "@/stores/notesStore";
import { storeToRefs } from "pinia";
import ModalTemplate from "../components/ModalTemplate.vue";
import Note from "../components/Note.vue";


const userStore = useUserStore();
const { username, loadingUser, userList } = storeToRefs(userStore);
const modalNote: Ref<NoteType> = ref({
  id: `00000-00000-00000-00000-00000`,
  author: "unsigned",
  type: "self",
  correspondent: undefined,
  title: "",
  content: [],
});

watch(loadingUser, () => {
  if (username.value != "") {
    modalNote.value.author = username.value;
  } else {
    modalNote.value.author = "unsigned";
  }
});

const noteStore = useNoteStore();
const newContent = ref("");

const showNoteModal = ref(false);
const showModifyModal = ref(false);
const showDeleteModal = ref(false);

const { notes } = storeToRefs(noteStore);

const createNewNoteStart = async () => {
  modalNote.value.correspondent = undefined;
  modalNote.value.title = "";
  modalNote.value.content = [];
  newContent.value = "";

  if (username.value) {
    modalNote.value.author = username.value;
  } else {
    modalNote.value.author  = "unsigned";
  }

  showNoteModal.value = true;
};

const createNote = async () => {
  
  if (modalNote.value.correspondent?.trim()) {
    modalNote.value.type = "send";
  } else {
    modalNote.value.type = "self";
  }

  const reg = /([-]|^)(.*?)(?=[-]|$|[\r\n])/g;
  const matches = Array.from(newContent.value.matchAll(reg), (content) => ({
    task: content[2],
  }));

  matches.forEach((match) => {
    modalNote.value.content.push({ task: match.task, status: false });
  });

  const noteStore = useNoteStore();
  await noteStore.createNote(modalNote.value);

  closeModal();
};

const modifyNoteStart = (i: number) => {
  modalNote.value = JSON.parse(JSON.stringify(notes.value[i]));

  showModifyModal.value = true;
  showNoteModal.value = true;
};

const modifyNote = async () => {
  await noteStore.modifyNote(modalNote.value);
  await noteStore.getNotes();
  closeModal();
};

const deleteNote = async () => {
  await noteStore.deleteNote(modalNote.value);
  await noteStore.getNotes();
  closeModal();
};
const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const closeModal = () => {
  modalNote.value.correspondent = undefined;
  modalNote.value.title = "";
  modalNote.value.content = [];
  newContent.value = "";
  showNoteModal.value = false;
  showModifyModal.value = false;
  showDeleteModal.value = false;
};
</script>

<template>
  <ModalTemplate
    :open="showNoteModal"
    :title="showModifyModal ? 'Modify note' : 'Create note'"
    @ok="showModifyModal ? modifyNote() : createNote()"
    @cancel="closeModal()"
  >
    <div class="horizontalbar">
      <v-text-field
        :disabled="modalNote.type === 'received'"
        label="Title"
        data-test="titleField"
        v-model.trim="modalNote.title"
        placeholder="Title..."
      ></v-text-field>
      <v-btn
        class="mod"
        v-if="showModifyModal"
        :disabled="modalNote.type === 'received'"
        data-test="deleteButton"
        icon="mdi-delete-outline"
        variant="text"
        @click="showDeleteModal = true"
      ></v-btn>
      <ModalTemplate
        title="delete Note"
        :open="showDeleteModal"
        @ok="deleteNote()"
        @cancel="closeDeleteModal()"
      >
        <h1>Are you sure?</h1>
      </ModalTemplate>
    </div>
    <v-autocomplete
      v-if="username "
      :items="userList"
      :disabled="modalNote.type === 'received'"
      data-test="correspondentField"
      label="optional: User"
      v-model="modalNote.correspondent"
      placeholder="to..."
    ></v-autocomplete>
    <v-textarea
      label="Content..."
      v-if="!showModifyModal"
      class="mod"
      v-model.trim="newContent"
      placeholder="- buy groceries..."
      hint="seperate rows by - "
    ></v-textarea>
    <div
      class="horizontalbar"
      v-else
      v-for="(content, index) in modalNote.content"
      :key="index"
    >
      <div>
        <v-checkbox v-model="content.status"></v-checkbox>
      </div>
      <v-text-field
        :disabled="content.status || modalNote.type === 'received'"
        v-model.trim="content.task"
      />
    </div>
  </ModalTemplate>

  <div class="container">
    <Note
      v-for="(note, index) in notes"
      data-test="contentNote"
      :key="note.id"
      :type="note.type"
      :title="note.title"
      :content="note.content"
      :correspondent="note.correspondent ? note.correspondent : undefined "
      :author="note.author"
      @click="modifyNoteStart(index)"
    ></Note>
    <Note
      data-test="createNote"
      :type="'create'"
      @click="createNewNoteStart()"
    ></Note>
  </div>
</template>

<style scoped>
@import url("@/styles/tasks.css");
</style>
