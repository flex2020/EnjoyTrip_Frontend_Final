<script setup>
import { ref, defineComponent, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "/src/api/http-common";
import Quill from "quill/core";
import ImageUploader from "quill-image-uploader";
import { getMatchesByMemberId, getMatesByMatchId, postMatesScore } from "@/api/match";

Quill.register("modules/imageUploader", ImageUploader);

const http = Axios();
const authStore = useAuthStore();

const router = useRouter();
const route = useRoute();

const props = defineProps({ type: String });

const isUseId = ref(false);

if (props.type === "update") {
  let { viewid } = route.params;
  http.get(`/review/update/${viewid}`).then((response) => {
    review_article.value.review = response.data;
  });
  isUseId.value = true;
}

const review_article = ref({
  review: {
    reviewId: 0,
    matchId: 0,
    memberId: authStore.getMemberId,
    reviewTitle: "",
    scope: 0,
    content: "",
    hit: 0,
    registerTime: "",
    deleted: 0,
  },
  fileIds: [],
});

function getTextContent(htmlString) {
  // Create a temporary DOM element
  const tempElement = document.createElement("div");
  // Set the HTML content
  tempElement.innerHTML = htmlString;
  // Get the text content
  const textContent = tempElement.textContent || tempElement.innerText || "";
  // Return the first 200 characters
  return textContent.substring(0, 200);
}

function getFirstImage(htmlString) {
  // Create a temporary DOM element
  const tempElement = document.createElement("div");
  // Set the HTML content
  tempElement.innerHTML = htmlString;

  // Find the first <img> tag
  const imgTag = tempElement.querySelector("img");
  console.log(imgTag);
  // Return the src attribute of the first <img> tag, if it exists
  return imgTag
    ? imgTag.getAttribute("src")
    : `/src/assets/img/card_image${Math.floor(Math.random() * 3) + 1}.png`;
}

const matches = ref([]);
const mates = ref([]);

const reviewWrite = async () => {
  const data = review_article.value;
  data.review.previewContent = getTextContent(review_article.value.review.content);
  data.review.firstImage = getFirstImage(review_article.value.review.content);
  http
    .post("/review", data)
    .then((response) => {
      router.push({ name: "review-list" });
    })
    .catch((e) => console.log(e));
  await postMatesScore(mates.value);
};

const reviewUpdate = async () => {
  const data = review_article.value;
  data.review.previewContent = getTextContent(review_article.value.review.content);
  data.review.firstImage = getFirstImage(review_article.value.review.content);
  const response = await http.put("review", data);
  if (response.status == 200) {
    router.push({ name: "review-list" });
  } else alert("수정 중 오류가 발생했습니다.");
};

const reviewDelete = async () => {
  if (!window.confirm("정말 게시물을 삭제하시겠습니까?")) return;
  try {
    await http.delete(`review/${review_article.value.review.reviewId}`);
    router.push({ name: "review-list" });
  } catch {
    alert("삭제 중 오류가 발생했습니다.");
  }
};

onMounted(async () => {
  matches.value = await getMatchesByMemberId(authStore.getMemberId);
});

const getMates = async () => {
  mates.value = await getMatesByMatchId(matches.value[0].matchId);
  console.log(mates.value);
  mates.value = mates.value.filter((e) => e.memberId !== authStore.getMemberId);

  console.log(mates.value);
};

const moveList = () => {
  router.push({ name: "review-list" });
};

const modules = {
  name: "imageUploader",
  module: ImageUploader,
  options: {
    upload: (file) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);

        http
          .post("/files", formData)
          .then((res) => {
            review_article.value.fileIds.push(res.data.fileId);
            resolve(res.data.filePath);
          })
          .catch((err) => {
            reject("Upload failed");
            console.error("Error:", err);
          });
      });
    },
  },
};
</script>

<template>
  <form id="review-input-form">
    <div id="review-input-title">
      <label id="review-input-title-lable">제목</label>
      <label class="red-star">*</label>
      <input type="text" v-model="review_article.review.reviewTitle" placeholder="제목..." />
    </div>
    <div id="review-input-select">
      <label>완료한 여행</label>
      <label class="red-star">*</label>
      <select :disabled="isUseId" v-model="review_article.review.matchId" @change="getMates">
        <option value="0" hidden>여행을 선택해주세요.</option>
        <option v-for="match in matches" :key="match.matchId" :value="match.matchId">
          {{ match.matchTitle }}
        </option>
      </select>

      <label>공개범위</label>
      <label class="red-star">*</label>
      <select v-model="review_article.review.scope">
        <option :value="0">전체공개</option>
        <option :value="1">팔로워만</option>
        <option :value="2">나만보기</option>
      </select>
    </div>

    <div class="evaluate-mate-container">
      <div class="evaluate-title">
        <div class="evaluate-mate-title" v-if="!isUseId">메이트 평가</div>
        <div class="evaluate-mate-title" v-if="!isUseId">
          함께 여행한 메이트를 1-100 사이의 점수로 평가해보세요
        </div>
      </div>
    </div>
    <div class="evaluate-mate-container">
      <div class="evaluate-mate" v-for="mate in mates" :key="mate">
        <div class="evaluate-mate-input" v-if="!isUseId && mate.memberId !== authStore.getMemberId">
          <label>{{ mate.nickname }}</label>
          <input type="text" v-model="mate.score" />
        </div>
      </div>
    </div>
  </form>

  <div id="quill-editor-box">
    <div id="quill-editor-container">
      <QuillEditor
        v-model:content="review_article.review.content"
        contentType="html"
        theme="snow"
        :modules="modules"
        toolbar="full"
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

.evaluate-mate-title:last-child {
  width: 100% !important;
}

.evaluate-mate-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start !important;
}

.evaluate-mate {
  width: 25% !important;
  display: flex !important;
  font-size: 13px !important;
  margin-bottom: 0px !important;
}

.evaluate-mate label {
  font-size: 18px !important;
}

.evaluate-mate input {
  width: 50%;
  height: 30px;
  font-size: 16px !important;
  margin-left: 10px;
  border-radius: 7px;
}

.evaluate-title div:first-child {
  width: auto !important;
  display: flex !important;
  margin-bottom: 0px !important;
  margin-right: 10px;
}

.evaluate-title div:last-child {
  width: 80% !important;
  display: flex !important;
  font-size: 16px !important;
  color: #9d9d9d;
  margin-bottom: 0px !important;
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
