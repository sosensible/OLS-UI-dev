<template>
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
  <div class="p-2">
    <button @click="editCourse(courseStore.course)" class="btn btn-primary">Save Course</button>
    &nbsp;
    <button @click="deleteCourse()" class="btn btn-primary">Delete Course</button>
  </div>
  <div v-for="unit in courseStore.course?.units" :key="unit.id">
    <h2>{{ unit.name }}...</h2>
    <p>Details...</p>
    <button @click="viewUnit(unit)" class="btn btn-primary">View Unit</button>
    &nbsp;
    <button @click="viewUnit(unit, 'edit')" class="btn btn-primary">Edit Unit</button>
  </div>
  <br>
  <div class="p-2">
    <button @click="viewUnit({ id: 0 }, 'add')" class="btn btn-primary">Add Unit</button>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import type { Database } from '@/types/schema';
import { useCourseStore } from '@/stores/course';

defineProps({
  id: String,
  action: String,
});
const props = router.currentRoute.value.params;
console.log(props.action)
const courseStore = useCourseStore();

if (props.id != '0') {
  courseStore.load(+props.id);
} else {
  courseStore.newCourse();
}
const editCourse = async (targetCourse: Database['public']['Tables']['courses']['Row']) => {
  // supabase.from('courses').upsert(targetCourse);
  let cid = 0;
  if (targetCourse.id === 0) {
    cid = await courseStore.insertCourse();
  } else {
    cid = await courseStore.updateCourse();
  }
  router.push({ name: 'olsCourse', params: { id: cid } });
}

const viewUnit = (targetcourse: Database['public']['Tables']['courses']['Row'] | { id: string }, action?: string) => {
  if (action) {
    router.push({ name: 'olsUnit', params: { id: targetcourse.id, action: action, course_id: courseStore.course?.id } });
  } else {
    router.push({ name: 'olsUnit', params: { id: targetcourse.id } });
  }
}

const deleteCourse = () => {
  courseStore.deleteCourse();
  router.push({ name: 'olsMain' });
}
</script>