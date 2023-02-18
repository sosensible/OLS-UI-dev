<template>
  <h1>{{ courseStore.course.name }}<button @click="editCourse(courseStore.course)">Edit</button></h1>
  <p>Details</p>
  <div v-for="unit in courseStore.course.units" :key="unit.id">
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
const courseStore = useCourseStore();
// add "add" logic later
courseStore.load(+props.id);

const editCourse = (targetCourse: Database['public']['Tables']['course']['Row']) => {
  alert('edit ' + targetCourse.name);
}

const viewUnit = (targetcourse: Database['public']['Tables']['course']['Row'] | { id: string }, action?: string) => {
  if (action) {
    router.push({ name: 'olsUnit', params: { id: targetcourse.id, action: action, course_id: courseStore.course.id } });
  } else {
    router.push({ name: 'olsUnit', params: { id: targetcourse.id } });
  }
}
</script>