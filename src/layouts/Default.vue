<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from "vue";
import { supabase } from "../supabase";
import 'mosha-vue-toastify/dist/style.css'

const loggedIn = ref(false);
const session = ref();
const userStore = useUserStore();
const user = userStore.user;

onMounted(() => {
  // console.log('mounted');
});
</script>

<template>
  <header class="p-3 text-bg-dark">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
          <img src="@/assets/OLS-logo.png" style="height: 40px;" />
        </a>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><router-link :to="{ name: 'home' }" class="nav-link px-2 text-secondary">Home</router-link></li>
          <li><router-link :to="{ name: 'olsMain' }" class="nav-link px-2 text-white">Learn</router-link></li>
          <li><router-link :to="{ name: 'news' }" class="nav-link px-2 text-white">News</router-link></li>
          <li><router-link :to="{ name: 'about' }" class="nav-link px-2 text-white">About</router-link></li>
        </ul>

        <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
          <input type="search" class="form-control form-control-dark text-bg-dark" placeholder="Search..."
            aria-label="Search">
        </form>

        <div class="text-end">
          <button class="btn btn-warning" type="submit" @click="userStore.logout"
            v-if="userStore.isLoggedIn">Logout</button>
          <router-link type="button" :to="{ name: 'login' }" class="btn btn-warning" v-else>Login</router-link>
        </div>

        <div class="text-end ms-2">
          <a data-test="user-avatar" href="#" class="d-block link-dark text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown" aria-expanded="false">
            <img src="https://github.com/mdo.png" alt="mdo" title="odm" width="32" height="32" class="rounded-circle">
          </a>
          <ul data-test="user-menu" class="dropdown-menu text-small">
            <li><a class="dropdown-item" href="#">New course...</a></li>
            <li><a class="dropdown-item" href="#">Settings</a></li>
            <li><a class="dropdown-item" href="#">Profile</a></li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li><a class="dropdown-item" href="#">Sign out</a></li>
          </ul>
        </div>
      </div>
    </div>
  </header>

  <slot></slot>

  <div class="container xtext-bg-dark">
    <footer class=" py-3 my-4">
      <ul class="nav justify-content-center border-bottom pb-3 mb-3">
        <li><router-link :to="{ name: 'home' }" class="nav-link px-2 text-muted">Home</router-link></li>
        <li><router-link :to="{ name: 'olsMain' }" class="nav-link px-2 text-muted">Learn</router-link></li>
        <li><router-link :to="{ name: 'news' }" class="nav-link px-2 text-muted">News</router-link></li>
        <li><router-link :to="{ name: 'about' }" class="nav-link px-2 text-muted">About</router-link></li>
      </ul>
      <p class="text-center text-muted">&copy; 2023 SOSensible</p>
    </footer>
  </div>
</template>

<style scoped>
.form-control-dark {
  border-color: var(--bs-gray);
}

.form-control-dark:focus {
  border-color: #fff;
  box-shadow: 0 0 0 .25rem rgba(255, 255, 255, .25);
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
