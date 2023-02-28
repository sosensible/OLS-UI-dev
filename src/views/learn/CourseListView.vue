<template>
  <div>
    <h1>Course Listing Page</h1>
    <div v-for="course in courses" :key="course.id">
      <h2>{{ course.name }}</h2>
      <p>{{ course.detail }}</p>
      <button @click="viewCourse(course)">View Course</button>
      <button @click="viewCourse(course, 'edit')">Edit Course</button>
    </div>
    <div v-if="courseStore.listPulled && !courses.length">No courses matching search.</div>
    <div>
      <hr />
      <input type="text" v-model="searchText" placeholder="Search Text" />
      <button @click="updateCourses">Get Courses</button>
      <button @click="viewCourse({ id: 0 }, 'add')">Add Course</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { useCourseStore } from '@/stores/course';
import type { Database } from '@/types/schema';
import { onActivated, onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user';

const searchText = ref("");
const courseStore = useCourseStore();
const courses = courseStore.courses;
const userStore = useUserStore();

onActivated(() => {
  // @ts-ignore
  if (!userStore.isLoggedIn | courseStore.listPulledAt < userStore.getChangedLoginAt | !courseStore.courses.length) {
    courseStore.pullCourseList(searchText.value);
  }
  console.log("course list page activated");
})
onMounted(() => {
  // @ts-ignore
  if (!userStore.isLoggedIn | courseStore.listPulledAt < userStore.getChangedLoginAt | !courseStore.courses.length) {
    courseStore.pullCourseList(searchText.value);
  }
  console.log("course list page mounted");
})

const viewCourse = (targetCourse: Database['public']['Tables']['course']['Row'] | { id: string }, action?: string) =>
  router.push({ name: 'olsCourse', params: { id: targetCourse.id, action: action } });

const updateCourses = () => courseStore.pullCourseList(searchText.value)
</script>