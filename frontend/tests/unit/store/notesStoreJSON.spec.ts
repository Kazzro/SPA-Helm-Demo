import { createPinia, setActivePinia } from "pinia";
import { createApp } from "vue";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createTestingPinia } from "@pinia/testing";

import { useNoteStore } from "../../../src/stores/notesStoreJSON";
//import { notesService } from "../../../src/notesService";
import { useUserStore } from "../../../src/stores/usersStoreJSON";
//import { NoteType } from "../../../src/store/mainStore";

describe("notesStore", () => {
  let noteStore;
  let userStore;
  const app = createApp({});
  const pinia = createPinia();
  app.use(pinia);

  beforeEach(async () => {
    setActivePinia(createTestingPinia({ stubActions: false }));
    noteStore = useNoteStore();
    userStore = useUserStore();

    // nicht schön, ordentlich mocken!
    /*notesService.getAllNotes = () =>
      Promise.resolve([
        { id: 1, title: "", content: [], author: "tester", type: "self" },
      ]);*/

    vi.mock("../../../src/notesService", () => ({
      notesService: {
        getAllNotes: () =>
          Promise.resolve([
            {
              id: 1,
              title: "",
              content: [],
              author: "tester",
              type: "self",
            },
          ]),
      },
    }));
  });

  afterEach(() => {
    noteStore.notes = [];
  });

  it("doesn't explode", () => {
    expect(noteStore.notes.length).toBe(0);
  });

  it("loads notes", () => {
    userStore.user = {
      id: 5,
      uuid: "string",
      username: "tester",
      email: "a@b.c",
      password: "123",
    };
    noteStore.getNotes();
    expect(noteStore.notes.length).toBe(1);
  });

  it("lets create note", () => {
    noteStore.createNote({
      id: 2,
      title: "",
      content: [],
      author: "tester",
      type: "self",
    });

    expect(noteStore.notes.length).toBe(1);
  });
});
