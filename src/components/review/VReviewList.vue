<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import VReviewListItem from "@/components/review/item/VReviewListItem.vue";
import { Axios } from "/src/api/http-common";

const http = Axios();

const router = useRouter();

const reviews = ref([]);
const currentPage = ref(1);
const totalPage = ref(0);
const { VITE_ARTICLE_LIST_SIZE } = import.meta.env;
const param = ref({
  pgno: currentPage.value,
  spp: VITE_ARTICLE_LIST_SIZE,
});

onMounted(async () => {
  const response = await getReviewList();
  reviews.value = await response.reviews;
  console.log(response.reviews);
});

const getReviewList = async () => {
  const response = await http.get("/review");
  const data = response.data.resdata;
  currentPage.value = data.currentPage;
  totalPage.value = data.totalPageCount;
  return data;
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
        <select>
          <option value="">전체보기</option>
          <option value="">팔로잉한 사람</option>
        </select>
        <select>
          <option value="">최신순</option>
          <option value="">좋아요순</option>
          <option value="">조회수순</option>
        </select>
      </div>
      <div id="review-list-search">
        <input type="text" placeholder="제목, 내용으로 검색해보세요" />
        <button>검색</button>
      </div>
      <router-link :to="{ name: 'review-write' }" id="review-list-move-write">
        <img src="@/assets/img/fontawesome/pen-to-square-solid.svg" />
        게시글 작성
      </router-link>
    </div>

    <VReviewListItem :reviews="reviews" />
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
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}
#review-list-title div:last-child {
  font-size: 18px;
}

#review-list-function {
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
  top: 8px;
  right: 10px;
}

#review-list-search input {
  width: 100%;
  height: 40px;
  font-size: 20px;
  padding: 0px 10px;
  border-radius: 10px;
}

#review-list-move-write {
  display: flex;
  justify-content: flex-end;
  align-items: center;
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