<script setup lang="ts">
import type { OLS } from "../../types/ols";

const { comments, commentHandler, target_id } = defineProps<{
  comments: OLS['Store']['Comment'][],
  target_id: Number,
  commentHandler: any,
}>()

const removeComment = (xcomment) => {
  // console.log('extract', extract)
  // console.log('comments', comments)
  commentHandler.deleteComment(xcomment);
  // const removeID = comments.findIndex(comment => comment.id === extract.id);
  // console.log('removeID', removeID)
  // commentHandler.deleteComment(removeID);
  // if (removeID > -1) comments.splice(removeID, 1);
}

const close = () => {
  comments.forEach((comment) => {
    if (comment.id < 0) {
      comment.id = 0;
      commentHandler.saveComment(comment);
    }
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
            <div class="input-group mb-3" v-if="comment.target_id === target_id">
              <div class="input-group-text" v-if="false">
                <input class="form-check-input mt-0" type="checkbox" :value="0"
                  aria-label="Checkbox for following text input">
              </div>
              <button type="button" class="btn btn-danger" @click="removeComment(comment)">x</button>
              <input type="text" class="form-control" aria-label="Text input with checkbox" v-model="comment.detail"
                :disabled="comment.id >= 0">
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