<template>
  <h1>{{ courseStore.course.name }}</h1>
  <p>by: {{ courseStore.course?.owner?.full_name }}</p>
  <p>{{ courseStore.course.detail }}</p>

  <div class="p-2">
    <button @click="editCourse(courseStore.course, 'edit')" class="btn btn-primary">Edit Course</button>
    &nbsp;
    <button @click="deleteCourse()" class="btn btn-primary">Delete Course</button>
  </div>
  <h2>Units</h2>
  <div class="row pl-3 mr-3">
    <div v-for="unit in courseStore.course?.units" :key="unit.id" class="col-sm-6 mb-3 mb-sm-0">
      <div class="card mb3">
        <div class="card-header">
          <h2>{{ unit.name }}...</h2>
        </div>
        <div class="card-body">
          <p>Details...</p>
        </div>
        <div class="card-footer">
          <button @click="viewUnit(unit)" class="btn btn-primary">View Unit</button>
          &nbsp;
          <button @click="viewUnit(unit, 'edit')" class="btn btn-primary">Edit Unit</button>
        </div>
      </div>
    </div>
  </div>
  <br />
  <button @click="viewUnit({ id: 0 }, 'add')" class="btn btn-primary">Add Unit</button>
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

const editCourse = (targetCourse: Database['public']['Tables']['courses']['Row'] | { id: string }, action?: string) => {
  router.push({ name: 'olsCourseEdit', params: { id: targetCourse.id, action: action } });
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