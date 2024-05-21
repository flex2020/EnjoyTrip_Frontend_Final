<script setup>
import { ref, onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "@/api/http-common";
import { useRoute, useRouter } from "vue-router";

const http = Axios();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// 데이터 정의
const mbti = ref("ISTJ");
const gender = ref("남"); // 예시 성별
const score = ref(72);
const introduction = ref("안녕하세요!! 같이 여행가요!");
const recentMatch = ref("아직 매칭을 안하셨네요~^^");
const recentReview = ref({
  reviewTitle: "아직 후기를 안올리셨네요~^^",
  previewContent: "",
  hit: 0,
  likeCount: 0,
  registerTime: "",
  reviewId: null,
});

// 텍스트 자르기 함수
const truncateText = (text, length) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

// API 호출 메소드
const fetchProfileData = async () => {
  try {
    const profileResponse = await http.post("/member/info", {
      memberId: route.params.memberId,
    });
    const profileData = profileResponse.data;
    console.log(profileData);
    mbti.value = profileData.mbti;
    gender.value = profileData.gender; // 성별 데이터 추가
    score.value = profileData.score;
    introduction.value = profileData.intro;

    // 최근 여행 후기 불러오기
    const reviewResponse = await http.get("/review/recently", {
      params: {
        loginUserId: authStore.getMemberId,
        targetUserId: route.params.memberId,
      },
    });
    const reviewData = reviewResponse.data;
    if (reviewData.reviewId) {
      recentReview.value = {
        reviewTitle: truncateText(reviewData.reviewTitle, 12),
        previewContent: truncateText(reviewData.previewContent, 25),
        hit: reviewData.hit,
        likeCount: reviewData.likeCount,
        registerTime: new Date(reviewData.registerTime).toLocaleDateString(),
        reviewId: reviewData.reviewId,
      };
    }
  } catch (error) {
    console.error("Error fetching profile data:", error);
  }
};

// 리뷰 상세보기로 이동
const goToReview = (reviewId) => {
  router.push({
    name: "review-view",
    params: { viewid: reviewId },
  });
};

// 컴포넌트가 마운트될 때 API 호출
onMounted(() => {
  fetchProfileData();
});

watch(() => route.params.memberId, fetchProfileData);
</script>

<template>
  <div class="profile">
    <div class="profile-header">
      <h2>회원 정보</h2>
      <div class="profile-info">
        <div class="score-container">
          <p>매너 지수</p>
          <div class="score-bar">
            <div class="score" :style="{ width: `${score}%` }"></div>
          </div>
          <span>{{ score }}점</span>
        </div>
        <p class="mbti">MBTI : {{ mbti }}</p>
        <p class="gender">
          성별 :
          <span v-if="gender === '1'">남</span>
          <span v-if="gender === '0'">여</span>
        </p>
      </div>
    </div>
    <div class="profile-section intro-section">
      <h3>자기 소개</h3>
      <div class="card intro-card">
        <p>{{ introduction }}</p>
      </div>
    </div>
    <div class="profile-section match-section">
      <h3>최근 매칭 게시물</h3>
      <div class="card hover-card">
        <p>{{ recentMatch }}</p>
      </div>
    </div>
    <div
      class="profile-section review-section"
      @click="goToReview(recentReview.reviewId)"
      v-if="recentReview.reviewId"
    >
      <h3>최근 여행 후기</h3>
      <div class="card hover-card">
        <div class="review-header">
          <h3>{{ recentReview.reviewTitle }}</h3>
          <div class="review-meta">
            <span class="review-hits">Hits: {{ recentReview.hit }}</span>
            <span class="review-likes">Likes: {{ recentReview.likeCount }}</span>
            <span class="review-date">Date: {{ recentReview.registerTime }}</span>
          </div>
        </div>
        <p>{{ recentReview.previewContent }}</p>
      </div>
    </div>
    <div class="profile-section review-section" v-else>
      <h3>최근 여행 후기</h3>
      <div class="card">
        <p>{{ truncateText(recentReview.reviewTitle, 25) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile {
  padding: 15px;
  width: 100%;
  height: 100%;
  margin: auto;
}

.profile-header {
  margin-bottom: 30px;
}

.profile-header h2 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: left;
}

.profile-info {
  font-size: 18px;
  color: #555;
  text-align: left;
  font-weight: bold;
}

.profile-info .mbti {
  margin-bottom: 20px;
}

.profile-info .gender {
  display: flex;
  align-items: center;
}

.gender span {
  font-size: 18px;
  margin-left: 8px;
}

.score-container {
  display: flex;
  align-items: center;
  margin: 30px 0px 30px;
}

.score-bar {
  background: #e0e0e0;
  border-radius: 10px;
  width: 70%;
  height: 12px;
  margin: 0 10px;
  overflow: hidden;
}

.score {
  background: #00aaff;
  height: 100%;
  border-radius: 10px;
}

.profile-section {
  margin-bottom: 30px;
}

.profile-section > h3 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  border-bottom: 2px solid #00aaff;
  display: inline-block;
}

/* Card styles */
.card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  font-size: 18px;
  color: #555;
}

/* Hover card styles */
.hover-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
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

/* Custom styles for intro section */
.intro-section .card {
  background: #fafafa;
  border: 1px solid #ccc;
}

.intro-card {
  background: #f0f8ff;
}

.review-header h3 {
  margin: 0;
  font-size: 22px;
  color: #333;
}
</style>
