<script setup lang="ts">
import ModalTemplate from "./ModalTemplate.vue";
import { useUserStore } from "../stores/usersStore";
import { useAuthStore } from "@/stores/auth";
import { ref, Ref, reactive } from "vue";
import { storeToRefs } from "pinia";
import router from "@/router";

const userStore = useUserStore();

const title = ref("");
const showSignupModal: Ref<boolean> = ref(false);
const showAuthModal: Ref<boolean> = ref(false);
const showLogoutModal: Ref<boolean> = ref(false);
const { errorMessage, loadingUser, username } = storeToRefs(userStore);
const {token} = storeToRefs(useAuthStore());





const credentials = reactive({
  email: "",
  password: "",
  username: "",
});

const handleLoginHere = async () => {
  userStore.getUser();
  await userStore.handleLogin(credentials);
  checkSuccess();
};

const handleSignupHere = async () => {
  await userStore.handleSignup(credentials);

  checkSuccess();
};

const handleLogoutHere = async () => {
  userStore.handleLogout();
  username.value = "unsigned";
  closeModal();
};

const checkSuccess = () => {
  if (userStore.errorMessage.length === 0) {
    closeModal();
  }
};

const closeModal = () => {
  credentials.email = "";
  credentials.username = "";
  credentials.password = "";

  errorMessage.value = "";

  showAuthModal.value = false;
  showSignupModal.value = false;
  showLogoutModal.value = false;
};

</script>

<template>
  <div class="header">
    <div class="container">
      <div class="logopart">
        <img
          data-test="logo"
          src="/src/assets/logoWoBg.svg"
          @click="router.push('/')"
        />
      </div>
      <div class="titlepart">
        <div class="title">
          <h1>ToDO</h1>
          <h1 data-test="userHeadline" v-if="username != ''">&nbsp;-&nbsp;{{ username }}</h1>
        </div>
        <div class="subtitle">
          <h2 data-test="subtitle">{{ $route.name }}</h2>
        </div>
      </div>
      <div class="buttonpart">
        <v-btn
          data-test="SignUp"
          :disabled="loadingUser"
          v-if="!token"
          @click="
            title = 'Signup';
            showSignupModal = true;
            showAuthModal = true;
          "
          >Signup</v-btn
        >
        <v-btn data-test="Options" :disabled="true" v-else>Options</v-btn>
        <v-btn
          data-test="Login"
          :disabled="loadingUser"
          v-if="!token"
          @click="
            title = 'Login';
            showAuthModal = true;
          "
          >Login</v-btn
        >
        <v-btn
          v-else
          data-test="Logout"
          @click="
            title = 'Logout';
            showLogoutModal = true;
          "
          >Logout</v-btn
        >
      </div>

      <modal-template
        :open="showAuthModal"
        :title="title"
        @ok="showSignupModal ? handleSignupHere() : handleLoginHere()"
        @cancel="closeModal()"
      >
        <div class="input-container" v-if="!loadingUser">
          <form>
            <v-text-field
              v-if="showSignupModal"
              data-test="Email"
              label="Email"
              type="email"
              v-model.trim="credentials.email"
              placeholder="JohnDoe@email.de"
            >
            </v-text-field>
            <v-text-field
              data-test="Username"
              label="Username"
              v-model.trim="credentials.username"
              placeholder="Username"
              hint="minimum length is 4 characters"
            >
            </v-text-field>
            <v-text-field
              data-test="Password"
              label="Password"
              autocomplete="current-password"
              v-model.trim="credentials.password"
              placeholder="*************"
              type="password"
              hint="minimum length is 8 characters"
            >
            </v-text-field>
          </form>
          <v-alert type="error" v-if="errorMessage" :value="false">{{
            errorMessage
          }}</v-alert>
        </div>
        <div class="spinner" v-else>
          <v-progress-circular :size="70" color="blue" indeterminate />
        </div>
      </modal-template>

      <modal-template
        :open="showLogoutModal"
        :title="title"
        @ok="handleLogoutHere()"
        @cancel="closeModal()"
      >
        <h1>Are you sure you want to logout?</h1>
      </modal-template>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  height: 20vh;
  width: 100%;
  align-items: center;
  background: linear-gradient(
    30deg,
    #9b7eff,
    #7ea2ff,
    #7ee3ff,
    #7effdb,
    #7eff9b,
    #a2ff7e,
    #e2ff7e
  );
}
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin-inline: 5%;
  width: 90%;
  height: 20vh;

  position: absolute;
}

.logopart {
  height: 100%;
  width: auto;
  padding: 1%;
}

.logopart img {
  height: 100%;
  width: 100%;
}

.titlepart {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 50%;
  height: 100%;
}

.titlepart .title {
  display: flex;
  width: 100%;
}

.titlepart .title h1 {
  color: black;
  font-family: Kanit;
  font-size: 40px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.titlepart .subtitle {
  margin-top: 5%;
  margin-inline: auto;
}

.titlepart .subtitle h2 {
  color: black;
  font-family: Kanit;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.buttonpart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  width: 15%;
  height: 100%;
  padding-bottom: 25px;
}

.input-container {
  height: 300px;
}

.spinner {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
@/store/notesMockDB ../store/usersMockDB
