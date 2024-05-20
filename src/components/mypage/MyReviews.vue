<template>
  <div class="user-reviews">
    <h2>여행 후기</h2>
    <div v-for="review in reviews" :key="review.id" class="review-item">
      <h3>{{ review.title }}</h3>
      <p>{{ review.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const reviews = ref([
  { id: 1, title: "Review 1", content: "This is the content of review 1." },
  { id: 2, title: "Review 2", content: "This is the content of review 2." },
]);
</script>

<style scoped>
.user-reviews {
  max-width: 800px;
  margin: auto;
}

.review-item {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.review-item h3 {
  margin-bottom: 0.5rem;
}

.review-item p {
  margin: 0;
}
</style>
