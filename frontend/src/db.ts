import { useAuthStore } from "@/stores/auth";
import axios from 'axios';
import { storeToRefs } from "pinia";
import { LoginCredentials, SignupCredentials } from "@/stores/usersStore";

const API_URL = '/api';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});



const addTokenToHeader = () => {
  const {token} = storeToRefs(useAuthStore())
  if (token.value) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
};



export const authService = {
  async login(credentials: LoginCredentials ): Promise<string> {
     
    const { data: userData, status } = await instance.post("/auth/signin",credentials);

    if (status === 404) {
      throw "User Not Found";
    }

    let username = ""
    
    if (status === 200) {
      username = userData.username;
      useAuthStore().setToken(userData.accessToken)
      addTokenToHeader();
    }

    return username
  },

  async signup(credentials: SignupCredentials): Promise<string> {
    const {data, status} = await instance.post("/auth/signup", credentials)

    if(status != 201) {
        throw data.message
    } else {
        const {username, password} = credentials
        
        return this.login({username, password})
    }
  },

  logout():void {
    useAuthStore().clearToken();
    addTokenToHeader();
  }
}

addTokenToHeader();

export default instance;


/* import axios from "axios";

const counterdb = axios.create({
  baseURL: "http://localhost:3000/counter",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

const userdb = axios.create({
  baseURL: "http://localhost:3000/user",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

const userIdentsdb = axios.create({
  baseURL: "http://localhost:3000/userIdentifications",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

const notesdb = axios.create({
  baseURL: "http://localhost:3000/notes",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

export { counterdb, userdb, userIdentsdb, notesdb };*/