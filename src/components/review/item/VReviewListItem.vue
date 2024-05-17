<script setup>
defineProps({ reviews: Object });
</script>

<template>
  <div id="review-list-item-container">
    <div class="review-list-item" v-for="review in reviews" :key="review.reviewId">
      <div class="review-list-item-intro">
        <div>{{ review.reviewTitle }}</div>
        <div v-html="review.content"></div>
      </div>
      <div class="review-list-item-info">
        <div>
          <img src="@/assets/img/fontawesome/heart-solid.svg" />
          <div>{{ review.likeCount }}</div>
        </div>
        <div>
          <img src="@/assets/img/fontawesome/eye-solid.svg" />
          <div>1/6</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#review-list-item-container {
  display: flex;
  justify-content: space-between;
}

#review-list-item-container > div {
  width: 30%;
  height: 350px;
  background-color: gray;
  border-radius: 20px;
}

.review-list-item {
  display: flex;
  padding: 20px;
  justify-content: space-between;
  align-items: flex-end;
  color: white;
}

.review-list-item-intro {
  width: 70%;
  display: flex;
  flex-direction: column;
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
</style>
