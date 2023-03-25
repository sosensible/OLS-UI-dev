<script setup lang="ts">
import { useMediaControls } from '@vueuse/core'
import { ref, onMounted, type Ref, unref } from 'vue'
import { useLessonStore } from '@/stores/learn/lesson';
import type { OLS } from "../../types/ols";
import OLSCommentor from '@/components/ols/OLSCommenter.vue'
import { useUserStore } from '../../stores/user';

const lessonStore = useLessonStore();
const userStore = useUserStore();

onMounted(() => {
  // modal start
  const myModal: HTMLElement | null = document.getElementById('myModal')
  // const myInput = document.getElementById('commentModal')

  // @ts-ignore
  // myModal.style.display = "block";
  // myModal?.classList.add("show");
  // myModal.addEventListener('shown.bs.modal', () => {
  //   // myInput.focus()
  // })
  // modal end
})

const commentor = ref()
const target = ref(2)
const props = defineProps({
  source: String,
});
const video = ref()
const commentButton = ref()
const playButton = ref()
const {
  tracks,
  enableTrack, playing, currentTime, duration, volume
} = useMediaControls(video, {
  src: props.source,
  tracks: [
    {
      default: true,
      src: './subtitles.vtt',
      kind: 'subtitles',
      label: 'English',
      srcLang: 'en',
    },
  ]
})

const addComment = () => {
  if (playing._value) playButton.value.click();
  const newComment: OLS['StoreInsert']['Comment'] = {
    id: -1,
    commentor: userStore.user.id,
    course: lessonStore.courseID,
    content_type: "video",
    detail: "",
    position: currentTime._value,
    target_id: lessonStore.getActiveContent?.id,
    target_type: "lesson_content"
  }
  lessonStore.lesson_comments.push(newComment);
  commentButton.value.click();
}

const showPosition = (targetPosition) => {
  currentTime.value = targetPosition;
}
</script>

<template>
  <div>
    <video ref="video" controls style="width: 100%;" />
    <br>
    <button ref="playButton" @click="playing = !playing" class="btn btn-primary">Play / Pause</button>
    <br>
    <button @click="addComment(playing)" class="btn btn-primary">Add Comment</button>
    <br>
    <button ref="commentButton" type="button" class="btn btn-primary" data-bs-toggle="modal"
      data-bs-target="#commentModal">
      Show comments
    </button>

    <OLSCommentor ref="commentor" :show="showModal" :comments="lessonStore.lesson_comments"
      @setVideoPosition="showPosition" :comment-handler="lessonStore" :target_id="lessonStore.getActiveContent.id" />
  </div>
</template>