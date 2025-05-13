import { useUserStore, User, SignupCredentials, LoginCredentials } from "../stores/usersStore";
import { useNoteStore, Note, NoteType, GroupNoteType, Content } from "../stores/notesStore";

// type TypedOmit<T, Keys extends keyof T> = Omit<T, Keys>;

export {
  useUserStore,
  useNoteStore,
  Note,
  NoteType,
  GroupNoteType,
  Content,
  User,
  SignupCredentials,
  LoginCredentials,
};
