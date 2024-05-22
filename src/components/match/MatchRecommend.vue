<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "@/api/http-common";
import { useRouter, useRoute } from "vue-router";
import { getMatchRecommend } from "@/api/gpt";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const truncateText = (text, length) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

const goToMatch = (matchId) => {
  document.body.style.overflow = '';
  router.push({ name: 'match-view', params: { matchid: matchId } });
}

const props = defineProps({
  matchRecommendList: Array,
});

</script>

<template>
  <div class="user-reviews">
    <h2>맞춤 매칭 게시물</h2>
    <div v-if="matchRecommendList.length > 0" class="reviews-container">
      <div
        v-for="match in matchRecommendList"
        :key="match.matchId"
        class="review-item"
        @click="goToMatch(match.matchId)"
      >
        <div class="review-header">
          <h3>{{ truncateText(match.matchTitle, 12) }}</h3>
          <div class="review-meta">
            <span class="review-hits">Hits: {{ match.hit }}</span>
            <span class="review-date"
              >모집마감: {{ new Date(match.deadline).toLocaleDateString() }}</span
            >
          </div>
        </div>
        <p>{{ truncateText(match.content, 25) }}</p>
      </div>
    </div>
    <div v-else>
      <p>후기가 없습니다.</p>
    </div>
  </div>
</template>

<style scoped>
.user-reviews {
  z-index: 100005;
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: white;
  /* background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1); */
  width: 100%;
  height: 600px;
  overflow-y: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
}

.user-reviews h2 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
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
