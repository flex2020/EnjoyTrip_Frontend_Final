<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { defineEmits, defineProps } from "vue";
import { useRouter } from "vue-router";

const emit = defineEmits(["loadMoreReviews"]);
const router = useRouter();

// Define props
const props = defineProps({
  reviews: Object,
  currentPage: Number,
  totalPageCount: Number,
});

// Reactive state for loading
const loading = ref(false);
const showScrollTopButton = ref(false);

// Function to check if user has scrolled to the bottom
const isBottomOfPage = () => {
  return window.innerHeight + window.scrollY >= document.body.offsetHeight;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Function to handle scroll event
const handleScroll = () => {
  if (window.scrollY > 200) {
    showScrollTopButton.value = true;
  } else if (window.scrollY <= 200) {
    showScrollTopButton.value = false;
  }

  if (isBottomOfPage() && props.currentPage < props.totalPageCount) {
    // console.log(props.currentPage);
    emit("currentPageAdd");

    // // Simulate loading more content
    // setTimeout(() => {
    //   loading.value = false;
    // }, 2000); // Adjust the delay as needed
  } else if (isBottomOfPage() && props.currentPage >= props.totalPageCount) {
    loading.value = true;
  }
};

// Add and remove scroll event listener
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

const moveView = (viewId) => {
  router.push({
    name: "review-view",
    params: { viewid: viewId },
  });
};
</script>

<template>
  <div id="review-list-item-container">
    <div
      class="review-list-item"
      v-for="review in reviews"
      :key="review.reviewId"
      @click="moveView(review.reviewId)"
      v-show="review.deleted === 0 ? true : false"
      :style="{backgroundImage: `url('${review.firstImage}')`}"
    > 
    <div class="review-list-item-grad"></div>
      <div class="review-list-item-intro">
        <div>{{ review.reviewTitle }}</div>
        <div>{{ review.previewContent }}</div>
      </div>
      <div class="review-list-item-info">
        <div>
          <img src="@/assets/img/fontawesome/heart-solid.svg" />
          <div>{{ review.likeCount }}</div>
        </div>
        <div>
          <img src="@/assets/img/fontawesome/eye-solid-white.svg" />
          <div>{{ review.hit }}</div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="loading" class="loading">마지막 페이지 입니다.</div>
  <button v-if="showScrollTopButton" @click="scrollToTop" class="scroll-to-top">맨 위로</button>
</template>

<style scoped>
#review-list-item-container {
  display: flex;
  flex-flow: wrap;
}

#review-list-item-container:hover {
  cursor: pointer;
}

.review-list-item {
  display: flex;
  align-items: flex-end;
  width: 30%;
  height: 350px; 
  border-radius: 20px;
  margin: 1.667%;
  color: white;
  background-repeat: no-repeat;
  background-position: center center;
  position: relative;
  overflow: hidden;
}

.review-list-item-grad {
  width: 100%;
  background: linear-gradient(to top, #000000FF, #00000000);
  height: 30%;
  position: absolute;
}

.review-list-item-intro {
  width: 70%;
  display: flex;
  flex-direction: column;
  z-index: 10;
  margin: 20px;
  text-overflow: ellipsis;
   overflow: hidden;
   word-break: break-word;
    
   display: -webkit-box;
   -webkit-line-clamp: 3;
   -webkit-box-orient: vertical;
}

.review-list-item-intro div:first-child {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 10px;
  
}

.review-list-item-info {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin: 20px;
  z-index: 10;
}

.review-list-item-info div {
  display: flex;
  align-items: center;
}

.review-list-item-info img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.review-list-item-info div:first-child {
  margin-bottom: 5px;
}

.loading {
  width: 100%;
  text-align: center;
  font-size: 1.5em;
  color: white;
  background-color: gray;
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 34px;
}

.scroll-to-top {
  position: fixed;
  bottom: 50px;
  right: 50px;
}
</style>
