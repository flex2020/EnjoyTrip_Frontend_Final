<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { defineEmits, defineProps } from "vue";
import { useRouter } from "vue-router";

const emit = defineEmits(["currentPageAdd"]);
const router = useRouter();

// Define props
const props = defineProps({
  matches: Object,
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

const moveView = (matchId) => {
  router.push({
    name: "match-view",
    params: { matchid: matchId },
  });
};
</script>

<template>
  <div id="match-list-item-container">
    <div
      class="match-list-item"
      v-for="match in matches"
      :key="match.matchId"
      @click="moveView(match.matchId)"
      v-show="match.deleted === 0 ? true : false"
    >
      <div class="match-list-item-intro">
        <div>{{ match.matchTitle }}</div>
      </div>
      <div class="match-list-item-info">
        <div>
          <img src="@/assets/img/fontawesome/heart-solid.svg" />
          <div>{{ match.hit }}</div>
        </div>
        <div>
          <img src="@/assets/img/fontawesome/eye-solid.svg" />
          <div>{{ match.hit }}</div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="loading" class="loading">마지막 페이지 입니다.</div>
  <button v-if="showScrollTopButton" @click="scrollToTop" class="scroll-to-top">맨 위로</button>
</template>

<style scoped>
#match-list-item-container {
  display: flex;
  flex-flow: wrap;
}

#match-list-item-container:hover {
  cursor: pointer;
}

.match-list-item {
  display: flex;
  align-items: flex-end;
  width: 30%;
  height: 350px;
  background-color: gray;
  border-radius: 20px;
  margin: 1.667%;
  padding: 20px;
  color: white;
}

.match-list-item-intro {
  width: 70%;
  display: flex;
  flex-direction: column;
}

.match-list-item-intro div:first-child {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 10px;
}

.match-list-item-info {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.match-list-item-info div {
  display: flex;
  align-items: center;
}

.match-list-item-info img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.match-list-item-info div:first-child {
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
