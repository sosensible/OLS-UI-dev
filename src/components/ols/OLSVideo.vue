<script setup lang="ts">

const props = defineProps({
  source: String,
});
</script>

<template>
  <video xwidth="100%" xheight="240" controls style="width: 100%;">
    <source :src="props.source" type="video/mp4">
  </video>
</template>