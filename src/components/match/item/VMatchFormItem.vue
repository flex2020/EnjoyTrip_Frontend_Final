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
  maxPeople: "",
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
  if (files.value.length !== 0) {
    const formData = new FormData();
    formData.append("file", files.value);
    const fileRes = await http.post("/files", formData);
    match_article.value.fileId = fileRes.data.fileId;
  }

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

  for (let i = 0; i < hashtagArray.value.length; i++) {
    if (!match_article.value.hashtags.includes(hashtagArray.value[i])) {
      match_article.value.hashtags.push(hashtagArray.value[i]);
    }
  }

  await http.put("match/update", match_article.value);

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
  if (
    !match_article.value.hashtags.includes(inputHashtag.value) &&
    !hashtagArray.value.includes(inputHashtag.value) &&
    match_article.value.hashtags.length + hashtagArray.value.length < 5
  ) {
    console.log(hashtagArray.value);
    match_article.value.hashtags.push(inputHashtag.value);
  }
  // console.log("추가",match_article.value.hashtags);
  // console.log(hashtagArray.value);

  inputHashtag.value = "";
};

const deleteHashtag = (h) => {
  match_article.value.hashtags = match_article.value.hashtags.filter(
    (hashtag) => hashtag !== h
  );
  hashtagArray.value = hashtagArray.value.filter((hashtag) => hashtag !== h);

  // console.log(match_article.value.hashtags);
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
      <input
        type="text"
        v-model="match_article.matchTitle"
        placeholder="제목을 입력해주세요  "
      />
    </div>
    <div id="match-input-select">
      <div>
        <label>여행 코스</label>
        <label class="red-star">*</label>
        <select v-model="match_article.courseId">
          <option value="0" hidden>코스를 선택해주세요.</option>
          <option
            v-for="course in courses"
            :key="course.courseId"
            :value="course.courseId"
          >
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
        <div>이런 분을 원해요
          <span class="desc">Tip! 자세히 작성할수록 원하는 사람과 매칭될 확률이 올라가요!</span>
        </div>
        
        <textarea v-model="match_article.content"></textarea>
      </div>

      <div id="match-hashtag-container">
        <div>해시태그
          <span class="desc">Enter 키를 통해 해시태그를 등록하세요.</span>
        </div>
        
        <div id="match-hashtag-input">
          <input type="text" v-model="inputHashtag" @keyup.enter="addHashtag" />
          <div class="profile-hashtags">
            <span
              v-for="hashtag in match_article.hashtags"
              :key="hashtag"
              @click="deleteHashtag(hashtag)"
              class="hashtag"
            >
              #{{ hashtag }}
            </span>
            <span v-for="(hashtag, index) in hashtagArray" :key="index"  >
              <span v-if="isUseId" @click="deleteHashtag(hashtag)"class="hashtag"
                >#{{ hashtag }}</span
              >
            </span>
          </div>
        </div>
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
      <button type="button" v-show="!isUseId" @click="matchWrite">
        작성하기
      </button>
      <button type="button" v-show="isUseId" @click="matchUpdate">
        수정하기
      </button>
      <button type="button" v-show="isUseId" @click="matchDelete">
        삭제하기
      </button>
      <button type="button" @click="moveList">목록으로</button>
    </div>
  </div>
</template>

<style scoped>


.profile-hashtags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0 !important;
}

input[type='text'] {
  border: 1px solid black;
}

input[type='text']:focus {
  outline: none;
}

.hashtag {
  background-color: #f0f0f0;
  border-radius: 20px;
  padding: 5px 15px;
  font-size: 14px;
  color: #333;
  border: 1px solid #ddd;
  transition: all 0.3s ease;
  cursor: pointer;
}

.hashtag:hover {
  background-color: #e0e0e0;
  border-color: #ccc;
}

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
  margin-bottom: 15px;
}

#match-input-title-lable {
  width: 8%;
}

#match-input-title input {
  width: 100%;
  height: 40px;
  font-size: 28px;
  margin-left: 20px;
  padding-left: 10px;
  border: 1px solid black;
}

#match-input-title input:focus {
  outline: none;
}

.red-star {
  color: red;
  margin-right: 10px;
}

input[type="date"] {
  margin: 7px;
  height: 40px;
  font-size: 16px;
}

#match-input-select {
  display: flex;
  flex-direction: column;
}

#match-input-select div {
  width: 100%;
}

#match-input-select select {
  width: 15%;
  height: 40px;
  margin-right: 20px;
  font-size: 16px;
  font-family: Arial, sans-serif;
}

#match-input-select input {
  width: 15%;
  height: 40px;
  margin-right: 20px;
  font-size: 16px;
  font-family: Arial, sans-serif;
}

#match-content-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

#match-content-container textarea {
  width: 100%;
  height: 200px;
  font-family: Arial, sans-serif;
  font-size: 18px;
  color: #333;
}

#match-hashtag-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start !important;
}

#match-hashtag-container span {
  cursor: pointer;
}

#match-image-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start !important;
}
#match-image-container input {
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

#match-hashtag-input {
  display: flex;
  align-items: center;
}
#match-hashtag-input span {
  margin-right: 5px;
  font-size: 18px;
}
.desc {
  font-size: 15px;
  font-weight: 400;
  color: #9d9d9d;
  margin-left: 7px;
}

input[type='file'] {
  width: auto !important;
}
</style>
