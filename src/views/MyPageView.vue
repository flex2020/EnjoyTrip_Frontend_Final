<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "/src/api/http-common";
import VHeader from "@/components/common/VHeader.vue";
import MySideProfileContainer from "@/components/mypage/MySideProfileContainer.vue";
import MyTabContainer from "@/components/mypage/MyTabContainer.vue";
import MyContentContainer from "@/components/mypage/MyContentContainer.vue";

const http = Axios();
const authStore = useAuthStore();

// 탭 상태 관리
const activeTab = ref('profile');
const profileImageFile = ref(null); // 프로필 이미지 파일
</script>

<template>
  <VHeader></VHeader>
  <div class="background">
    <transition name="fade">
      <div class="profile-container">
        <div class="left-container">
          <MySideProfileContainer :active-tab="activeTab" :profile-image-file="profileImageFile"></MySideProfileContainer>
          <MyTabContainer :active-tab="activeTab" @update-active-tab="activeTab = $event"></MyTabContainer>
        </div>
        <div class="right-container">
          <MyContentContainer :active-tab="activeTab" :profile-image-file="profileImageFile"></MyContentContainer>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("/src/assets/img/mainpage.png");
  background-size: cover;
  background-position: center;
  position: relative;
}

.background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.15);
  z-index: 1;
}

.profile-container {
  display: flex;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  height: 80%;
  max-width: 1200px;
  position: relative;
  z-index: 2;
  align-items: stretch; /* 두 자식 컨테이너의 높이를 동일하게 설정 */
}

.left-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 35%; /* 왼쪽 컨테이너 폭 */
}

.right-container {
  width: 65%; /* 오른쪽 컨테이너 폭 */
  margin-left: 20px;
  display: flex;
  flex-direction: column; /* 컨텐츠가 중앙에 정렬되도록 설정 */
  justify-content: center;
  align-items: center;
}

.profile-sidebar,
.tab-container,
.content-container {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.content-container {
  flex: 1; /* 오른쪽 컨테이너가 남은 공간을 모두 차지하도록 설정 */
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤 */
  max-height: 100%; /* 부모 컨테이너의 높이를 초과하지 않도록 설정 */
}
</style>
