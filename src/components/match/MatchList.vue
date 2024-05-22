<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import VMatchListItem from "@/components/match/item/VMatchListItem.vue";
import { Axios } from "/src/api/http-common";
import { useAuthStore } from "@/stores/auth";

const http = Axios();
const authStore = useAuthStore();

const router = useRouter();

const matches = ref([]);
const currentPage = ref(1);
const totalPageCount = ref(0);
const sortSelect = ref(0);
const inputKeyword = ref("");

const { VITE_ARTICLE_LIST_SIZE } = import.meta.env;
const param = ref({
  pgno: currentPage.value,
  spp: VITE_ARTICLE_LIST_SIZE,
  sortKey: sortSelect.value,
  keyword: inputKeyword.value,
  memberId: authStore.getMemberId,
});

onMounted(async () => {
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
</script>

<template>
  <div id="match-list-container">
    <div id="match-list-title">
      <div>여행 메이트 찾기</div>
      <div>함께 여행할 메이트를 찾아보세요</div>
    </div>

    <div id="match-list-function">
      <div id="match-list-select-container">
        <select v-model="sortSelect" @change="changeSortSelect">
          <option :value="0">최신순</option>
          <option :value="1">좋아요순</option>
          <option :value="2">조회수순</option>
        </select>
      </div>
      <div id="match-list-search">
        <input v-model="inputKeyword" type="text" placeholder="제목, 내용으로 검색해보세요" />
        <button @click="searchMatch">검색</button>
      </div>
      <router-link :to="{ name: 'match-write' }" id="match-list-move-write">
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
</template>

<style scoped>
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
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}
#match-list-title div:last-child {
  font-size: 18px;
}

#match-list-function {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
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
  top: 8px;
  right: 10px;
}

#match-list-search input {
  width: 100%;
  height: 40px;
  font-size: 20px;
  padding: 0px 10px;
  border-radius: 10px;
}

#match-list-move-write {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

#match-list-move-write img {
  width: 30px;
  height: 30px;
  margin-right: 5px;
}

#match-list-select-container select {
  width: 120px;
  height: 30px;
  border-radius: 5px;
  padding-left: 5px;
  margin-right: 5px;
}
</style>
