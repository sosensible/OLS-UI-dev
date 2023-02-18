<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { supabase } from '@/supabase';
import { useStorage } from '@vueuse/core';
import { isGeneratorFunction } from 'util/types';
import { ref } from 'vue';

const userStore = useUserStore();
const user = userStore.user;

const cName = ref("course ")
const cDetail = ref("detail for course ")
const uName = ref("unit ")
const uContent = ref("detail for unit ")
const lName = ref("lesson for ")
const lContent = ref("detail for lesson ")

async function createCourse() {
  const { data: courseData, error: courseError } = await supabase.from('courses')
    .insert([
      {
        name: cName.value,
        detail: cDetail.value,
        owner: '1582bc18-b648-441d-8abe-6b1eab6e1f73'
      }
    ]).select().single()
  if (courseData) {
    console.log({ course: courseData })
    console.log({ course_id: courseData.id })
    const { data: unitData, error: unitError } = await supabase.from('units')
      .insert([
        {
          name: uName.value,
          content: uContent.value,
          course: courseData.id
        }
      ]).select().single()
    if (unitData) {
      console.log({ unit: unitData })
      console.log({ unit_id: unitData.id })
      const { data: lessonData, error: lessonError } = await supabase.from('lessons')
        .insert([
          {
            name: lName.value,
            content: lContent.value,
            unit: unitData.id
          }
        ]).select().single()
      if (lessonData) {
        console.log({ lesson: lessonData })
      }
      if (lessonError) {
        console.log({ lerror: lessonError })
      }
    }
    if (unitError) {
      console.log({ uerror: unitError })
    }
  }
  if (courseError) {
    console.log({ cerror: courseError });
  }
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
    <table>
      <tr>
        <td><input v-model="cName" placeholder="course" /></td>
      </tr>
      <tr>
        <td><input v-model="cDetail" placeholder="detail" /></td>
      </tr>
      <tr>
        <td><input v-model="uName" placeholder="unit" /></td>
      </tr>
      <tr>
        <td><input v-model="uContent" placeholder="detail" /></td>
      </tr>
      <tr>
        <td><input v-model="lName" placeholder="lesson" /></td>
      </tr>
      <tr>
        <td><input v-model="lContent" placeholder="detail" /></td>
      </tr>
    </table>
    <button @click="createCourse()">Add Course</button>
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
