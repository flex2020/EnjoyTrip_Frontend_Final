<script setup>
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Axios } from "/src/api/http-commons";

const http = Axios();

const router = useRouter()
const route = useRoute()

const review_article = ref({
    matchId: 0,
    memberId: 0,
    reviewTitle: "",
    scope: 0,
    content: "",
    hit: 0,
    registerTime: "",
    deleted: 0,
})

const reviewWrite = () => {
    console.log(review_article.value);
    http.post("/review", JSON.stringify(review_article.value))
    .then(() => {
        console.log("성공");
    });
}

</script>

<template>
  <div id="head-image">
    <div>여행 후기 작성</div>
    <div>좋았던 여행 후기를 공유해보세요</div>
  </div>

  <form id="review-input-form">
    <div id="review-input-title">
      <label>제목</label>
      <label class="red-star">*</label>
      <input type="text" v-model="review_article.reviewTitle" placeholder="제목..."/>
    </div>
    <div id="review-input-select">
      <label>완료한 여행</label>
      <label class="red-star">*</label>
      <select v-model="review_article.matchId">
        <option>하이</option>
      </select>

      <label>공개범위</label>
      <label class="red-star">*</label>
      <select v-model="review_article.scope">
        <option>나만보기</option>
        <option>팔로워만</option>
        <option>전체공개</option>
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
      <QuillEditor v-model="review_article.content" />
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
#head-image {
  width: 100%;
  height: 500px;
  background-image: url("/src/assets/img/reviewwrite.png");
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

#head-image div:last-child {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30px;
}

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
