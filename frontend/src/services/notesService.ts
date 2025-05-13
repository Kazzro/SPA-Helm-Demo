import instance from "../db";
import { NoteType } from "../stores/notesStore";

export const notesService = {
  async getAllNotes(): Promise<NoteType[]> {
    let response
    try {
      response = await instance.get<NoteType[]>("/users/my/notes");
    } catch (error) {
      console.error("Fehler beim Empfangen der Notizen:", error);
      throw error;
    }
    const { data: notes } = response;
    return notes;
  },

  async deleteNote(note: NoteType): Promise<void> {
    try {
      await instance.delete(`/users/my/notes/${note.id}`);
    } catch (error) {
      console.error("Fehler beim Löschen der Notiz:", error);
      throw error;
    }
  },

  async createNote(newNote: NoteType): Promise<NoteType> {
    const newNoteRequest = {
      title : newNote.title,
      content : JSON.stringify(newNote.content),
      correspondent : newNote.correspondent || null
    }

    let response
    try {
      response = await instance.post("/users/my/notes", newNoteRequest);
    } catch (error) {
      console.error("Fehler beim Erstellen der Notiz:", error);
      throw error;
    }
    const { data: note } = response;

    console.log(note)
    return note;
  },
  
  async updateNote(updatedNote: NoteType): Promise<NoteType> {
    const updatedNoteRequest = {
      id:updatedNote.id,
      author:updatedNote.author,
      correspondent:updatedNote.correspondent,
      title:updatedNote.title,
      content:JSON.stringify(updatedNote.content)
    }

    let response
    try {
      response = await instance.put(`/users/my/notes/${updatedNote.id}`, updatedNoteRequest);
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Notiz:", error);
      throw error;
    }
    const { data: note } = response;
    return note;
  }
};
