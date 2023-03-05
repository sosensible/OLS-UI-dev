<template>
  <!---
    <h1>{{ lessonStore.lesson.units.courses.name }}</h1>
  
    {{ lessonStore.lesson.units.name }}: {{ lessonStore.lesson.name }}
    <button @click="editLesson(lessonStore.lesson)">Edit</button>
  -->
  <h1>{{ lessonStore.courseName }}</h1>
  <h2>
    {{ lessonStore.unitName }}: {{ lessonStore.lesson.name }}
  </h2>
  <p>Details</p>
</template>

<script setup lang="ts">
import router from '@/router';
import { useLessonStore } from '@/stores/lesson';

const props = defineProps({
  id: String,
  action: String,
  lesson_id: String,
  unit_id: String,
  course_id: String,
});

const lessonStore = useLessonStore();
// add "add" logic later
lessonStore.load(+props.id);

const editLesson = (targetLesson) => {
  alert('edit ' + targetLesson.name);
}
/*
 OR ((live = true) AND (unit IN ( SELECT units.id
   FROM (((units
     JOIN courses ON ((courses.id = units.course)))
     JOIN enrollments ON ((enrollments.course = courses.id)))
     JOIN students ON ((students.id = enrollments.student)))
  WHERE (auth.uid() = students.person))))
  */
</script>