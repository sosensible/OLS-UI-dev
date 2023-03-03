<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <RouterLink to="/learn">Courses</RouterLink>
      </li>
      <li class="breadcrumb-item">
        <RouterLink :to="{ name: 'olsCourse', params: { id: unitStore.getCourseId } }">{{ unitStore.courseName }}
        </RouterLink>
      </li>
      <li class="breadcrumb-item active" aria-current="page">{{ unitStore.unit?.name }}</li>
    </ol>
  </nav>
  <h1>{{ unitStore.courseName }}</h1>
  <h2>{{ unitStore.unit?.name }}</h2>

  id: {{ unitStore.unit?.id }}<br />
  Status: {{ unitStore.unit?.live ? "live" : "draft" }}<br />
  <p>
    Content<br>
    {{ unitStore.unit?.content }}
  </p>

  <div class="p-2">
    <button @click="editUnit(unitStore.unit, 'edit')" class="btn btn-primary">Edit Unit</button>
    &nbsp;
    <button @click="deleteUnit()" class="btn btn-primary">Delete Unit</button>
  </div>
  <h3>Lessons</h3>
  <div v-for="lesson in unitStore.unit?.lessons" :key="lesson.id">
    <h2>{{ lesson.name }}</h2>
    <p>Details</p>
    <button @click="viewLesson(lesson)" class="btn btn-primary">View Lesson</button>
  </div>
  <button @click="viewLesson({ id: '0' }, 'add')" class="btn btn-primary">Add Lesson</button>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import router from '@/router';
import { useUnitStore, type Unit } from '@/stores/unit';
import { useCourseStore } from '@/stores/course';

defineProps({
  id: String,
  action: String,
  course_id: String,
});
const props = router.currentRoute.value.params;
const courseStore = useCourseStore();
const unitStore = useUnitStore();
const courseID = ref(0);
// add "add" logic later

if (props.id != '0') {
  unitStore.load(+props.id);
} else {
  unitStore.newUnit();
}
// watch(unitStore.courseID, async (newID, oldID) => {
//   courseID.value = +newID;
// })

// if (+props.course_id != courseStore.course?.id) courseStore.load(+props.course_id);

const editUnit = (targetUnit: Unit, action: string) => {
  console.log('target unit', targetUnit)
  router.push({ name: 'olsUnitEdit', params: { id: targetUnit.id, action: action, course_id: courseStore.course?.id } });
}

const deleteUnit = () => {
  const courseId = unitStore.courseID;
  unitStore.deleteUnit();
  router.push({ name: 'olsCourse', params: { id: courseId } });
}

const viewLesson = (targetLesson: Unit | { id: string }, action?: string) => {
  if (action) {
    // router.push({ name: 'olsLesson', params: { id: targetLesson.id, action: action, course_id: courseUnit.course.id } });
  } else {
    router.push({ name: 'olsLesson', params: { id: targetLesson.id } });
  }
}
</script>