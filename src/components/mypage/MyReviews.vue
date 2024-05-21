<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "@/api/http-common";
import { useRouter, useRoute } from "vue-router";

const http = Axios();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const reviews = ref([]);
const memberId = ref(null);

const truncateText = (text, length) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

const fetchReviews = async () => {
  try {
    console.log(authStore.getMemberId + " " + route.params.memberId);
    const response = await http.get("/review/getfollowreviews", {
      params: {
        loginUserId: authStore.getMemberId,
        targetUserId: route.params.memberId,
      },
    });
    reviews.value = response.data;
    console.log(reviews.value);
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
};

const goToReview = (reviewId) => {
  router.push({
    name: "review-view",
    params: { viewid: reviewId },
  });
};

onMounted(() => {
  memberId.value = authStore.getMemberId; // 로그인된 사용자의 ID로 설정
  fetchReviews();
});
</script>

<template>
  <div class="user-reviews">
    <h2>여행 후기</h2>
    <div v-if="reviews.length > 0" class="reviews-container">
      <div
        v-for="review in reviews"
        :key="review.review_id"
        class="review-item"
        @click="goToReview(review.reviewId)"
      >
        <div class="review-header">
          <h3>{{ truncateText(review.reviewTitle, 12) }}</h3>
          <div class="review-meta">
            <span class="review-hits">Hits: {{ review.hit }}</span>
            <span class="review-likes">Likes: {{ review.likeCount }}</span>
            <span class="review-date"
              >Date: {{ new Date(review.registerTime).toLocaleDateString() }}</span
            >
          </div>
        </div>
        <p>{{ truncateText(review.previewContent, 25) }}</p>
      </div>
    </div>
    <div v-else>
      <p>후기가 없습니다.</p>
    </div>
  </div>
</template>

<style scoped>
.user-reviews {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  /* background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1); */
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.user-reviews h2 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: left;
}

.reviews-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-item {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.review-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.review-header h3 {
  margin: 0;
  font-size: 22px;
  color: #333;
}

.review-meta {
  display: flex;
  gap: 1rem;
  font-size: 14px;
  color: #555;
}

.review-hits,
.review-likes,
.review-date {
  background: #f0f0f0;
  padding: 5px 10px;
  border-radius: 5px;
}

.review-item p {
  margin: 0;
  color: #555;
  font-size: 16px;
  line-height: 1.5;
}

/* Custom scrollbar styles */
.user-reviews::-webkit-scrollbar {
  width: 10px;
}

.user-reviews::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 10px;
}

.user-reviews::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.user-reviews::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>
