<script setup lang="ts">
import router from '@/router';
import { useLessonStore, type Lesson } from '@/stores/learn/lesson';
import { useUnitStore, type Unit } from '@/stores/learn/unit';
import Markdown from 'vue3-markdown-it';


const props = defineProps({
  id: String,
  action: String,
  unit_id: String,
});
const unitStore = useUnitStore();
const lessonStore = useLessonStore();

if (props.id != '0') {
  lessonStore.load(+props.id);
} else {
  lessonStore.newLesson();
}

if (+props.unit_id != unitStore.unit?.id) unitStore.load(+props.unit_id);

const editLesson = async (targetLesson: Lesson) => {
  let lid: number | undefined = 0;
  if (targetLesson.id === 0) {
    lid = await lessonStore.insertLesson(+props.unit_id);
  } else {
    lid = await lessonStore.updateLesson();
  }
  router.push({ name: 'olsLesson', params: { id: lid } });
}

const deleteLesson = () => {
  lessonStore.deleteLesson();
  router.push({ name: 'olsUnit', params: { id: props.unit_id } });
}
</script>

<template>
  <h1>{{ unitStore.courseName }}</h1>
  <h2>{{ unitStore.unit.name ? unitStore.unit.name : '(Unit Name)' }}</h2>
  <h3>Lesson ({{ props.action }})</h3>
  <form>
    <div class="form-check form-switch form-check-reverse">
      <input v-model="lessonStore.lesson.live" type="checkbox" class="form-check-input" id="switchLessonLive">
      <label for="switchLessonLive" class="form-check-label">Lesson Live Switch</label>
    </div>
    <div class="form-floating mb-3">
      <input placeholder="new lesson" v-model="lessonStore.lesson.name" type="text" class="form-control" id="lessonName"
        aria-describedby="lessonNameHelp">
      <label for="lessonName">Name</label>
      <div id="lessonNameHelp" class="form-text">The lesson name needs to be unique for the unit.</div>
    </div>
    <div class="form-floating">
      <textarea v-model="lessonStore.lesson.content" class="form-control" placeholder="Enter lesson detail here"
        id="lessonContent" style="height: 100px"></textarea>
      <label for="lessonContent">Content</label>
    </div>
  </form>
  <br />
  <Markdown :source="lessonStore.lesson.content" class="markdown" />

  <div class="p-2">
    <button @click="editLesson(lessonStore.lesson)" class="btn btn-primary">Save Lesson</button>
    &nbsp;
    <button @click="deleteLesson()" class="btn btn-primary">Delete Lesson</button>
  </div>
</template>
