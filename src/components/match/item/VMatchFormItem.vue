<script setup>
import { ref, defineComponent, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "/src/api/http-common";
import { getCourseListByMember } from "@/api/plan";
import { postMatchesByMemberId } from "@/api/match";

const http = Axios();
const authStore = useAuthStore();

const router = useRouter();
const route = useRoute();

const props = defineProps({ type: String });

const isUseId = ref(false);
const inputHashtag = ref("");
const hashtagArray = ref([]);
const files = ref([]);

if (props.type === "update") {
  let { matchid } = route.params;
  http.get(`match/find/${matchid}`).then((response) => {
    match_article.value = response.data.resdata;
  });
  isUseId.value = true;
}

const match_article = ref({
  matchId: 0,
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
  fileId: 0,
});

const courses = ref([]);

const matchWrite = async () => {
  const formData = new FormData();
  formData.append("file", files.value);
  const fileRes = await http.post("/files", formData);
  match_article.value.fileId = fileRes.data.fileId;

  const response = await http.post("/match", match_article.value);

  match_article.value.matchId = response.data.matchId;

  const formData2 = new FormData();
  formData2.append("matchId", match_article.value.matchId);
  formData2.append("memberId", authStore.getMemberId);

  await postMatchesByMemberId(formData2);

  router.push({ name: "match-list" });
};

const matchUpdate = async () => {
  if (files.value.length !== 0) {
    const formData = new FormData();
    formData.append("file", files.value);
    const fileRes = await http.post("/files", formData);
    match_article.value.fileId = fileRes.data.fileId;
  }

  match_article.value.hashtags = hashtagArray;

  const response = await http.put("match/update", match_article.value);

  match_article.value.matchId = response.data.matchId;

  router.push({ name: "match-list" });
};

const matchDelete = () => {
  http.delete(`match/${match_article.value.matchId}`);
  router.push({ name: "match-list" });
};

onMounted(async () => {
  courses.value = await getCourseListByMember(authStore.memberId);
  // console.log(courses.value);
});

const moveList = () => {
  router.push({ name: "match-list" });
};

const addHashtag = () => {
  hashtagArray.value.push(inputHashtag.value);
  inputHashtag.value = "";
  // console.log(hashtagArray.value);
};

const handleFileChange = (event) => {
  files.value = event.target.files[0];
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
        <select v-model="match_article.courseId">
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
        <select v-model="match_article.genderType">
          <option value="-1" hidden>성별 제한 선택</option>
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
        <span v-for="hashtag in match_article.hashtags" :key="hashtag">{{ hashtag }}</span>
        <span v-for="(hashtag, index) in hashtagArray" :key="index">
          <span v-if="isUseId">{{ hashtag }}</span>
        </span>
      </div>

      <div id="match-image-container">
        <div>썸네일 선택</div>
        <input type="file" @change="handleFileChange" />
      </div>
    </div>
  </form>

  <div id="btn-container">
    <div id="divider"></div>
    <div id="btns">
      <button type="button" v-show="!isUseId" @click="matchWrite">작성하기</button>
      <button type="button" v-show="isUseId" @click="matchUpdate">수정하기</button>
      <button type="button" v-show="isUseId" @click="matchDelete">삭제하기</button>
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

#match-image-container {
  display: flex;
  flex-direction: column;
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
