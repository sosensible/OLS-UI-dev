<script setup lang="ts">
import type { OLS } from "../../types/ols";

const { comments } = defineProps<{
  comments: OLS['shared']['comment'][]
}>()

const removeComment = (index) => {
  comments.splice(index, 1);
}

const close = () => {
  comments.forEach((comment) => {
    comment.edit = false;
  });
}
</script>

<template>
  <!-- Modal -->
  <div class="modal fade" id="commentModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="commentModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="commentModalLabel">Comments</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div v-for="( comment, index ) in comments" class="row">
            <div class="input-group mb-3">
              <div class="input-group-text" v-if="false">
                <input class="form-check-input mt-0" type="checkbox" :value="0"
                  aria-label="Checkbox for following text input">
              </div>
              <button type="button" class="btn btn-danger" @click="removeComment(index)">x</button>
              <input type="text" class="form-control" aria-label="Text input with checkbox" v-model="comment.detail"
                :disabled="!comment.edit">
              <button type="button" class="btn btn-primary" @click="$emit('setVideoPosition', comment.position)"
                v-if="comment.content_type === 'video'">⏵</button>
            </div>
          </div>
          <div v-if="!comments.length">No comments available on this content.</div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="close">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>