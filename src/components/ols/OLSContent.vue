<script setup lang="ts">
import { ref } from 'vue';
import Markdown from 'vue3-markdown-it';
import OLSFrame from '@/components/ols/OLSFrame.vue';
import OLSVideo from '@/components/ols/OLSVideo.vue';
import OLSYouTube from '@/components/ols/OLSYouTube.vue';

const props = defineProps({
  content: Object | String | Array,
  type: String,
});
</script>

<template>
  <div>
    <Markdown :source="props.content" v-if="props.type == 'markdown'" />
    <OLSFrame :source="props.content" v-if="props.type == 'framed'" />
    <OLSVideo :source="'/course/52/video/' + props.content" v-if="props.type == 'video'" />
    <OLSYouTube :source="props.content" v-if="props.type == 'youtube'" />
  </div>
</template>
