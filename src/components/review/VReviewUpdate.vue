<script setup>
import VReviewFormItem from "@/components/review/item/VReviewFormItem.vue";
</script>

<template>
  <div id="head-image">
    <div>여행 후기 수정</div>
    <div>여행 후기를 수정해보세요</div>
  </div>
  <VReviewFormItem type="update" />
</template>

<style scoped>
#head-image {
  width: 100%;
  height: 500px;
  background-image: url("/src/assets/img/reviewwrite.png");
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

#head-image div:last-child {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30px;
}
</style>
