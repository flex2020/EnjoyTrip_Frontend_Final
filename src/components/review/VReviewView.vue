<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import VReviewCommentItem from "@/components/review/item/VReviewCommentItem.vue";
import VKakaoMapForReview from "@/components/common/VKakaoMapForReview.vue";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "/src/api/http-common";

const http = Axios();
const authStore = useAuthStore();

const route = useRoute();
const router = useRouter();

const viewId = ref(route.params.viewid);

const review = ref({});
const isLike = ref(false);
const comments = ref([]);
const isMyReview = ref(false);
const profileImage = ref('/src/assets/img/profileDefault.png');
const authorId = ref('');

onMounted(async () => {
  await getReview();
});

const likeInfo = ref({
  reviewId: viewId.value,
  memberId: authStore.memberId,
});

const getReview = async () => {
  const response1 = await http.get(`review/${viewId.value}`);
  review.value = await response1.data.reviewView;
  comments.value = await response1.data.comments;
  if (review.value.memberId === authStore.memberId) {
    isMyReview.value = true;
  }

  const response2 = await http.post(`review/get/likecount`, likeInfo.value);
  console.log(response2.data);
  if (response2.data) {
    isLike.value = true;
  } else {
    isLike.value = false;
  }
  console.log(response2);
  console.log(review.value.memberId);
  // 프로필 이미지 및 작성자 ID 가져오기
  const profileResponse = await http.post("/member/profile", {
    memberId: review.value.memberId,
  });
  if (profileResponse.data) {
    profileImage.value = profileResponse.data;
  }
};

const updateLikeCount = async () => {
  if (authStore.memberId !== null) {
    const response = await http.post(`review/likecount`, likeInfo.value);
    if (response.data === "up") {
      review.value.likeCount++;
      isLike.value = true;
    } else {
      review.value.likeCount--;
      isLike.value = false;
    }
  } else {
    alert("로그인 하세요.");
  }
};

const getComment = () => {
  getReview();
};

const goToMyPage = () => {
  router.push({ name: 'mypage', params: { memberId: review.value.memberId } });
};
</script>

<template>
  <div id="head-image">
    <div>{{ review.reviewTitle }}</div>
  </div>
  <div id="review-view-container">
    <div class="profile-section">
      <div class="profile-info" @click="goToMyPage">
        <div class="profile-image">
          <img :src="profileImage" alt="프로필 이미지" />
        </div>
        <div>
          <div class="profile-name">{{ review.nickName }}</div>
        </div>
      </div>
    </div>
    <div id="review-view-info">
      <div>
        <div>여행기간 : {{ review.travelStartDate }} ~ {{ review.travelEndDate }}</div>
        <div>여행인원 : {{ review.memberCount }}</div>
      </div>
      <div>
        <div>
          <div class="like-container" @click="updateLikeCount">
            <img
              :class="{ fade: true, active: isLike }"
              src="@/assets/img/fontawesome/heart-solid.svg"
              width="30px"
            />
            <img
              :class="{ fade: true, active: !isLike }"
              src="@/assets/img/fontawesome/heart-regular.svg"
              width="30px"
            />
          </div>
          {{ review.likeCount }}
        </div>
        <div>
          <img src="@/assets/img/fontawesome/eye-solid.svg" width="30px" />
          {{ review.hit }}
        </div>
      </div>
    </div>
    <div id="review-view-contents" v-html="review.content"></div>
    <div id="review-view-course">
      <div>여행 코스</div>
      <VKakaoMapForReview v-if="review.matchId" :match-id="review.matchId" />
    </div>

    <div id="btn-container">
      <div id="divider"></div>
      <div id="btns">
        <router-link
          :to="{ name: 'review-update', params: { viewid: review.reviewId } }"
          class="move-link"
          v-show="isMyReview"
        >
          게시글 수정
        </router-link>
        <router-link :to="{ name: 'review-list' }" class="move-link"> 게시글 목록 </router-link>
      </div>
    </div>

    <VReviewCommentItem :viewId="viewId" :comments="comments" @getComment="getComment" />
  </div>
</template>

<style scoped>
#review-view-container {
  width: 50%;
  padding-top: 30px;
  margin: 0px 25% 30px;
}

#review-view-contents {
  width: 100%;
}

#review-view-contents * {
  max-width: 100%;
}

#head-image {
  width: 100%;
  height: 500px;
  background-image: url("/src/assets/img/reviewpage.png");
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

.profile-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.profile-info {
  display: flex;
  align-items: center;
  cursor: pointer; /* 클릭 가능하게 커서 변경 */
}

.profile-image img {
  width: 80px; /* 이미지 사이즈 조정 */
  height: 80px; /* 이미지 사이즈 조정 */
  border-radius: 50%;
}

.profile-info > div {
  margin-left: 20px;
}

.profile-name {
  font-size: 24px;
  font-weight: bold;
}

#review-view-author-id {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}
#review-view-info {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  margin-bottom: 30px;
}

#review-view-info div:first-child div:first-child {
  margin-bottom: 10px;
}

#review-view-info > div:last-child {
  display: flex;
  align-items: center;
}
#review-view-info > div:last-child > div {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

#review-view-course {
  margin-top: 30px;
}

#review-view-course div:first-child {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}

#btn-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#divider {
  width: 100%;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.3);
  margin-top: 50px;
}

#btns {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin: 50px 0px;
}

.move-link {
  width: 100px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  border: none;
  border-radius: 10px;
  background-color: black;
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.like-container {
  position: relative;
  width: 30px;
  height: 30px;
}

.like-container img {
  position: absolute;
  top: 5px;
  left: 0;
  transition: opacity 0.5s ease;
  opacity: 0;
  cursor: pointer;
}

.like-container img.active {
  opacity: 1;
}
</style>
