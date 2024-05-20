<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import VReviewCommentItem from "@/components/review/item/VReviewCommentItem.vue";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "/src/api/http-common";

const http = Axios();
const authStore = useAuthStore();

const route = useRoute();
const router = useRouter();

// const articleno = ref(route.params.articleno);
const viewId = ref(route.params.viewid);

const review = ref({});
const isLike = ref(false);
const comments = ref([]);
const isMyReview = ref(false);

onMounted(() => {
  getReview();
});

const getReview = async () => {
  http
    .get(`review/${viewId.value}`)
    .then((response) => {
      console.log(response);
      review.value = response.data.reviewView;
      comments.value = response.data.comments;
      if (response.data.reviewView.memberId === authStore.getMemberId) {
        isMyReview.value = true;
      }
    })
    .catch((e) => {
      console.log(e);
    });

  const response = await http.get(`review/likecount/${viewId.value}`);
  // console.log(response.data);
  if (response.data) {
    isLike.value = true;
  } else {
    isLike.value = false;
  }
};

const updateLikeCount = async () => {
  const response = await http.post(`review/likecount/${review.value.reviewId}`);
  if (response.data === "up") {
    review.value.likeCount++;
    isLike.value = true;
  } else {
    review.value.likeCount--;
    isLike.value = false;
  }
};
</script>

<template>
  <div id="head-image">
    <div>{{ review.reviewTitle }}</div>
  </div>
  <div id="review-view-container">
    <div id="review-view-author-id">작성자 : {{ review.nickName }}</div>
    <div id="review-view-info">
      <div>
        <div>여행기간 : {{ review.travelStartDate }} ~ {{ review.travelEndDate }}</div>
        <div>여행인원 : ?</div>
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
      <div>코스</div>
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

    <VReviewCommentItem :viewId="viewId" :comments="comments" />
  </div>
</template>

<style scoped>
#review-view-container {
  padding-top: 30px;
  margin: 0px 25%;
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

/* #head-image div:last-child {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30px;
} */

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
