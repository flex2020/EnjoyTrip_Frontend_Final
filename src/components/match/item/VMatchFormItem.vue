<script setup>
import { ref, defineComponent, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "/src/api/http-common";

const http = Axios();
const authStore = useAuthStore();

const router = useRouter();
const route = useRoute();

const props = defineProps({ type: String });

const isUseId = ref(false);

if (props.type === "update") {
  let { viewid } = route.params;
  http.get(`match/update/${viewid}`).then((response) => {
    review_article.value = response.data;
  });
  isUseId.value = true;
}

const match_article = ref({
  courseId: 0,
  authorId: 0,
  matchTitle: "",
  travelStartDate: "",
  travelEndDate: "",
  maxPeople: 0,
  genderType: 0,
  deadline: "",
  hit: 0,
  registerDate: "",
  deleted: 0,
});

const matches = ref([]);

const matchWrite = () => {
  http
    .post("/review", match_article.value)
    .then((response) => {
      console.log(response.data);
    })
    .catch((e) => console.log(e));

  router.push({ name: "review-list" });
};

// const reviewUpdate = async () => {
//   await http.put("review", review_article.value);

//   router.push({ name: "review-list" });
// };

// const reviewDelete = () => {
//   http.delete(`review/${review_article.value.reviewId}`);
//   router.push({ name: "review-list" });
// };

onMounted(() => {});

const moveList = () => {
  router.push({ name: "review-list" });
};
</script>

<template>
  <form id="match-input-form">
    <div id="match-input-title">
      <label id="match-input-title-lable">제목</label>
      <label class="red-star">*</label>
      <input type="text" v-model="match_article.matchTitle" placeholder="제목..." />
    </div>
    <div id="match-input-select">
      <label>완료한 여행</label>
      <label class="red-star">*</label>
      <!-- <select :disabled="isUseId" v-model="match_article.matchId">
        <option v-for="match in matches" :key="match.matchId" :value="match.matchId"></option>
      </select> -->

      <label>공개범위</label>
      <label class="red-star">*</label>
      <!-- <select v-model="match_article.scope"> -->
      <!-- <option :value="0">전체공개</option>
        <option :value="1">팔로워만</option>
        <option :value="2">나만보기</option>
      </select> -->
    </div>
  </form>

  <div id="btn-container">
    <div id="divider"></div>
    <div id="btns">
      <button type="button" v-show="!isUseId">작성하기</button>
      <button type="button" v-show="isUseId">수정하기</button>
      <button type="button" v-show="isUseId">삭제하기</button>
      <button type="button" @click="moveList">목록으로</button>
    </div>
  </div>
</template>

<style scoped>
#match-input-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
#match-input-form div {
  width: 70%;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

#match-input-title {
  display: flex;
  justify-content: flex-start;
}

#match-input-title-lable {
  width: 8%;
}

#match-input-title input {
  width: 100%;
  height: 40px;
  border-radius: 10px;
  font-size: 28px;
  margin-left: 20px;
  padding-left: 10px;
}

.red-star {
  color: red;
}

#match-input-select {
  width: 20%;
}

#match-input-select select {
  width: 20%;
  height: 40px;
  margin-left: 10px;
  margin-right: 20px;
}

#btn-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#divider {
  width: 70%;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.3);
}

#btns {
  width: 70%;
  display: flex;
  justify-content: flex-end;
  margin: 50px 0px;
}

#btns button {
  width: 100px;
  height: 50px;
  margin-left: 10px;
  border: none;
  border-radius: 10px;
  background-color: black;
  color: white;
  font-size: 18px;
  font-weight: bold;
}
</style>
