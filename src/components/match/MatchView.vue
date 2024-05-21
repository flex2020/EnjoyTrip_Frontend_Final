<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "/src/api/http-common";
import VKakaoMapForReview from "@/components/common/VKakaoMapForReview.vue";
import { postMatchesByMemberId } from "@/api/match";

const http = Axios();
const authStore = useAuthStore();

const route = useRoute();
const router = useRouter();

// const articleno = ref(route.params.articleno);
const matchId = ref(route.params.matchid);

const match = ref({});
const isMyMatch = ref(false);

onMounted(() => {
  getMatch();
});

const getMatch = async () => {
  const response = await http.get(`match/find/${matchId.value}`);
  // console.log(response.data.resdata);
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
    <div id="match-view-author-id">작성자 : {{ match.nickName }}</div>
    <div id="match-view-info">
      <div>
        <div>
          여행 기간 : {{ match.travelStartDate }} ~ {{ match.travelEndDate }}
        </div>
        <div>현재 인원 : {{ match.nowPeople }}</div>
        <div>최대 인원 : {{ match.maxPeople }}</div>
      </div>
      <div>
        <div>
          <img src="@/assets/img/fontawesome/eye-solid.svg" width="30px" />
          {{ match.hit }}
        </div>
      </div>
    </div>
    <div id="match-view-contents">{{ match.content }}</div>
    <div id="match-view-course">
      <div>여행 코스</div>
      <VKakaoMapForReview v-if="match.matchId" :match-id="match.matchId" />
    </div>

    <div>마감 일자 : {{ match.deadline }}</div>
    <div>성별 제한 : {{ match.genderType }}</div>
    <div v-for="hashtag in match.hashtags"># {{ hashtag }}</div>

    <div id="btn-container">
      <div id="divider"></div>
      <div id="btns">
        <router-link
          :to="{ name: 'match-update', params: { matchid: match.matchId } }"
          class="move-link"
        >
          게시글 수정
        </router-link>
        <router-link :to="{ name: 'match-list' }" class="move-link">
          게시글 목록
        </router-link>
        <button type="button" class="move-link" @click="registerMatch">
          신청하기
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#match-view-container {
  padding-top: 30px;
  margin: 0px 25% 30px;
}

#head-image {
  width: 100%;
  height: 500px;
  background-image: url("/src/assets/img/reviewpage.png");
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 56px;
  background-repeat: no-repeat; /* 이미지 반복 방지 */
  margin-bottom: 20px;
}
#head-image div {
  margin-bottom: 30px;
}

/* #head-image div:last-child {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30px;
} */

#match-view-author-id {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}
#match-view-info {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  margin-bottom: 30px;
}

#match-view-info div:first-child div:first-child {
  margin-bottom: 10px;
}

#match-view-info > div:last-child {
  display: flex;
  align-items: center;
}
#match-view-info > div:last-child > div {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

#match-view-course {
  margin-top: 30px;
}

#match-view-course div:first-child {
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
  justify-content: flex-end;
  margin: 50px 0px;
}

.move-link {
  width: 100px;
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
