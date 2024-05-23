<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import VMatchListItem from "@/components/match/item/VMatchListItem.vue";
import MatchRecommend from "@/components/match/MatchRecommend.vue";
import VScrollLock from "@/components/common/VScrollLock.vue";
import { Axios } from "/src/api/http-common";
import { getMatchRecommend } from "@/api/gpt";
import { useAuthStore } from "@/stores/auth";
import { useMatchStore } from "@/stores/match";

const http = Axios();
const authStore = useAuthStore();
const matchStore = useMatchStore();
const router = useRouter();

const matches = ref([]);
const currentPage = ref(1);
const totalPageCount = ref(0);
const sortSelect = ref(0);
const inputKeyword = ref("");
const matchRecommendToggle = ref(false);
const matchRecommendList = ref(null);

const { VITE_ARTICLE_LIST_SIZE } = import.meta.env;
const param = ref({
  pgno: currentPage.value,
  spp: VITE_ARTICLE_LIST_SIZE,
  sortKey: sortSelect.value,
  keyword: inputKeyword.value,
  memberId: authStore.getMemberId,
});

onMounted(async () => {
  if(matchStore.hashtag !== ""){
    param.value.keyword = matchStore.hashtag;
    currentPage.value = 1;
    param.value.pgno = currentPage.value;
    inputKeyword.value = matchStore.hashtag;
    matchStore.clearHashtag();
  }
  const response = await getMatchList();
  matches.value = await response.matches;
  console.log(matches.value);
});

const getMatchList = async () => {
  const response = await http.get("match/find/matches", { params: param.value });
  const data = response.data.resdata;
  currentPage.value = data.currentPage;
  totalPageCount.value = data.totalPageCount;

  console.log(data);

  return data;
};

const currentPageAdd = async () => {
  param.value.pgno++;
  const response = await getMatchList();
  for (let i = 0; i < response.matches.length; i++) {
    matches.value.push(response.matches[i]);
  }
  // console.log(matches.value);
};

const changeSortSelect = async () => {
  param.value.sortKey = sortSelect.value;
  currentPage.value = 1;
  param.value.pgno = currentPage.value;
  const response = await getMatchList();
  matches.value = await response.matches;
};

const searchMatch = async () => {
  param.value.keyword = inputKeyword.value;
  currentPage.value = 1;
  param.value.pgno = currentPage.value;
  const response = await getMatchList();
  matches.value = await response.matches;
  // console.log(inputKeyword.value);
  // console.log(response.reviews);
};

const matchRecommend = async () => {
  matchRecommendToggle.value = !matchRecommendToggle.value;
  if (matchRecommendToggle.value) {
    document.body.style.overflow = "hidden";
    const email = authStore.getEmail;
    matchRecommendList.value = await getMatchRecommend(email);
    console.log(matchRecommendList.value);
  } else {
    document.body.style.overflow = "";
    matchRecommendList.value = null;
  }
};

const textToggle = ref(false);

const mouseoverHandler = () => {
  textToggle.value = true;
};

const mouseoutHandler = () => {
  textToggle.value = false;
};

const textClass = computed(() =>
  textToggle.value ? "arrow-box opacity-100" : "arrow-box opacity-0"
);
</script>

