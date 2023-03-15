<script setup lang="ts">
import router from '@/router';
import { useCourseStore, type Course } from '@/stores/learn/course';
import { onActivated, onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user';

import OLSCard from '@/components/ols/OLSCard.vue';

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

const editCourse = (targetCourse: Course | { id: string }, action: string) =>
  router.push({ name: 'olsCourseEdit', params: { id: targetCourse.id, action: action } });

const viewCourse = (targetCourse: Course | { id: string }) =>
  router.push({ name: 'olsCourse', params: { id: targetCourse.id } });

const myImage = (id: Number, imageName: String) => {
  if (imageName.length) {
    return '/course/' + id + '/img/' + imageName;
  }
  return '';
}

const updateCourses = () => courseStore.pullCourseList(searchText.value)

const checkOwner = (id: String) => userStore.user.id == id ? true : false; 
</script>

<template>
  <div>
    <h1>Course Listing Page</h1>
    <div class="mb-3">
      <div class="input-group mb-3">
        <input type="text" v-model="searchText" placeholder="Search Text" class="form-control"
          aria-label="Course search text" aria-describedby="descCourseSearch">
        <button @click="updateCourses" class="btn btn-outline-secondary" type="button" id="descCourseSearch">Search
          Courses</button>
      </div>
      <div v-if="!courses.length" class="text-center text-warning">No courses matching search.</div>
      <button @click="editCourse({ id: 0 }, 'add')" class="btn btn-primary" v-if="userStore.user.id">Add Course</button>
    </div>

    <div class="row pl-3 mr-3">
      <div v-for="course in courses" :key="course.id" class="col-sm-6 mb-3 mb-sm-0">
        <OLSCard :header="course.name" :image="myImage(course.id, course.image)">
          {{ course.shortDesc }}
          <template v-slot:footer>
            <button @click="viewCourse(course)" class="btn btn-primary">View Course</button>
            &nbsp;
            <button @click="editCourse(course, 'edit')" class="btn btn-primary" v-if="checkOwner(course.owner?.id)">Edit
              Course</button>
          </template>
        </OLSCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
courseCard {
  border: solid blue 1px;
}
</style>