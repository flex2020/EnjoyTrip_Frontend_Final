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
  http.get(`review/update/${viewid}`).then((response) => {
    review_article.value = response.data;
  });
  isUseId.value = true;
}

const review_article = ref({
  reviewId: 0,
  matchId: 0,
  memberId: 0,
  reviewTitle: "",
  scope: 0,
  content: "",
  hit: 0,
  registerTime: "",
  deleted: 0,
});

const matches = ref([]);

const reviewWrite = () => {
  http
    .post("/review", review_article.value)
    .then((response) => {
      console.log(response.data);
    })
    .catch((e) => console.log(e));

  router.push({ name: "review-list" });
};

const reviewUpdate = async () => {
  await http.put("review", review_article.value);

  router.push({ name: "review-list" });
};

const reviewDelete = () => {
  http.delete(`review/${review_article.value.reviewId}`);
  router.push({ name: "review-list" });
};

onMounted(() => {
  getMatches();
});

const getMatches = () => {
  http.get("match/matches").then((response) => {
    matches.value = response.data;
  });
};

const moveList = () => {
  router.push({ name: "review-list" });
};
</script>

<template>
  <form id="review-input-form">
    <div id="review-input-title">
      <label id="review-input-title-lable">제목</label>
      <label class="red-star">*</label>
      <input type="text" v-model="review_article.reviewTitle" placeholder="제목..." />
    </div>
    <div id="review-input-select">
      <label>완료한 여행</label>
      <label class="red-star">*</label>
      <select :disabled="isUseId" v-model="review_article.matchId">
        <option v-for="match in matches" :key="match.matchId" :value="match.matchId">
          {{ match.matchTitle }}
        </option>
      </select>

      <label>공개범위</label>
      <label class="red-star">*</label>
      <select v-model="review_article.scope">
        <option :value="0">전체공개</option>
        <option :value="1">팔로워만</option>
        <option :value="2">나만보기</option>
      </select>
    </div>

    <div v-show="!isUseId">메이트 평가</div>
    <div v-show="!isUseId" id="evaluate-mate">
      <label>메이트 A</label>
      <input type="text" />
    </div>
  </form>

  <div id="quill-editor-box">
    <div id="quill-editor-container">
      <QuillEditor
        v-model:content="review_article.content"
        contentType="html"
        theme="snow"
        :modules="modules"
        toolbar="minimal"
      />
    </div>
  </div>

  <div id="btn-container">
    <div id="divider"></div>
    <div id="btns">
      <button type="button" v-show="!isUseId" @click="reviewWrite">작성하기</button>
      <button type="button" v-show="isUseId" @click="reviewUpdate">수정하기</button>
      <button type="button" v-show="isUseId" @click="reviewDelete">삭제하기</button>
      <button type="button" @click="moveList">목록으로</button>
    </div>
  </div>
</template>

<style scoped>
#review-input-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
#review-input-form div {
  width: 70%;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

#review-input-title {
  display: flex;
  justify-content: flex-start;
}

#review-input-title-lable {
  width: 8%;
}

#review-input-title input {
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

#review-input-select {
  width: 20%;
}

#review-input-select select {
  width: 20%;
  height: 40px;
  margin-left: 10px;
  margin-right: 20px;
}

#evaluate-mate {
  margin-left: 100px;
}

#evaluate-mate label {
  margin-right: 20px;
}

#evaluate-mate input {
  width: 5%;
  height: 30px;
  font-size: 24px;
}

#quill-editor-box {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 100px;
}

#quill-editor-container {
  width: 70%;
  height: 500px;
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
