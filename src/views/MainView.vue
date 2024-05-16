<script setup>
import VHeader from "@/components/common/VHeader.vue";
</script>

<template>
  <VHeader></VHeader>
  <div class="background">
    <div id="main-intro">
      <div>함께 여행할 친구를 찾고</div>
      <div>여행 후기를 기록해보세요</div>
    </div>
  </div>
</template>

<style scoped>
.background {
  width: 100vw;
  height: 100vh;
  background-repeat: no-repeat; /* 이미지 반복 방지 */
  background-image: url("/src/assets/img/mainpage.png");
  position: relative;
  z-index: -1; /* VHeader 위에 배치되도록 함 */
}

.background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.15); /* 여기서 투명도 조절 가능 */
}

#main-intro {
  position: relative;
  top: 320px;
  /* left: 100px; */
  margin-left: 100px;
  font-weight: 1000;
  color: white;
}

#main-intro div:first-child {
  font-size: 64px;
  margin-bottom: 15px;
}

#main-intro div:last-child {
  font-size: 48px;
}
</style>
