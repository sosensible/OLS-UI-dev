<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import router from "../router";
import { onMounted, ref } from "vue";
import Account from "../components/Account.vue";
import Auth from "../components/Auth.vue";
import { supabase } from "../supabase";

const userStore = useUserStore();
const user = userStore.user;

const session = ref();
const isLoggedIn = ref(false);
const userEmail = ref();
const userPassword = ref();

async function signInUser() {
  userStore.login(userEmail.value, userPassword.value);
}
onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
  });
  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
  });
});
</script>

<template>
  <main class="form-signin w-100 m-auto">
    <img class="mb-4" src="@/assets/OLS-logo.png" alt="Open Learning Server Logo" width="240" />
    <form @submit.prevent="signInUser" v-if="!userStore.isLoggedIn">
      <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

      <div class="form-floating">
        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com"
          v-model="userEmail" />
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password"
          v-model="userPassword" />
        <label for="floatingPassword">Password</label>
      </div>

      <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me" /> Remember me
        </label>
      </div>
      <button class="w-100 btn btn-lg btn-primary" type="submit">
        Sign in
      </button>
    </form>
    <RouterLink to="/register" v-if="!userStore.isLoggedIn">Register New Account</RouterLink>
    <div class="container" style="padding: 50px 0 100px 0">
      <Account v-if="session" :session="session" />
      <Auth v-else />
    </div>
  </main>
</template>

<style scoped>
.form-control-dark {
  border-color: var(--bs-gray);
}

.form-control-dark:focus {
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}

html,
body {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  max-width: 330px;
  padding: 15px;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
