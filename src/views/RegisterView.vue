<script setup lang="ts">
import { onMounted, ref } from "vue";
import Account from "../components/Account.vue";
import Auth from "../components/Auth.vue";
import { supabase } from "../supabase";
const isRegistered = ref(false);
const session = ref();
const regEmail = ref();
const regPassword = ref();
async function registerUser() {
  const { data, error } = await supabase.auth.signUp({
    email: regEmail.value,
    password: regPassword.value,
  });
  if (error) {
    alert(error.message)
  }
  if (data) {
    console.log({ data: data });
    isRegistered.value = data.user ? true : false;
  }

}
onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
  });
  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
  });
});
/*
// login code
//
// *** github ( https://supabase.com/docs/guides/auth/social-login/auth-github )
//
// async function signInWithGitHub() {
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: 'github',
//   })
// }
// async function signout() {
//   const { error } = await supabase.auth.signOut()
// }
//
// *** google workspaces ( https://supabase.com/docs/guides/auth/social-login/auth-google )
//
// async function signInWithGoogle() {
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: 'google',
//   })
// }
// async function signout() {
//   const { error } = await supabase.auth.signOut()
// }
//
// *** LinkedIn ( https://supabase.com/docs/guides/auth/social-login/auth-linkedin )
//
// async function signInWithLinkedIn() {
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: 'linkedin',
//   })
// }
// async function signout() {
//   const { error } = await supabase.auth.signOut()
// }
*/
</script>

<template>
  <main class="form-signin w-100 m-auto">
    <h1>Registration</h1>
    <form @submit.prevent="registerUser" v-if="!isRegistered">
      <img class="mb-4" src="@/assets/OLS-logo.png" alt="" width="240" />
      <h1 class="h3 mb-3 fw-normal">Please register</h1>

      <div class="form-floating">
        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="regEmail" />
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password"
          v-model="regPassword" />
        <label for="floatingPassword">Password</label>
      </div>

      <button class="w-100 btn btn-lg btn-primary" type="submit" @xclick="registerUser">
        Register
      </button>
    </form>
    <div v-else>User registered :{{ isRegistered }}: for email {{ regEmail }}</div>
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
