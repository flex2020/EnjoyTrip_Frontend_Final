<template>
  <div class="user-comments">
    <h2>댓글</h2>
    <div v-for="comment in comments" :key="comment.id" class="comment-item">
      <p>{{ comment.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const comments = ref([
  { id: 1, content: "This is the first comment." },
  { id: 2, content: "This is the second comment." },
]);
</script>

<style scoped>
.user-comments {
  max-width: 800px;
  margin: auto;
}

.comment-item {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