<template>
  <div id="match-list-container">
    <div id="match-list-title">
      <div><img src="@/assets/img/together.gif" width="45px"/>여행 메이트 찾기</div>
      <div>함께 여행할 메이트를 찾아보세요</div>
    </div>
    <div
      v-if="matchRecommendToggle && !matchRecommendList"
      class="match-recommend-bg"
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-weight: 700;
        font-size: 30px;
      "
    >
      불러오는 중
    </div>
    <div
      v-if="matchRecommendToggle && matchRecommendList"
      class="match-recommend-bg"
      @click="matchRecommend"
    ></div>
    <MatchRecommend
      v-if="matchRecommendToggle && matchRecommendList"
      :match-recommend-list="matchRecommendList"
    />
    <div id="match-list-function">
      <div id="match-list-select-container">
        <select v-model="sortSelect" @change="changeSortSelect" class="custom-select">
          <option :value="0">최신순</option>
          <option :value="2">조회수순</option>
        </select>
      </div>
      <p :class="textClass">AI가 나와 맞는 매칭 게시물을 추천해줘요!</p>
      <button
        class="match-recommend-btn"
        @click="matchRecommend"
        @mouseover="mouseoverHandler"
        @mouseout="mouseoutHandler"
      >
        <img src="@/assets/img/fontawesome/robot-solid.svg" width="34px" />
      </button>
      <div id="match-list-search">
        <input
          v-model="inputKeyword"
          type="text"
          placeholder="제목, 해시태그, 내용으로 검색해보세요"
          @keyup.enter="searchMatch"
        />
        <button @click="searchMatch">
          <img src="/src/assets/img/fontawesome/magnifying-glass-solid-white.svg" width="25" />
        </button>
      </div>
      <router-link v-if="authStore.isLogin" :to="{ name: 'match-write' }" id="match-list-move-write">
        <img src="@/assets/img/fontawesome/pen-to-square-solid.svg" />
        게시글 작성
      </router-link>
    </div>
    <VMatchListItem
      :matches="matches"
      :currentPage="currentPage"
      :totalPageCount="totalPageCount"
      @currentPageAdd="currentPageAdd"
    />
  </div>
  <div v-if="matches.length == 0" style="text-align: center; font-weight: 700; font-size: 36px; margin-top: 10%;">아직 여행 매칭이 없어요 😢</div>
</template>

<style scoped>
.match-recommend-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #000000aa;
  z-index: 100005;
}
#match-list-container {
  padding-top: 120px;
  margin: 0px 13%;
}

#match-list-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

#match-list-title div:first-child {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 15px;
  display: flex;
  /* border-bottom: 2px solid var(--brand-color); */
}
#match-list-title div:last-child {
  font-size: 18px;
}

#match-list-function {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
}

#match-list-function div {
  width: 33%;
}

#match-list-search {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}

#match-list-search button {
  position: absolute;
  background-color: var(--brand-color);
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  top: 2px;
  right: 0;
  cursor: pointer;
}

#match-list-search input {
  width: 100%;
  height: 40px;
  font-size: 20px;
  padding: 0px 10px;
  border-radius: 10px;
  border: 2px solid var(--brand-color);
}

#match-list-search input:focus {
  outline: none;
}

#match-list-move-write {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  transition: 0.2s;
}

#match-list-move-write:hover {
  transform: scale(110%);
}

#match-list-move-write img {
  width: 30px;
  height: 30px;
  margin-right: 5px;
}

#match-list-select-container select {
  width: 200px;
  height: 40px;
  border-radius: 5px;
  padding-left: 5px;
  margin-right: 5px;
}

.arrow-box {
  position: absolute;
  left: 24%;
  top: -65px;
  width: 183px;
  padding: 8px;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
  background: #333;
  color: #fff;
  font-size: 14px;
  transition: 0.3s;
}

.arrow-box::after {
  position: absolute;
  bottom: -45%;
  left: 50%;
  width: 0;
  height: 0;
  margin-left: -10px;
  border: solid transparent;
  border-color: rgba(51, 51, 51, 0);
  border-bottom-color: #333;
  border-width: 10px;
  pointer-events: none;
  content: " ";
  transform: rotate(180deg); /* 180도 회전 추가 */
}

.match-recommend-btn {
  position: absolute;
  left: 29%;
  cursor: pointer;
  background: white;
  border: none;
  transition: 0.3s ease-in-out;
}

.opacity-100 {
  opacity: 100%;
}
.opacity-0 {
  opacity: 0%;
}

.custom-select {
  width: 100%;
  height: 40px;
  padding: 10px 20px;
  border-radius: 8px;
  border: 2px solid #333;
  background-color: #f9f9f9;
  font-size: 16px;
  color: #333;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-select:hover {
  border-color: #555;
}

.custom-select:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.custom-select option {
  padding: 10px;
  background-color: #fff;
  color: #333;
  font-size: 16px;
}

.custom-select option:hover {
  background-color: #007bff;
  color: #fff;
}

.custom-select option:focus {
  background-color: #0056b3;
  color: #fff;
}
</style>
