<script setup lang="ts">

const props = defineProps({
  source: String,
});
</script>

<template>
  <div class="embed-responsive embed-responsive-16by9">
    <iframe class="embed-responsive-item" :src="'https://www.youtube.com/embed/' + props.source + '?rel=0'"
      allowfullscreen></iframe>
  </div>
</template>