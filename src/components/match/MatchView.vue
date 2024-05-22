<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "@/api/http-common";
import VKakaoMapForReview from "@/components/common/VKakaoMapForReview.vue";
import { postMatchesByMemberId } from "@/api/match";

const http = Axios();
const authStore = useAuthStore();

const route = useRoute();
const router = useRouter();

const matchId = ref(route.params.matchid);

const match = ref({});
const isMyMatch = ref(false);

onMounted(() => {
  getMatch();
});

const getMatch = async () => {
  const response = await http.get(`match/find/${matchId.value}`);
  match.value = response.data.resdata;
};

const registerMatch = async () => {
  try {
    const formData = new FormData();
    formData.append("memberId", authStore.getMemberId);
    formData.append("matchId", match.value.matchId);
    await postMatchesByMemberId(formData);
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <div id="head-image">
    <div>{{ match.matchTitle }}</div>
  </div>
  <div id="match-view-container">
    <div class="profile-section">
      <div class="profile-image">
        <img src="@/assets/img/profileDefault.png" alt="프로필 이미지" />
    <div id="match-view-author-id">작성자 : {{ match.nickName }}</div>
    <div id="match-view-info">
      <div>
        <div>여행 기간 : {{ match.travelStartDate }} ~ {{ match.travelEndDate }}</div>
        <div>현재 인원 : {{ match.nowPeople }}</div>
        <div>최대 인원 : {{ match.maxPeople }}</div>
      </div>
      <div class="profile-info">
        <div class="profile-name">{{ match.nickName }}</div>
        <div class="profile-hashtags">
          <span v-for="hashtag in match.hashtags" :key="hashtag" class="hashtag"
            >#{{ hashtag }}</span
          >
        </div>
      </div>
    </div>
    <div class="match-content-section">
      <div class="match-info-section">
        <div class="match-info-item">
          <div class="match-info-title">여행 기간</div>
          <div class="match-info-content">
            {{ match.travelStartDate }} ~ {{ match.travelEndDate }}
          </div>
        </div>
        <div class="match-info-item">
          <div class="match-info-title">성별 제한</div>
          <div class="match-info-content">{{ match.genderType }}</div>
        </div>
        <div class="match-info-item">
          <div class="match-info-title">모집마감 일자</div>
          <div class="match-info-content">{{ match.deadline }}</div>
        </div>
        <div class="match-info-item">
          <div class="match-info-title">현재 인원</div>
          <div class="match-info-content">{{ match.nowPeople }} / {{ match.maxPeople }}</div>
        </div>
        <div class="match-info-item">
          <div class="match-info-title">조회수</div>
          <div class="match-info-content">{{ match.hit }}</div>
        </div>
        <div class="match-info-item">
          <div class="match-info-title">좋아요</div>
          <div class="match-info-content">{{ match.likeCount }}</div>
        </div>
        <div class="match-info-item full-width">
          <div class="match-info-title">이런 사람을 원해요</div>
          <div class="match-info-content">{{ match.content }}</div>
        </div>
      </div>
      <div class="match-course-section">
        <div class="course-title">여행 코스</div>
        <VKakaoMapForReview v-if="match.matchId" :match-id="match.matchId" />
      </div>
    </div>
    <div>마감 일자 : {{ match.deadline }}</div>
    <div>성별 제한 : {{ match.genderType }}</div>
    <div v-for="hashtag in match.hashtags" :key="hashtag"># {{ hashtag }}</div>
    <div id="btn-container">
      <div id="divider"></div>
      <div id="btns">
        <router-link
          :to="{ name: 'match-update', params: { matchid: match.matchId } }"
          class="move-link"
        >
          게시글 수정
        </router-link>
        <router-link :to="{ name: 'match-list' }" class="move-link"> 게시글 목록 </router-link>
        <button type="button" class="move-link" @click="registerMatch">신청하기</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#head-image {
  width: 100%;
  height: 500px;
  background-image: url("/src/assets/img/reviewpage.png");
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 56px;
  background-repeat: no-repeat;
  margin-bottom: 20px;
}
#head-image div {
  margin-bottom: 30px;
}

#match-view-container {
  padding: 30px;
  margin: 0 auto;
  max-width: 1200px;
}

.profile-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.profile-image img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.profile-info {
  margin-left: 20px;
}

.profile-name {
  font-size: 24px;
  font-weight: bold;
}

.profile-hashtags .hashtag {
  display: inline-block;
  background: #e0e0e0;
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 5px;
  font-size: 14px;
}

.match-content-section {
  display: flex;
  justify-content: space-between;
}

.match-info-section {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-right: 20px;
}

.match-course-section {
  flex: 1;
}

.match-info-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
}

.match-info-title {
  font-size: 16px;
  font-weight: bold;
  color: #555;
  margin-bottom: 5px;
}

.match-info-content {
  font-size: 18px;
}

.match-info-item.full-width {
  flex: 1;
}

#match-view-contents {
  font-size: 16px;
  color: #333;
  margin-bottom: 30px;
}

#match-view-course {
  margin-top: 30px;
}

.course-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}

#btn-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#divider {
  width: 100%;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.3);
  margin-top: 50px;
}

#btns {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 50px 0px;
}

.move-link {
  width: 120px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  border: none;
  border-radius: 10px;
  background-color: black;
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.move-link:hover {
  background-color: #333;
  cursor: pointer;
}

.like-container {
  position: relative;
  width: 30px;
  height: 30px;
}

.like-container img {
  position: absolute;
  top: 5px;
  left: 0;
  transition: opacity 0.5s ease;
  opacity: 0;
  cursor: pointer;
}

.like-container img.active {
  opacity: 1;
}
</style>
