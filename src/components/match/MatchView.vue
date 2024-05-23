<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "@/api/http-common";
import VKakaoMapForReview from "@/components/common/VKakaoMapForReview.vue";
import { postMatchesByMemberId } from "@/api/match";
import { useMatchStore } from "@/stores/match";
import { useChatListStore } from "@/stores/chatlist";

const http = Axios();
const authStore = useAuthStore();
const matchStore = useMatchStore();
const chatlistStore = useChatListStore();
const route = useRoute();
const router = useRouter();

const matchId = ref(route.params.matchid);

const match = ref({});
const isMyMatch = ref(false);
const profileImage = ref('/src/assets/img/profileDefault.png');
const authorId = ref('');

onMounted(() => {
  getMatch();
});

const getMatch = async () => {
  const response = await http.get(`match/find/${matchId.value}`);
  match.value = response.data.resdata;
  authorId.value = match.value.authorId;

  const profileResponse = await http.get(`/match/profile/${matchId.value}`);
  console.log('profile', profileResponse)
  // 프로필 이미지가 존재하면 업데이트
  if (profileResponse.data) {
    
    profileImage.value = profileResponse.data;
  }

};

const registerMatch = async () => {
  const matchId = route.params.matchid;
  if (chatlistStore.checkIncludes(matchId)) {
    alert('이미 신청한 매칭입니다.');
    return;
  }
  try {
    const formData = new FormData();
    formData.append("memberId", authStore.getMemberId);
    formData.append("matchId", match.value.matchId);
    await postMatchesByMemberId(formData);
    alert("신청이 완료되었습니다.");
  } catch (e) {
    console.log(e);
  }
};

const goToMyPage = () => {
  router.push({ name: 'mypage', params: { memberId: authorId.value } });
};

const searchByHashtag = (hashtag) => {
  matchStore.setHashtag(hashtag);
  router.push({ name: 'match-list'});
};
</script>

<template>
  <div id="head-image">
    <div class="match-title">{{ match.matchTitle }}</div>
  </div>
  <div id="match-view-container">
    <div class="profile-section">
      <div class="profile-info" @click="goToMyPage">
        <div class="profile-image">
          <img :src="profileImage" alt="프로필 이미지" />
        </div>
        <div>
          <div class="profile-name">{{ match.nickName }}</div>
        </div>
      </div>
      <div class="profile-stats">
        <div class="profile-hit">
          <img src="@/assets/img/fontawesome/eye-solid.svg" width="30px" class="hit-icon" />
          <span class="hit-count">{{ match.hit }}</span>
        </div>
      </div>
    </div>
    <div class="hashtag-section">
      <div class="profile-hashtags">
        <span v-for="hashtag in match.hashtags" :key="hashtag" class="hashtag" @click="searchByHashtag(hashtag)">
          #{{ hashtag }}
        </span>
      </div>
    </div>
    <div class="match-content-section">
      <div class="match-course-section">
        <div class="course-title">여행 코스</div>
        <VKakaoMapForReview v-if="match.matchId" :match-id="match.matchId" />
      </div>
      <div class="match-info-section">
        <div class="match-info-item">
          <div class="left-column">
            <div class="match-info-title">여행 기간</div>
            <div class="match-info-content">
              {{ match.travelStartDate }} ~ {{ match.travelEndDate }}
            </div>
          </div>
          <div class="right-column">
            <div class="match-info-title">성별 제한</div>
            <div class="match-info-content">
              {{ match.genderType == 0 ? '성별 무관' : (match.genderType == 1 ? '남성만' : '여성만') }}
            </div>
          </div>
        </div>
        <div class="match-info-item">
          <div class="left-column">
            <div class="match-info-title">모집마감 일자</div>
            <div class="match-info-content">{{ match.deadline }}</div>
          </div>
          <div class="right-column">
            <div class="match-info-title">현재 인원</div>
            <div class="match-info-content">{{ match.nowPeople }} / {{ match.maxPeople }}</div>
          </div>
        </div>
        <div class="match-info-item full-width" id="match-content-container">
          <div class="match-info-title">이런 사람을 원해요</div>
          <div class="match-info-content" v-html="match.content"></div>
        </div>
      </div>
    </div>
    <div id="btn-container">
      <div id="divider"></div>
      <div id="btns">
        <router-link
          v-if="authorId === authStore.getMemberId"
          :to="{ name: 'match-update', params: { matchid: match.matchId } }"
          class="move-link btn"
        >
          게시글 수정
        </router-link>
        <router-link :to="{ name: 'match-list' }" class="move-link btn"> 게시글 목록 </router-link>
        <button v-if="authorId !== authStore.getMemberId" type="button" class="move-link btn" @click="registerMatch">신청하기</button>
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
  justify-content: flex-end; /* 변경된 부분: 최하단으로 옮김 */
  align-items: center;
  color: white;
  font-weight: bold;
  background-repeat: no-repeat;
  margin-bottom: 20px;
}
#head-image .match-title {
  font-size: 56px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 30px;
}

#match-view-container {
  padding: 30px;
  margin: 0 auto;
  max-width: 1200px;
}

.profile-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.profile-info {
  display: flex;
  align-items: center;
  cursor: pointer; /* 클릭 가능하게 커서 변경 */
}

.profile-image img {
  width: 80px; /* 이미지 사이즈 조정 */
  height: 80px; /* 이미지 사이즈 조정 */
  border-radius: 50%;
}

.profile-info > div {
  margin-left: 20px;
}

.profile-name {
  font-size: 24px;
  font-weight: bold;
}

.profile-stats {
  display: flex;
  align-items: center;
}

.profile-hit {
  display: flex;
  align-items: center;
}

.hit-icon {
  margin-right: 10px; /* Optional: space between icon and count */
}

.hit-count {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.hashtag-section {
  margin-bottom: 20px; /* hashtag-section 추가 */
}

.profile-hashtags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hashtag {
  background-color: #f0f0f0;
  border-radius: 20px;
  padding: 5px 15px;
  font-size: 14px;
  color: #333;
  border: 1px solid #ddd;
  transition: all 0.3s ease;
  cursor: pointer;
}

.hashtag:hover {
  background-color: #e0e0e0;
  border-color: #ccc;
}

.match-content-section {
  display: flex;
  justify-content: space-between;
}

.match-course-section {
  flex: 6;
}

.match-info-section {
  flex: 4;
  display: flex;
  flex-direction: column;
  margin-left: 40px;
  padding-top: 40px;
}

.match-info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 50px;
}

#match-content-container {
  display: flex;
  flex-direction: column;
}

.left-column {
  flex: 1;
}

.right-column {
  flex: 1;
  padding-left: 30px;
}

.match-info-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}

.match-info-content {
  font-size: 18px;
  line-height: 1.5;
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
  margin: 40px 0px;
}

.move-link.btn {
  position: relative;
  background-color: #fff;
  color: #000;
  border: 2px solid #000;
  padding: 2px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  font-family: inherit;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  line-height: 40px;
  z-index: 2;
  transition: background-color 0.3s, color 0.3s;
  margin: 0px 20px;
  width: 250px;
}

.move-link.btn:hover {
  color: #fff;
  background-color: #000;
}

.move-link.btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  background-color: #000;
  border-radius: 5px;
  z-index: -1;
  transition: height 0.3s ease;
}

.move-link.btn:hover::before {
  height: 100%;
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
