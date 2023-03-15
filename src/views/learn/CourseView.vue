<script setup lang="ts">
import router from '@/router';
import type { Unit } from '@/stores/learn/unit';
import { useCourseStore, type Course } from '@/stores/learn/course';
import { useUserStore } from '@/stores/user';
import Markdown from 'vue3-markdown-it';
import { computed } from 'vue';

import OLSCard from '@/components/ols/OLSCard.vue';

const props = defineProps({
  id: String,
});
const courseStore = useCourseStore();
const userStore = useUserStore();

if (props.id != '0') {
  console.log('loading course');
  courseStore.load(+props.id);
} else {
  courseStore.newCourse();
}

const editCourse = (targetCourse: Course | { id: string }, action?: string) => {
  router.push({ name: 'olsCourseEdit', params: { id: targetCourse.id, action: action } });
}

const editUnit = (targetunit: Unit | { id: string }, action: string) => {
  router.push({ name: 'olsUnitEdit', params: { id: targetunit.id, action: action, course_id: courseStore.course?.id } });
}

const viewUnit = (targetunit: Unit | { id: string }) => {
  router.push({ name: 'olsUnit', params: { id: targetunit.id } });
}

const deleteCourse = () => {
  courseStore.deleteCourse();
  router.push({ name: 'olsMain' });
}

// const isOwner = computed(() => {
//   const userIDSet = userStore.user?.id ? true : false;
//   const courseOwnerSet = courseStore.course?.owner?.id ? true : false;
//   return userIDSet && courseOwnerSet && courseStore.course?.owner?.id == userStore.user.id;
// });

const myImage = (id: Number, imageName: String) => {
  if (imageName.length) {
    return '/course/' + id + '/img/' + imageName;
  }
  return '';
}
</script>

<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <RouterLink to="/learn">Courses</RouterLink>
      </li>
      <li class="breadcrumb-item active" aria-current="page">{{ courseStore.course.name }}</li>
    </ol>
  </nav>
  <h1>{{ courseStore.course.name }}</h1>
  <p>
    by: {{ courseStore.course?.owner?.full_name }}<br />
    <span v-if="courseStore.isOwner">Status: {{ courseStore.course?.live ? "live" : "draft" }}<br /></span>
  </p>
  <p>
    <Markdown :source="courseStore.course.detail" class="markdown" />
  </p>

  <div class="p-2">
    <button @click="editCourse(courseStore.course, 'edit')" class="btn btn-primary" v-if="courseStore.isOwner">Edit
      Course</button>
    &nbsp;
    <button @click="deleteCourse()" class="btn btn-primary" v-if="courseStore.isOwner">Delete
      Course</button>
  </div>
  <div>
    <hr>
    <h2>Units</h2>
    <div class="row pl-3 mr-3">
      <template v-for="unit in courseStore.activeUnitList()" :key="unit.id">
        <div class="col-sm-6 mb-3 mb-sm-0">
          <OLSCard :header="unit.name" :image="myImage(courseStore.course?.id, unit.image)">
            {{ unit.shortDesc }}
            <template v-slot:footer>
              <button @click="viewUnit(unit)" class="btn btn-primary">View Unit</button>
              &nbsp;
              <button @click="editUnit(unit, 'edit')" class="btn btn-primary" v-if="courseStore.isOwner">Edit
                Unit</button>
            </template>
          </OLSCard>
        </div>
      </template>
    </div>
  </div>
  <br />
  <button @click="editUnit({ id: 0 }, 'add')" class="btn btn-primary" v-if="courseStore.isOwner">Add Unit</button>
</template>

<style>
@import '@/assets/markdown';

.card .promo-img {
  width: auto !important;
  /*override the width below*/
  width: 100%;
  max-width: 100%;
  float: left;
  clear: both;
  /* width: -webkit-fill-available; */
}
</style>