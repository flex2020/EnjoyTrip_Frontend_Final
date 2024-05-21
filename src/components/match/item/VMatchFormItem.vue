<script setup>
import { ref, defineComponent, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "/src/api/http-common";
import { getCourseListByMember } from "@/api/plan";

const http = Axios();
const authStore = useAuthStore();

const router = useRouter();
const route = useRoute();

const props = defineProps({ type: String });

const isUseId = ref(false);
const inputHashtag = ref("");
const hashtagArray = ref([]);

if (props.type === "update") {
  let { viewid } = route.params;
  http.get(`match/update/${viewid}`).then((response) => {
    review_article.value = response.data;
  });
  isUseId.value = true;
}

const match_article = ref({
  courseId: 0,
  authorId: authStore.getMemberId,
  matchTitle: "",
  travelStartDate: "",
  travelEndDate: "",
  maxPeople: 0,
  genderType: 0,
  deadine: "",
  hit: 0,
  registerDate: "",
  deleted: 0,
  content: "",
  hashtags: hashtagArray.value,
});

const courses = ref([]);

const matchWrite = async () => {
  await http.post("/match", match_article.value);

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

onMounted(async () => {
  courses.value = await getCourseListByMember(authStore.memberId);
  // console.log(courses.value);
});

const moveList = () => {
  router.push({ name: "review-list" });
};

const addHashtag = () => {
  hashtagArray.value.push(inputHashtag.value);
  inputHashtag.value = "";
  console.log(hashtagArray.value);
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
      <div>
        <label>여행 코스</label>
        <label class="red-star">*</label>
        <select :disabled="isUseId" v-model="match_article.courseId">
          <option value="0" hidden>코스를 선택해주세요.</option>
          <option v-for="course in courses" :key="course.courseId" :value="course.courseId">
            {{ course.courseName }}
          </option>
        </select>

        <label>여행 기간</label>
        <label class="red-star">*</label>
        <input type="date" v-model="match_article.travelStartDate" /> ~
        <input type="date" v-model="match_article.travelEndDate" />

        <label>모집 기한</label>
        <label class="red-star">*</label>
        <input type="date" v-model="match_article.deadline" />
      </div>

      <div>
        <label>최대 인원</label>
        <label class="red-star">*</label>
        <input type="text" v-model="match_article.maxPeople" />

        <label>성별 제한</label>
        <label class="red-star">*</label>
        <select :disabled="isUseId" v-model="match_article.genderType">
          <option value="0" hidden>성별 제한 선택</option>
          <option value="0">성별 무관</option>
          <option value="1">남성만</option>
          <option value="2">여성만</option>
        </select>
      </div>
      <div id="match-content-container">
        <div>이런 분을 원해요</div>
        <textarea v-model="match_article.content"></textarea>
      </div>

      <div id="match-hashtag-container">
        <div>해시태그</div>
        <input type="text" v-model="inputHashtag" @keyup.enter="addHashtag" />
        <button type="button" @click="addHashtag">해시태그 추가하기</button>
      </div>
    </div>
  </form>

  <div id="btn-container">
    <div id="divider"></div>
    <div id="btns">
      <button type="button" v-show="!isUseId" @click="matchWrite">작성하기</button>
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
  /* align-items: center; */
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

#match-input-title {
  display: flex;
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
  display: flex;
  flex-direction: column;
}

#match-input-select div {
  width: 100%;
}

#match-input-select select {
  width: 20%;
  height: 40px;
  margin-left: 10px;
  margin-right: 20px;
}

#match-content-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

#match-content-container textarea {
  width: 100%;
  height: 200px;
}

#match-hashtag-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
