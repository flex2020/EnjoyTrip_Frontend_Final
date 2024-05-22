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
const recentMatch = ref({
  matchTitle: "아직 매칭을 안하셨네요~^^",
  travelStartDate: "",
  travelEndDate: "",
  nowPeople: 0,
  maxPeople: 0,
  deadline: "",
  content: "",
  hashtags: [],
  hit: 0,
  matchId: null,
});
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
    introduction.value = profileData.intro;

    // score / valuedCount 계산 및 소수점 버리기
    if (profileData.valuedCount > 0) {
      score.value = Math.floor(profileData.score / profileData.valuedCount);
    } else {
      score.value = profileData.score; // valuedCount가 0인 경우 그대로 설정
    }

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

    // 최근 매칭 게시글 불러오기
    const matchResponse = await http.get("/match/find/matches", {
      params: {
        memberId: route.params.memberId,
      },
    });
    const matchData = matchResponse.data.matchByMemberId;
    if (matchData && matchData.length > 0) {
      const recent = matchData[0];
      recentMatch.value = {
        matchTitle: truncateText(recent.matchTitle, 13),
        travelStartDate: new Date(recent.travelStartDate).toLocaleDateString(),
        travelEndDate: new Date(recent.travelEndDate).toLocaleDateString(),
        nowPeople: recent.nowPeople,
        maxPeople: recent.maxPeople,
        deadline: new Date(recent.deadline).toLocaleDateString(),
        content: truncateText(recent.content, 30),
        hashtags: recent.hashtags,
        hit: recent.hit,
        matchId: recent.matchId,
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

// 매칭 상세보기로 이동
const goToMatch = (matchId) => {
  router.push({
    name: "match-view",
    params: { matchid: matchId },
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
      </div>
    </div>
    <div class="profile-section intro-section">
      <h3>자기 소개</h3>
      <div class="card intro-card">
        <p>{{ introduction }}</p>
      </div>
    </div>
    <div class="profile-section match-section" @click="goToMatch(recentMatch.matchId)">
      <h3>최근 매칭 게시물</h3>
      <div class="card hover-card">
        <div class="match-header">
          <h3>{{ recentMatch.matchTitle }}</h3>
          <div class="match-meta">
            <span class="match-dates"
              >여행 기간: {{ recentMatch.travelStartDate }} - {{ recentMatch.travelEndDate }}</span
            >
            <span class="match-people"
              >인원: {{ recentMatch.nowPeople }} / {{ recentMatch.maxPeople }}</span
            >
          </div>
        </div>
        <div class="match-content">
          <p>{{ recentMatch.content }}</p>
        </div>
        <div class="match-footer">
          <div class="match-hashtags">
            <span v-for="hashtag in recentMatch.hashtags" :key="hashtag" class="hashtag"
              >#{{ hashtag }}</span
            >
          </div>
          <div class="match-deadline-status">
            <span class="match-deadline">신청 마감: {{ recentMatch.deadline }}</span>
            <span
              class="recruitment-status"
              :class="{
                active: new Date() < new Date(recentMatch.deadline),
                completed: new Date() >= new Date(recentMatch.deadline),
              }"
            >
              {{ new Date() < new Date(recentMatch.deadline) ? "모집중" : "모집완료" }}
            </span>
          </div>
        </div>
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
  margin-bottom: 20px;
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

/* .profile-info .mbti {
  margin-bottom: 20px;
} */

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
  margin: 0px 0px 15px;
}

.score-bar {
  background: #e0e0e0;
  border-radius: 10px;
  width: 75%;
  height: 15px;
  margin: 0 20px;
  overflow: hidden;
}

.score {
  background: #00aaff;
  height: 100%;
  border-radius: 10px;
}

.profile-section {
  margin-bottom: 15px;
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

.match-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.match-header h3 {
  margin: 0;
  font-size: 22px;
  color: #333;
}

.match-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 14px;
  color: #555;
  margin-top: 0.5rem;
}

.match-dates,
.match-people {
  margin: 5px 0;
}

.match-content p {
  margin-bottom: 25px;
  font-size: 16px;
  color: #555;
}

.match-hashtags {
  margin-bottom: 0.5rem;
}

.hashtag {
  display: inline-block;
  background: #f0f0f0;
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 5px;
  font-size: 14px;
  color: #555;
}

.match-footer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 14px;
  color: #555;
}

.match-deadline-status {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.match-deadline,
.match-hit {
  background: #f0f0f0;
  padding: 5px 10px;
  border-radius: 5px;
}

.recruitment-status {
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
}

.recruitment-status.active {
  background-color: #4caf50; /* Green */
  color: white;
}

.recruitment-status.completed {
  background-color: #f44336; /* Red */
  color: white;
}
</style>
