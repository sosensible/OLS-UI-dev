<script setup lang="ts">
import { computed } from 'vue'
import router from '@/router';
import { useUnitStore, type Unit } from '@/stores/learn/unit';
import type { Lesson } from '@/stores/learn/lesson';
import { useCourseStore } from '@/stores/learn/course';
import { useUserStore } from '@/stores/user';
import Markdown from 'vue3-markdown-it';

const props = defineProps({
  id: String,
  action: String,
  course_id: String,
});
const courseStore = useCourseStore();
const unitStore = useUnitStore();
const userStore = useUserStore();

if (props.id != '0') {
  unitStore.load(+props.id);
} else {
  unitStore.newUnit();
}

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

const isOwner = computed(() => {
  const userIDSet = userStore.user?.id ? true : false;
  return userIDSet && userStore.user?.id == unitStore.courseOwner;
});

const editLesson = (targetLesson: Lesson | { id: string }, action: string) => {
  router.push({ name: 'olsLessonEdit', params: { id: targetLesson.id, action: action, unit_id: unitStore.unit?.id } });
}

const viewLesson = (targetLesson: Unit | { id: string }, action?: string) => {
  router.push({ name: 'olsLesson', params: { id: targetLesson.id } });
}
</script>

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
    <Markdown :source="unitStore.unit.content" class="markdown" />
  </p>

  <div class="p-2">
    <button @click="editUnit(unitStore.unit, 'edit')" class="btn btn-primary" v-if="isOwner">Edit Unit</button>
    &nbsp;
    <button @click="deleteUnit()" class="btn btn-primary"
      v-if="userStore.user?.id && userStore.user?.id == unitStore.courseOwner">Delete
      Unit</button>
  </div>
  <h3>Lessons</h3>
  <div v-for="lesson in unitStore.unit?.lessons" :key="lesson.id">
    <h2>{{ lesson.name }}</h2>
    <p>{{ lesson.shortDesc }}</p>
    <button @click="viewLesson(lesson)" class="btn btn-primary">View Lesson</button>
    &nbsp;
    <button @click="editLesson(lesson, 'edit')" class="btn btn-primary" v-if="isOwner">Edit Lesson</button>
  </div>
  <button @click="editLesson({ id: '0' }, 'add')" class="btn btn-primary" v-if="isOwner">Add Lesson</button>
</template>

<style>
@import '@/assets/markdown'
</style>
