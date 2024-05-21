<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "/src/api/http-common";

const http = Axios();
const authStore = useAuthStore();
const reviews = ref([]);

const fetchReviews = async () => {
  try {
    // const response = await http.post("/reviews/member", {
    //   memberId: authStore.getMemberId, // 로그인된 사용자 ID를 사용
    // });
    reviews.value = response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
};

onMounted(() => {
  fetchReviews();
});
</script>

<template>
  <div class="user-reviews">
    <h2>여행 후기</h2>
    <div v-for="review in reviews" :key="review.review_id" class="review-item">
      <div class="review-header">
        <h3>{{ review.review_title }}</h3>
        <div class="review-meta">
          <span class="review-score">Score: {{ review.scope }}</span>
          <span class="review-hits">Hits: {{ review.hit }}</span>
          <span class="review-likes">Likes: {{ review.like_count }}</span>
        </div>
      </div>
      <p>{{ review.content }}</p>
    </div>
  </div>
</template>

<style scoped>
.user-reviews {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
}

.user-reviews h2 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: left; /* 회원 정보 왼쪽 정렬 */
}

.review-item {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.review-meta {
  display: flex;
  gap: 10px;
  font-size: 14px;
  color: #555;
}

.review-score,
.review-hits,
.review-likes {
  background: #f0f0f0;
  padding: 5px 10px;
  border-radius: 5px;
}

.review-item p {
  margin: 1rem 0 0;
  color: #555;
  font-size: 16px;
}
</style>
