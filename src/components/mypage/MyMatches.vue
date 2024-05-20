<template>
  <div class="user-matches">
    <h2>매칭 게시물</h2>
    <div v-for="match in matches" :key="match.id" class="match-item">
      <h3>{{ match.title }}</h3>
      <p>{{ match.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const matches = ref([
  { id: 1, title: "Match 1", content: "This is the content of match 1." },
  { id: 2, title: "Match 2", content: "This is the content of match 2." },
]);
</script>

<style scoped>
.user-matches {
  max-width: 800px;
  margin: auto;
}

.match-item {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.match-item h3 {
  margin-bottom: 0.5rem;
}

.match-item p {
  margin: 0;
}
</style>
