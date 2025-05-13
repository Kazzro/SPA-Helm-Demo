import { useAuthStore } from "@/stores/auth";
import instance from "../db";
import { LoginCredentials, SignupCredentials } from "@/stores/usersStore";

export const authService = {
    async login(credentials: LoginCredentials ): Promise<string> {
        
      const { data: userData, status } = await instance.post("/signin",credentials);

      if (status === 404) {
        throw "User Not Found";
      }

      // TODO: Weitere Fehlerbehandlungen hinzufügen

      let username = ""

      if (userData.length === 1) {
        username = userData[0].username;
        useAuthStore().setToken(userData[0].token)
        
      }

      return username
    },

    async signup(credentials: SignupCredentials): Promise<string> {
        const {data, status} = await instance.post("/signup", credentials)

        if(status != 200) {
            throw data.message
        } else {
            const {username, password} = credentials

            return this.login({username, password})
        }
    },

    logout():void {
        useAuthStore().clearToken();
    }
}