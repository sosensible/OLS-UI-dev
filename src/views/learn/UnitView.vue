<template>
  <h1>{{ unitStore.courseName }}</h1>
  <h2>{{ unitStore.unit.name }}<button @click="editUnit(unit)">Edit</button></h2>

  <p>Details</p>
  <div v-for="lesson in unitStore.unit.lessons" :key="lesson.id">
    <h2>{{ lesson.name }}</h2>
    <p>Details</p>
    <button @click="viewLesson(lesson)">View Lesson</button>
  </div>
  <button @click="viewLesson({ id: 0 }, 'add')">Add Lesson</button>
</template>

<script setup lang="ts">
import router from '@/router';
import type { Database } from '@/types/schema';
import { useUnitStore } from '@/stores/unit';

defineProps({
  id: String,
  action: String,
  course_id: String,
});
const props = router.currentRoute.value.params;
const unitStore = useUnitStore();
// add "add" logic later
unitStore.load(+props.id);

const course = {
  name: 'Course 1',
  id: 1
}

const unit = {
  name: 'Unit 1',
  id: 1
}

const lessons = [
  {
    name: 'Lesson 1',
    id: 1
  },
  {
    name: 'Lesson 2',
    id: 2
  },
  {
    name: 'Lesson 3',
    id: 3
  },
]

const editUnit = (targetUnit: Database['public']['Tables']['unit']['Row']) => {
  alert('edit ' + targetUnit.name);
}

const viewLesson = (targetLesson: Database['public']['Tables']['unit']['Row'] | { id: string }, action?: string) => {
  if (action) {
    router.push({ name: 'olsLesson', params: { id: targetLesson.id, action: action, course_id: courseUnit.course.id } });
  } else {
    router.push({ name: 'olsLesson', params: { id: targetLesson.id } });
  }
}
</script>