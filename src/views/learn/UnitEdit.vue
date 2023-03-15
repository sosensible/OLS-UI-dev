<script setup lang="ts">
import router from '@/router';
import type { Lesson } from '@/stores/learn/lesson';
import { useUnitStore, type Unit } from '@/stores/learn/unit';
import { useCourseStore } from '@/stores/learn/course';
import Markdown from 'vue3-markdown-it';

const props = defineProps({
  id: String,
  action: String,
  course_id: String,
});
const courseStore = useCourseStore();
const unitStore = useUnitStore();
// unitStore.load(+props.id);

if (props.id != '0') {
  unitStore.load(+props.id);
} else {
  unitStore.newUnit();
}

if (+props.course_id != courseStore.course?.id) courseStore.load(+props.course_id);

const editUnit = async (targetUnit: Unit) => {
  let uid: number | undefined = 0;
  if (targetUnit.id === 0) {
    console.log('inserting unit')
    uid = await unitStore.insertUnit(+props.course_id);
  } else {
    uid = await unitStore.updateUnit();
  }
  router.push({ name: 'olsUnit', params: { id: uid } });
}

const deleteUnit = () => {
  unitStore.deleteUnit();
  router.push({ name: 'olsCourse', params: { id: props.course_id } });
}

const editLesson = (targetLesson: Lesson | { id: string }, action: string) => {
  router.push({ name: 'olsLessonEdit', params: { id: targetLesson.id, action: action, unit_id: unitStore.unit?.id } });
}

const viewLesson = (targetLesson: Unit | { id: string }, action?: string) => {
  if (action) {
    // router.push({ name: 'olsLesson', params: { id: targetLesson.id, action: action, course_id: courseUnit.course.id } });
  } else {
    router.push({ name: 'olsLesson', params: { id: targetLesson.id } });
  }
}
</script>

<template>
  <h1>{{ courseStore.course.name }}</h1>
  <h2>{{ unitStore.unit?.name ? unitStore.unit?.name : '(Unit Name)' }}</h2>
  <h3>Unit ({{ props.action }})</h3>
  id: {{ unitStore.unit.id }}<br />
  <form>
    <div class="form-check form-switch form-check-reverse">
      <input v-model="unitStore.unit.live" type="checkbox" class="form-check-input" id="switchUnitLive">
      <label for="switchUnitLive" class="form-check-label">Unit Live Switch</label>
    </div>
    <div class="form-floating mb-3">
      <input placeholder="new unit" v-model="unitStore.unit.name" type="text" class="form-control" id="unitName"
        aria-describedby="unitNameHelp">
      <label for="unitName">Name</label>
      <div id="unitNameHelp" class="form-text">The unit name needs to be unique on the course.</div>
    </div>
    <div class="form-floating mb-3">
      <input placeholder="new unit image" v-model="unitStore.unit.image" type="text" class="form-control" id="unitImage"
        aria-describedby="unitImageHelp">
      <label for="unitImage">Image File Name</label>
      <div id="unitImageHelp" class="form-text">The unit image filename.</div>
    </div>
    <div class="form-floating mb-3">
      <input placeholder="short description" v-model="unitStore.unit.shortDesc" type="text" class="form-control"
        id="unitShortDesc" aria-describedby="unitShortDescHelp">
      <label for="unitShortDesc">Short Description</label>
      <div id="unitShortDescHelp" class="form-text">The unit short description.</div>
    </div>
    <div class="form-floating">
      <textarea v-model="unitStore.unit.content" class="form-control" placeholder="Enter unit detail here"
        id="unitContent" style="height: 100px"></textarea>
      <label for="unitContent">Content</label>
    </div>
  </form>
  <br />
  <Markdown :source="unitStore.unit.content" class="markdown" />

  <div class="p-2">
    <button @click="editUnit(unitStore.unit)" class="btn btn-primary">Save Unit</button>
    &nbsp;
    <button @click="deleteUnit()" class="btn btn-primary">Delete Unit</button>
  </div>
  <hr>
  <div v-for="lesson in unitStore.unit?.lessons" :key="lesson.id">
    <h2>{{ lesson.name }}</h2>
    <p>{{ lesson.shortDesc }}</p>
    <button @click="viewLesson(lesson)" class="btn btn-primary">View Lesson</button>
  </div>
  <button @click="editLesson({ id: '0' }, 'add')" class="btn btn-primary">Add Lesson</button>
</template>

<style>
@import '@/assets/markdown'
</style>