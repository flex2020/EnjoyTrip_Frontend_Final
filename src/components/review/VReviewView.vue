<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Axios } from "/src/api/http-common";

const http = Axios();

const route = useRoute();
const router = useRouter();

// const articleno = ref(route.params.articleno);
const { viewid } = route.params;

const review = ref({});

onMounted(() => {
    getReview();
});

const getReview = () => {
  http.get(`review/${viewid}`)
  .then((response) => {
    console.log(response);
    review.value = response.data;
  })
  .catch((e) => {
    console.log(e);
  })
};
</script>

<template>
  <div id="head-image">
    <div>{{ review.reviewTitle }}</div>
  </div>
  <div id="review-view-container">
    <div id="review-view-author-id">{{ review.memberName }}</div>
    <div id="review-view-info">
      <div>
        <div>여행기간 : {{ review.travelStartDate }} ~ {{review.travelEndDate}}</div>
        <div>여행인원 : ?</div>
      </div>
      <div>
        <div>
          <img src="@/assets/img/fontawesome/heart-solid.svg" width="30px" />
          {{ review.likeCount }}
        </div>
        <div>
          <img src="@/assets/img/fontawesome/eye-solid.svg" width="30px" />
          {{ review.hit }}
        </div>
      </div>
    </div>
    <div id="review-view-contents" v-html="review.content">
    </div>
    <div id="review-view-course">
        <div>여행 코스</div>
        <div>코스</div>
    </div>
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
  margin-left: 10px
}

#review-view-course {
    margin-top: 30px;
}

#review-view-course div:first-child {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 15px;
}
</style>
