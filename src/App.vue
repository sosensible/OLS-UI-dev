<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import SiteLayout from '@/components/SiteLayout.vue'
import { useUserStore } from './stores/user';

const userStore = useUserStore()

const appLoad = async () => {
  const s = await userStore.refreshSession();
}

appLoad()
</script>

<template>
  <SiteLayout>
    <RouterView />
  </SiteLayout>
</template>
