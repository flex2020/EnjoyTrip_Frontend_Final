<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import VReviewListItem from "@/components/review/item/VReviewListItem.vue";
import { Axios } from "/src/api/http-common";

const http = Axios();

const router = useRouter();

const reviews = ref([]);
const currentPage = ref(1);
const totalPageCount = ref(0);
const sortSelect = ref(0);
const scopeSecelct = ref(0);
const inputKeyword = ref("");

const { VITE_ARTICLE_LIST_SIZE } = import.meta.env;
const param = ref({
  pgno: currentPage.value,
  spp: VITE_ARTICLE_LIST_SIZE,
  sortKey: sortSelect.value,
  scopeKey: scopeSecelct.value,
  keyword: inputKeyword.value,
});

onMounted(async () => {
  const response = await getReviewList();
  reviews.value = await response.reviews;
});

const getReviewList = async () => {
  const response = await http.get("/review", { params: param.value });
  const data = response.data.resdata;
  currentPage.value = data.currentPage;
  totalPageCount.value = data.totalPageCount;
  return data;
};

const currentPageAdd = async () => {
  param.value.pgno++;
  const response = await getReviewList();
  for (let i = 0; i < response.reviews.length; i++) {
    reviews.value.push(response.reviews[i]);
  }
  console.log(reviews.value);
};

const changeSortSelect = async () => {
  param.value.sortKey = sortSelect.value;
  currentPage.value = 1;
  param.value.pgno = currentPage.value;
  const response = await getReviewList();
  reviews.value = await response.reviews;
};

const changeScopeSelect = async () => {
  param.value.scopeKey = scopeSecelct.value;
  currentPage.value = 1;
  param.value.pgno = currentPage.value;
  const response = await getReviewList();
  reviews.value = await response.reviews;
  // console.log(response.reviews);
};

const searchReview = async () => {
  param.value.keyword = inputKeyword.value;
  currentPage.value = 1;
  param.value.pgno = currentPage.value;
  const response = await getReviewList();
  reviews.value = await response.reviews;
  // console.log(inputKeyword.value);
  // console.log(response.reviews);
};
</script>

<template>
  <div id="review-list-container">
    <div id="review-list-title">
      <div>여행 후기</div>
      <div>다양한 후기를 참고해보세요</div>
    </div>

    <div id="review-list-function">
      <div id="review-list-select-container">
        <select v-model="scopeSecelct" @change="changeScopeSelect">
          <option :value="0">전체보기</option>
          <option :value="1">팔로잉한 사람</option>
          <option :value="2">나의 후기</option>
        </select>
        <select v-model="sortSelect" @change="changeSortSelect">
          <option :value="0">최신순</option>
          <option :value="1">좋아요순</option>
          <option :value="2">조회수순</option>
        </select>
      </div>
      <div id="review-list-search">
        <input v-model="inputKeyword" type="text" placeholder="제목, 내용으로 검색해보세요" @keyup.enter="searchReview" />
        <button id="review-search-btn" @click="searchReview">
          <img src="/src/assets/img/fontawesome/magnifying-glass-solid-white.svg" width="25">
        </button>
      </div>
      <router-link :to="{ name: 'review-write' }" id="review-list-move-write">
        <img src="@/assets/img/fontawesome/pen-to-square-solid.svg" />
        게시글 작성
      </router-link>
    </div>

    <VReviewListItem
      :reviews="reviews"
      :currentPage="currentPage"
      :totalPageCount="totalPageCount"
      @currentPageAdd="currentPageAdd"
    />
  </div>
</template>

<style scoped>
#review-list-container {
  padding-top: 120px;
  margin: 0px 13%;
}

#review-list-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

#review-list-title div:first-child {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 15px;
  border-bottom: 2px solid var(--brand-color);
}
#review-list-title div:last-child {
  font-size: 18px;
}

#review-list-function {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

#review-list-function div {
  width: 33%;
}

#review-list-search {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}

#review-list-search button {
  position: absolute;
  background-color: var(--brand-color);
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  top: 2px;
  right: 0;
  cursor: pointer;
}

#review-list-search input {
  width: 100%;
  height: 40px;
  font-size: 20px;
  padding: 0px 10px;
  border-radius: 10px;
  border: 2px solid var(--brand-color);
}

#review-list-search input:focus {
  outline: none;
}

#review-list-move-write {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  transition: 0.2s;
}
#review-list-move-write:hover {
  transform: scale(110%);
}
#review-list-move-write img {
  width: 30px;
  height: 30px;
  margin-right: 5px;
}

#review-list-select-container select {
  width: 120px;
  height: 30px;
  border-radius: 5px;
  padding-left: 5px;
  margin-right: 5px;
}

</style>
