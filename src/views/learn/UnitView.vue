<template>
  <h1>{{ unitStore.courseName }}</h1>
  <h2>{{ unitStore.unit.name }}<button @click="editUnit(unit)">Edit</button></h2>

  <p>Content</p>
  <div v-if="['add', 'edit'].includes(props.action)">
    <h3>{{ mode }} Unit</h3>
    id: {{ unitStore.unit.id }}<br />
    name: <input placeholder="new unit" v-model="unitStore.unit.name" /><br />
    content: <textarea v-model="unitStore.unit.content" /><br />
    live: <input type="checkbox" v-model="unitStore.unit.live" value="true">><br />
  </div>
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
const mode = props.action ? title(props.action) : "View";
const unitStore = useUnitStore();
// add "add" logic later
unitStore.load(+props.id);

if (props.id != '0') {
  unitStore.load(+props.id);
} else {
  unitStore.newUnit();
}

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

function title(str) {
  return str.replace(/(?:^|\s)\w/g, function (match) {
    return match.toUpperCase();
  });
}
</script>