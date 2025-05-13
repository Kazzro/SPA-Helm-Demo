// Utilities
import { defineStore } from "pinia";
import instance, {authService} from "../db";
import {
  useNoteStore,
} from "@/stores/notesStore";
import { UUID } from "crypto";

export type User = {
  uuid: UUID;
  username: string;
  email: string;
};

export type SignupCredentials = {
  username:string;
  email:string;
  password:string;
};
export type LoginCredentials = Omit<SignupCredentials, "email">;

let userList: string[] = [];

const validateEmail = (email: string) => {
  return String(email).toLowerCase().match(/.+@.+/i);
};

export const useUserStore = defineStore("user", {
  state: () => ({
    username: "",
    loadingUser: false,
    errorMessage: "",
    userList: userList,
  }),
  getters: {
    safeUser: (state) => {
      if (state.username == null) {
        throw new Error("User is null");
      }

      return state.username;
    },
  },
  actions: {
    inputValid(username: string, password: string) {
      let valid = true;

      if (!username) {
        this.errorMessage = "Input a Username";
        valid = false;
      }

      if (username.length < 3) {
        this.errorMessage = "Username is too short";
        valid = false;
      }

      if (password.length < 8) {
        this.errorMessage = "Password is too short";
        valid = false;
      }

      if (!password.length) {
        this.errorMessage = "Password cannot be empty";
        valid = false;
      }
      return valid;
    },
    inputValidSignup(username: string, password: string, email: string) {
      let valid = true;

      
      valid = this.inputValid(username, password);



      if (!email) {
        this.errorMessage = "email is required";
        valid = false;
      }

      if (email && !validateEmail(email)) {
        this.errorMessage = "Email is invalid";
        valid = false;
      }

      return valid;
    },
    async handleLogin(credentials: LoginCredentials) {
      const { username, password } = credentials;

      //check for valid input

      if (!this.inputValid(username, password)) {
        return this.errorMessage;
      }

      //load db

      this.loadingUser = true;

      try {
        this.username = await authService.login(credentials)
        
      } catch (exception) {
        console.error("Exception: ", exception)
        this.loadingUser = false;
        return this.errorMessage = "An Exception has occured"
      }
      
      if (this.username === "") {
        this.loadingUser = false;
        return (this.errorMessage = "user not found");
      } else if(this.username) {
        this.getUserList();
        const noteStore = useNoteStore();
        noteStore.getNotes();
      }

      this.loadingUser = false;
    },
    async handleSignup(credentials: SignupCredentials) {
      this.errorMessage = "";
      const { email, password, username } = credentials;

      // Check valid credentials

      if (!this.inputValidSignup(username, password,email )) {
        return this.errorMessage;
      }

      // database part

      this.loadingUser = true;

      // put in db

      await authService.signup( {
        username: username,
        email: email,
        password: password,
      });


      // login from db (unneccesary traffic but i think cleaner)
      if (this.errorMessage === "") {
        await this.handleLogin(credentials);
      }
      this.loadingUser = false;
    },
    handleLogout() {
      this.username = "";
      authService.logout()
      const noteStore = useNoteStore();
      noteStore.notes = [];
      noteStore.correspondentList = [];
    },
    async getUser() {
      if (localStorage.length > 0) {
        const username = localStorage.getItem("username");
        const pass = localStorage.getItem("userpassword");
        if (username && pass) {
          this.loadingUser = true;
          await this.handleLogin({
            username: username,
            password: pass,
          });

          this.loadingUser = false;
        }
      }
    },
    async getUserList() {
      const { data } = await instance.get("/users/username");
      data.forEach(( username: string ) => {
        if (
          this.userList.filter((obj) => obj === username) != undefined
        )
          this.userList.push(username);
      });
    },
  },
});
