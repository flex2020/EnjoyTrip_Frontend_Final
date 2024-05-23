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
  if (response2.data) {
    isLike.value = true;
  } else {
    isLike.value = false;
  }

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
      <div class="profile-stats">
        <div class="like-container" @click="updateLikeCount">
          <img
            :class="{ fade: true, active: isLike }"
            src="@/assets/img/fontawesome/heart-solid.svg"
            width="30px"
            class="icon"
          />
          <img
            :class="{ fade: true, active: !isLike }"
            src="@/assets/img/fontawesome/heart-regular.svg"
            width="30px"
            class="icon"
          />
          {{ review.likeCount }}
        </div>
        <div class="view-container">
          <img src="@/assets/img/fontawesome/eye-solid.svg" width="30px" class="icon" />
          {{ review.hit }}
        </div>
      </div>
    </div>
    <div id="review-view-info">
      <div class="info-item">
        <strong>여행기간:</strong> {{ review.travelStartDate }} ~ {{ review.travelEndDate }}
      </div>
      <div class="info-item">
        <strong>여행인원:</strong> {{ review.memberCount }}
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
          class="btn move-link"
          v-show="isMyReview"
        >
          게시글 수정
        </router-link>
        <router-link :to="{ name: 'review-list' }" class="btn move-link"> 게시글 목록 </router-link>
      </div>
    </div>

    <VReviewCommentItem :viewId="viewId" :comments="comments" @getComment="getComment" />
  </div>
</template>

<style scoped>
#review-view-container {
  width: 50%;
  padding-top: 30px;
  margin: 0 auto 30px;
  font-family: inherit;
}

#review-view-contents {
  width: 100%;
  font-size: 16px;
  line-height: 1.6;
}

#review-view-contents * {
  max-width: 100%;
}

#head-image {
  width: 100%;
  height: 400px;
  background-image: url("/src/assets/img/reviewpage.png");
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 48px;
  background-repeat: no-repeat;
  background-size: cover;
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
}

#head-image div {
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
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
  cursor: pointer;
}

.profile-image img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ccc;
}

.profile-info > div {
  margin-left: 15px;
}

.profile-name {
  font-size: 22px;
  font-weight: bold;
  color: #333;
}

.profile-stats {
  display: flex;
  align-items: center;
}

.like-container {
  display: flex;
  align-items: center;
  margin-right: 15px;
  cursor: pointer;
  position: relative;
}

.view-container {
  display: flex;
  align-items: center;
}

.icon {
  margin-right: 5px;
}

#review-view-info {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  margin-bottom: 30px;
}

.info-item {
  margin-bottom: 10px;
  font-weight: 500;
}

#review-view-course {
  margin-top: 30px;
}

#review-view-course div:first-child {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #555;
}

#btn-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
}

#divider {
  width: 100%;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

#btns {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}

.btn {
  position: relative;
  background-color: #fff;
  color: #000;
  border: 2px solid #000;
  padding: 2px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  font-family: inherit;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  line-height: 30px;
  z-index: 2;
  transition: background-color 0.3s, color 0.3s;
  font-weight: bold;
  margin-left : 10px;
}

.btn:hover {
  color: #fff;
  background-color: #000;
}

.btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  background-color: #000;
  border-radius: 5px;
  z-index: -1;
  transition: height 0.3s ease;
}

.btn:hover::before {
  height: 100%;
}

.like-container img {
  position: absolute;
  transition: opacity 0.5s ease;
  opacity: 0;
  cursor: pointer;
  left: -35px;
}

.like-container img.active {
  opacity: 1;
}
</style>
