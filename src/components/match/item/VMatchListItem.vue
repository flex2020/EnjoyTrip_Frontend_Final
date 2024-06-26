<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
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

const getRandomImage = () => {
  return `/src/assets/img/card_image${Math.floor(Math.random() * 3) + 1}.png`;
}
</script>

<template>
  <div id="match-list-item-container">
    <div
      class="match-list-item"
      v-for="match in matches"
      :key="match.matchId"
      @click="moveView(match.matchId)"
      :style="{backgroundImage: `url('${match.filePath ? match.filePath : getRandomImage()}')`}"
    >
    <div class="match-list-item-grad"></div>
      <div class="match-list-item-intro">
        <div>{{ match.matchTitle }}</div>
        <div>
          <span v-for="hashtag in match.hashtags" :key="hashtag" style="margin-left: 3px;">#{{ hashtag }}</span>
        </div>
      </div>
      <div class="match-list-item-info">
        <div>
          <img src="@/assets/img/fontawesome/eye-solid-white.svg" />
          <div>{{ match.hit }}</div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="loading" class="loading">마지막 페이지 입니다.</div>
  <button v-if="showScrollTopButton" @click="scrollToTop" class="scroll-to-top">
    <img src="/src/assets/img/fontawesome/chevron-up-solid.svg">
  </button>
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
  border-radius: 20px;
  margin: 1.667%;
  color: white;
  background-repeat: no-repeat;
  background-position: center center;
  position: relative;
  overflow: hidden;
  transition: 0.2s;
  cursor: pointer;
}

.match-list-item:hover {
  transform: scale(103%);
}

.match-list-item-grad {
  width: 100%;
  background: linear-gradient(to top, #000000FF, #00000000);
  height: 30%;
  position: absolute;
}

.match-list-item-intro {
  width: 70%;
  display: flex;
  flex-direction: column;
  z-index: 10;
  margin: 20px;
  text-overflow: ellipsis;
}

.match-list-item-intro div:first-child {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 10px;
  overflow: hidden;
  word-break: break-word;
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.match-list-item-intro div:last-child {
  overflow: hidden;
  word-break: break-word;
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.match-list-item-info {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin: 20px;
  z-index: 10;
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
  font-size: 1.2em;
  color: black;
  background-color: white;
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 34px;
}

.scroll-to-top {
  position: fixed;
  bottom: 50px;
  right: 50px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
  border: none;
  cursor: pointer;
}
</style>
