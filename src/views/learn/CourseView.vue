<template>
  <h1>{{ courseStore.course.name }}</h1>
  <p>Details</p>
  <div v-if="['add', 'edit'].includes(props.action)">
    <h3>{{ mode }} Course</h3>
    id: {{ courseStore.course.id }}<br />
    name: <input placeholder="new course" v-model="courseStore.course.name" /><br />
    detail: <textarea v-model="courseStore.course.detail" /><br />
    live: <input type="checkbox" v-model="courseStore.course.live" value="true">
    <br />
    <button @click="editCourse(courseStore.course)" v-if="mode != 'View'">{{ mode }} Course</button>
  </div>
  <div v-else v-for="unit in courseStore.course.units" :key="unit.id">
    <h2>{{ unit.name }}...</h2>
    <p>Details...</p>
    <button @click="viewUnit(unit)">View Unit</button>
    <button @click="viewUnit(unit, 'edit')">Edit Unit</button>
  </div>
  <button @click="viewUnit({ id: 0 }, 'add')">Add Unit</button>
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
const mode = props.action ? title(props.action) : "View";
console.log(props.action)
const courseStore = useCourseStore();
// add "add" logic later
console.log('course id', props)
if (props.id != 0) {
  courseStore.load(+props.id);
} else {
  courseStore.newCourse();
}
const editCourse = (targetCourse: Database['public']['Tables']['course']['Row']) => {
  // supabase.from('courses').upsert(targetCourse);
  if (targetCourse.id === 0) {
    courseStore.insertCourse();
  } else {
    //
  }
}

const viewUnit = (targetcourse: Database['public']['Tables']['course']['Row'] | { id: string }, action?: string) => {
  if (action) {
    router.push({ name: 'olsUnit', params: { id: targetcourse.id, action: action, course_id: courseStore.course.id } });
  } else {
    router.push({ name: 'olsUnit', params: { id: targetcourse.id } });
  }
}

function title(str) {
  return str.replace(/(?:^|\s)\w/g, function (match) {
    return match.toUpperCase();
  });
}
</script>