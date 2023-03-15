<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  id: String,
  header: String,
  title: String,
  image: String,
  content: String,
  footer: String,
});

/* *** notes ***

- manage margins : https://getbootstrap.com/docs/5.3/utilities/spacing/
- sizing options : https://getbootstrap.com/docs/5.3/components/card/#sizing ( https://getbootstrap.com/docs/5.3/utilities/sizing/ )
- text alignment : https://getbootstrap.com/docs/5.3/utilities/text/#text-alignment

# Content Types
* body ( .card-body ) : https://getbootstrap.com/docs/5.3/components/card/#body
* header & footer ( .card-header / .card-footer ) : https://getbootstrap.com/docs/5.3/components/card/#header-and-footer
* images ( .card-image ) : https://getbootstrap.com/docs/5.3/components/card/#images
* links ( .card-text ) : https://getbootstrap.com/docs/5.3/components/card/#titles-text-and-links
* list groups ( .list-group ) : https://getbootstrap.com/docs/5.3/components/card/#list-groups

*** */
</script>

<template>
  <div class="card mb-3">
    <div class="card-header">
      <h2>{{ props.header }}</h2>
    </div>
    <div class="card-body">
      <img :src="props.image" class="card-img-top mb-3" alt="alt text" v-if="props.image">
      <h5 class="card-title" v-if="props.title">{{ props.title }}</h5>
      <p class="card-text">
        <slot></slot>
      </p>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
