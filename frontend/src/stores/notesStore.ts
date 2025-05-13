import { defineStore, storeToRefs } from "pinia";
import { useUserStore } from "../stores/usersStore";
import { notesService } from "@/services/notesService";
import router from "@/router";
import Specifictasks from "@/content/Specifictasks.vue";
import { useAuthStore } from "./auth";
import { UUID } from "crypto";

export type Content = {
  task: string;
  status: boolean;
};

export type Note = {
  id: UUID;
  author: string;
  correspondent?: string;
  type: string;
  title: string;
  content: Array<Content>;
};

export type NoteType = Omit<Note, "group">;

export type GroupNoteType = Omit<Note, "correspondent">;

const localNotes: NoteType[] = [];
const correspondentList: string[] = [];
const pushCorrespondent = (correspondent: string) => {
  router.addRoute("home", {
    name: `Specific tasks with ${correspondent}`,
    path: `specific/${correspondent}`,
    component: Specifictasks,
    props: { correspondent: correspondent },
  });
};

export const useNoteStore = defineStore("notes", {
  state: () => ({
    notes: localNotes,
    correspondentList: correspondentList,
  }),
  actions: {
    async getNotes() {
      const token = storeToRefs(useAuthStore())
      const {username} = storeToRefs(useUserStore())
      if (token != null) {
        const notes: NoteType[] = await notesService.getAllNotes();
        correspondentList.splice(0,correspondentList.length)
        notes.forEach((note: NoteType) => {
          let loaded: boolean = false;
          this.notes.forEach((local: NoteType) => {
            if (local.id === note.id) {
              loaded = true;
            }
          });

          if (loaded) {
            return;
          }
          
          this.pushToLocalStore(note)
          
        });
      }
    },
    async createNote(note: NoteType) {
      const userStore = useUserStore();
      const { username } = storeToRefs(userStore);

      if (username.value != "") {
        note = await notesService.createNote(note);
      }
      
      this.pushToLocalStore(note)

    },
    async modifyNote(note: NoteType) {
      const userStore = useUserStore();
      const { username } = storeToRefs(userStore);

      if (username.value != "") {
        await notesService.updateNote(note);
      }
      this.notes.forEach((element: NoteType) => {
        if (element.id === note.id) {
          this.notes[this.notes.indexOf(element)] = JSON.parse(
            JSON.stringify(note)
          );
        }
      });
    },
    async deleteNote(note: NoteType) {
      const userStore = useUserStore();
      const { username } = storeToRefs(userStore);

      if (username.value != "") {
        await notesService.deleteNote(note);
      }
      const tempnote = this.notes.find((element) => element.id === note.id);
      if (tempnote) {
        this.notes.splice(this.notes.indexOf(tempnote), 1);
      }
    },
    
    pushToLocalStore(note:NoteType){
      if(note.correspondent){
        const {username} = storeToRefs(useUserStore())
        if (!note.correspondent) {
          note.type = "self";
        }

        if (note.correspondent === username.value) {
          note.type = "received";
          if (note.author != username.value && !this.correspondentList.includes(note.author)){
            this.correspondentList.push(note.author);
            pushCorrespondent(note.author);
          }
        }

        if (note.author === username.value) {
          note.type = "send";
          if (!this.correspondentList.includes(note.correspondent)){
            this.correspondentList.push(note.correspondent);
            pushCorrespondent(note.correspondent);
          }
        }
      }

      if (!note.correspondent) {
        note.type = "self";
      }

      this.notes.push(note);
    }
    
  },
});

/*export const useNoteStore = defineStore("note", () => {
  const getNotes = async () => {
    const { data } = await notesdb.get("");

    data?.forEach((serverData: any) => {
      let loaded: boolean = false;
      localNotes.value.forEach((local: NoteType) => {
        if (local.id === serverData.id) {
          loaded = true;
        }
      });

      if (loaded) {
        return;
      }

      if (
        serverData.correspondent != user.value.username &&
        serverData.author != user.value.username
      ) {
        return;
      }

      if (serverData.correspondent === user.value.username) {
        serverData.type = "received";
      }

      localNotes.value.push(
        new NoteType(
          serverData.id,
          serverData.title,
          serverData.content,
          serverData.author,
          serverData.type,
          serverData.correspondent
        )
      );
    });
  };

  const createNote = async (note: NoteType) => {
    const id: number = (await counterdb.get("2")).data.counter;

    await counterdb.put("2", {
      counter: id + 1,
    });

    if (user.value != null) {
      await notesdb.post("", {
        id: id + 1,
        created_at: new Date(),
        author: note.author,
        correspondent: note.correspondent,
        type: note.type,
        title: note.title,
        content: note.content,
      });
    }

    localNotes.value.push(
      new NoteType(
        id + 1,
        note.title,
        note.content,
        note.author,
        "self",
        note.correspondent
      )
    );

    localStorage.setItem("localnotes", JSON.stringify(localNotes.value));
  };

  const modifyNote = async (id: number, note: NoteType) => {
    const response = await notesdb.put(`${id}`, note);

    console.log(response);

    const tempnote: any = localNotes.value.find((element) => element.id === id);
    tempnote.title = note.title;
    tempnote.content = note.content;
    tempnote.correspondent = note.correspondent;
  };

  const deleteNote = async (note:NoteType) => {
    const response = await notesdb.delete(`${note.id}`);

    console.log(response);

    const tempnote = localNotes.value.find((element) => element.id === note.id);
    if (tempnote) {
      localNotes.value.splice(localNotes.value.indexOf(tempnote), 1);
    }
  };

  return { notes: localNotes, createNote, modifyNote, deleteNote, getNotes };
});*/
