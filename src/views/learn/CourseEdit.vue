<template>
  <h1>{{ courseStore.course?.name ? courseStore.course?.name : '(Course Name)' }}</h1>
  <h3>Course ({{ props.action }})</h3>
  id: {{ courseStore.course.id }}<br />
  <form>
    <div class="form-check form-switch form-check-reverse">
      <input v-model="courseStore.course.live" class="form-check-input" type="checkbox" id="switchCourseLive">
      <label class="form-check-label" for="switchCourseLive">Course Live Switch</label>
    </div>
    <div class="form-floating mb-3">
      <input placeholder="new course" v-model="courseStore.course.name" type="text" class="form-control" id="courseName"
        aria-describedby="courseNameHelp">
      <label for="courseName">Name</label>
      <div id="courseNameHelp" class="form-text">The course name needs to be unique on the system.</div>
    </div>
    <div class="form-floating">
      <textarea v-model="courseStore.course.detail" class="form-control" placeholder="Enter course detail here"
        id="courseDetail" style="height: 100px"></textarea>
      <label for="courseDetail">Details</label>
    </div>
  </form>
  <br />
  <Markdown :source="courseStore.course.detail" />
  <div class="p-2">
    <button @click="editCourse(courseStore.course)" class="btn btn-primary">Save Course</button>
    &nbsp;
    <button @click="deleteCourse()" class="btn btn-primary">Delete Course</button>
  </div>
  <hr>
  <div v-for="unit in courseStore.course?.units" :key="unit.id">
    <h2>{{ unit.name }}...</h2>
    <p>Details...</p>
    <button @click="viewUnit(unit)" class="btn btn-primary">View Unit</button>
    &nbsp;
    <button @click="editUnit(unit, 'edit')" class="btn btn-primary">Edit Unit</button>
  </div>
  <br>
  <div class="p-2">
    <button @click="editUnit({ id: 0 }, 'add')" class="btn btn-primary">Add Unit</button>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import type { Course } from '@/stores/course';
import type { Unit } from '@/stores/unit';
import { useCourseStore } from '@/stores/course';
import Markdown from 'vue3-markdown-it';

const props = defineProps({
  id: String,
  action: String,
});
const courseStore = useCourseStore();

if (props.id != '0') {
  courseStore.load(+props.id);
} else {
  courseStore.newCourse();
}

const editCourse = async (targetCourse: Course) => {
  // supabase.from('courses').upsert(targetCourse);
  let cid = 0;
  if (targetCourse.id === 0) {
    cid = await courseStore.insertCourse();
  } else {
    cid = await courseStore.updateCourse();
  }
  router.push({ name: 'olsCourse', params: { id: cid } });
}

const deleteCourse = () => {
  courseStore.deleteCourse();
  router.push({ name: 'olsMain' });
}

const editUnit = (targetunit: Unit | { id: string }, action: string) => {
  router.push({ name: 'olsUnitEdit', params: { id: targetunit.id, action: action, course_id: courseStore.course?.id } });
}

const viewUnit = (targetunit: Unit | { id: string }) => {
  router.push({ name: 'olsUnit', params: { id: targetunit.id } });
}
</script>