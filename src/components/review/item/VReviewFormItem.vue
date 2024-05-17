<script setup>
import { ref, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Axios } from "/src/api/http-common";

const http = Axios();

const router = useRouter();
const route = useRoute();

const props = defineProps({ type: String });

const isUseId = ref(false);

const review_article = ref({
  matchId: 0,
  memberId: 0,
  reviewTitle: "",
  scope: 0,
  content: "",
  hit: 0,
  registerTime: "",
  deleted: 0,
});

const reviewWrite = () => {
  http
    .post("/review", review_article.value)
    .then((response) => {
      console.log(response.data);
    })
    .catch((e) => console.log(e));
}

function reviewUpdate() {
  
}
</script>

<template>
  <form id="review-input-form">
    <div id="review-input-title">
      <label>제목</label>
      <label class="red-star">*</label>
      <input type="text" v-model="review_article.reviewTitle" placeholder="제목..." />
    </div>
    <div id="review-input-select">
      <label>완료한 여행</label>
      <label class="red-star">*</label>
      <select v-model="review_article.matchId">
        <option :value="0">하이</option>
      </select>

      <label>공개범위</label>
      <label class="red-star">*</label>
      <select v-model="review_article.scope">
        <option :value="0">나만보기</option>
        <option :value="1">팔로워만</option>
        <option :value="2">전체공개</option>
      </select>
    </div>

    <div>메이트 평가</div>
    <div id="evaluate-mate">
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
      <button type="button" @click="reviewWrite">작성하기</button>
      <button type="button">목록으로</button>
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
  width: 80%;
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
  width: 80%;
  height: 500px;
}

#btn-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#divider {
  width: 80%;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.3);
}

#btns {
  width: 80%;
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
