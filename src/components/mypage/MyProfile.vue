<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "/src/api/http-common";
import { useRoute } from "vue-router";

const http = Axios();
const authStore = useAuthStore();
const route = useRoute();

// 데이터 정의
const mbti = ref("ISTJ");
const gender = ref("남"); // 예시 성별
const score = ref(72);
const introduction = ref("안녕하세요!! 같이 여행가요!");
const recentMatch = ref("아직 매칭을 안하셨네요~^^");
const recentReview = ref("아직 후기를 안올리셨네요~^^");

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

    // const matchResponse = await http.get("/api/member/recentMatch");
    // const matchData = matchResponse.data;
    // recentMatch.value = matchData;

    // const reviewResponse = await http.get("/api/member/recentReview");
    // const reviewData = reviewResponse.data;
    // recentReview.value = reviewData;
  } catch (error) {
    console.error("Error fetching profile data:", error);
  }
};

// 컴포넌트가 마운트될 때 API 호출
onMounted(() => {
  fetchProfileData();
});
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
    <div class="profile-section">
      <h3>자기 소개</h3>
      <div class="card">
        <p>{{ introduction }}</p>
      </div>
    </div>
    <div class="profile-section">
      <h3>최근 매칭 게시물</h3>
      <div class="card">
        <p>{{ recentMatch }}</p>
      </div>
    </div>
    <div class="profile-section">
      <h3>최근 여행 후기</h3>
      <div class="card">
        <p>{{ recentReview }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile {
  /* background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1); */
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
  text-align: left; /* 회원 정보 왼쪽 정렬 */
}

.profile-info {
  font-size: 18px;
  color: #555;
  text-align: left; /* 회원 정보 왼쪽 정렬 */
  font-weight: bold;
}

.profile-info .mbti {
  margin-bottom: 20px; /* MBTI와 매너 지수 사이에 공간 추가 */
}

.profile-info .gender {
  display: flex;
  align-items: center;
}

.gender span {
  font-size: 18px; /* 성별 한자 크기 조정 */
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

.profile-section h3 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  border-bottom: 2px solid #00aaff;
  display: inline-block;
}

.card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  font-size: 18px;
  color: #555;
}

.card p {
  margin: 0;
}
</style>
