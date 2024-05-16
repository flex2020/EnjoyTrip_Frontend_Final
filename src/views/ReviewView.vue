<script setup>
import VHeader from "@/components/common/VHeader.vue";
</script>

<template>
  <VHeader background="white"></VHeader>
  <div id="head-image">
    <div>여행 후기 작성</div>
    <div>좋았던 여행 후기를 공유해보세요</div>
  </div>
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
