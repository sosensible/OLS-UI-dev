<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { supabase } from '@/supabase';
import { useStorage } from '@vueuse/core';

const userStore = useUserStore();
const user = userStore.user;

const newCourse = {
  detail: 'detail for course 7',
  name: 'course 7',
  owner: '1582bc18-b648-441d-8abe-6b1eab6e1f73'
}
async function createCourse(myCourse) {
  const { data, error } = await supabase.from('course')
    .insert([
      {
        name: myCourse.name,
        detail: myCourse.detail,
        owner: myCourse.owner
      }
    ]);
  console.log(data ?? error);
}
async function getCourses() {
  const { data, error } = await supabase.from('courses').select(`
    *,
    units (
      *,
      lessons ( * )
    )
  `);
  console.log(data ?? error)
}
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="createCourse(newCourse)">Add Course</button>
    <button @click="getCourses()">Show Courses</button>
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
