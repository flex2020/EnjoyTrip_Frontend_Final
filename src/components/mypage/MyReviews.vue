<script setup>
import { ref, onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "@/api/http-common";
import { useRouter, useRoute } from "vue-router";

const http = Axios();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const reviews = ref([]);
const memberId = ref(null);
const showLikedReviews = ref(false); // 토글 상태를 저장할 변수

const truncateText = (text, length) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

const fetchReviews = async () => {
  try {
    console.log(authStore.getMemberId + " " + route.params.memberId);
    const apiUrl = showLikedReviews.value ? "/review/getlikereviews" : "/review/getfollowreviews";
    const response = await http.get(apiUrl, {
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

watch(showLikedReviews, fetchReviews); // 토글 상태가 변경될 때마다 리뷰를 다시 가져옴
</script>

<template>
  <div class="user-reviews">
    <h2>여행 후기</h2>
    <div class="toggle-container">
      <span class="toggle-text">{{ showLikedReviews ? "좋아요한 후기 보기" : "전체 보기" }}</span>
      <label class="switch">
        <input type="checkbox" v-model="showLikedReviews" />
        <span class="slider"></span>
      </label>
    </div>
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

.toggle-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  margin-right: 10px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.toggle-text {
  font-size: 16px;
  font-weight: bold;
  color: #555;
  padding-right: 10px;
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
