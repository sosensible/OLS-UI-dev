<script setup lang="ts">
import router from '@/router';
import { useLessonStore, type Lesson } from '@/stores/learn/lesson';
import { useUserStore } from '@/stores/user';
import { computed } from 'vue';
import Markdown from 'vue3-markdown-it';

const props = defineProps({
  id: String,
  action: String
});
const lessonStore = useLessonStore();
const userStore = useUserStore();
lessonStore.load(+props.id);

const editLesson = (targetLesson: Lesson | { id: string }, action: string) => {
  router.push({ name: 'olsLessonEdit', params: { id: targetLesson.id, action: action, unit_id: lessonStore.unitID } });
}

const deleteLesson = () => {
  lessonStore.deleteLesson();
  router.push({ name: 'olsUnit', params: { id: props.unit_id } });
}

const isOwner = computed(() => {
  const userIDSet = userStore.user?.id ? true : false;
  const lessonOwnerSet = lessonStore.courseOwner ? true : false;
  return userIDSet && lessonOwnerSet && lessonStore.courseOwner == userStore.user.id;
});
</script>

<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <RouterLink to="/learn">Courses</RouterLink>
      </li>
      <li class="breadcrumb-item">
        <RouterLink :to="{ name: 'olsCourse', params: { id: lessonStore.getCourseID } }">{{ lessonStore.courseName }}
        </RouterLink>
      </li>
      <li class="breadcrumb-item">
        <RouterLink :to="{ name: 'olsCourse', params: { id: lessonStore.getUnitID } }">{{ lessonStore.unitName }}
        </RouterLink>
      </li>
      <li class="breadcrumb-item active" aria-current="page">{{ lessonStore.lesson?.name }}</li>
    </ol>
  </nav>
  <h1>{{ lessonStore.courseName }}</h1>
  <h2>{{ lessonStore.unitName ? lessonStore.unitName : '(Unit Name)' }}</h2>
  <h3>Lesson ({{ lessonStore.lesson?.name }})</h3>

  id: {{ lessonStore.lesson?.id }}<br />
  Status: {{ lessonStore.lesson?.live ? "live" : "draft" }}<br />
  <p>
    <Markdown :source="lessonStore.lesson.content" class="markdown" />
  </p>

  <div class="p-2">
    <button @click="editLesson(lessonStore.lesson, 'edit')" class="btn btn-primary" v-if="isOwner">Edit Lesson</button>
    &nbsp;
    <button @click="deleteLesson()" class="btn btn-primary" v-if="isOwner">Delete Lesson</button>
  </div>
</template>
