<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const user = userStore.user;
</script>

<template>
  <div>
    <p>{{ userStore.loggedIn }}: {{ userStore.user }}</p>
    <button @click="userStore.login('johnfarrar@sosapps.com', 'asdf1234')">Sign In</button><br>
    <button @click="userStore.logout">Sign Out</button><br>
    <hr>
    <p>{{ userStore.session }}</p>
  </div>
  <hr>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .xabout {
    min-height: 92vh;
    display: flex;
    align-items: center;
  }
}
</style>
