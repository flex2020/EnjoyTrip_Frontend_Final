<script setup>
import VMatchFormItem from "@/components/match/item/VMatchFormItem.vue";
</script>

<template>
  <div id="head-image">
    <div>여행 메이트 매칭 게시글 작성</div>
    <div>원하는 메이트를 구하기 위해서 자세하게 작성해보세요</div>
  </div>
  <VMatchFormItem type="write" />
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
