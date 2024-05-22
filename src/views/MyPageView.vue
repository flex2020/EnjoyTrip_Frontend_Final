<script setup>
import { ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";
import VHeader from "@/components/common/VHeader.vue";
import MySideProfileContainer from "@/components/mypage/MySideProfileContainer.vue";
import MyTabContainer from "@/components/mypage/MyTabContainer.vue";
import MyContentContainer from "@/components/mypage/MyContentContainer.vue";
import MyWithdraw from "@/components/mypage/MyWithdraw.vue";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const activeTab = ref("profile");
const profileImageFile = ref(null);
const showModal = ref(false);
const showLeftContainer = ref(true); // Add this
const showRightContainer = ref(true); // Add this

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const updateProfileImage = (file) => {
  profileImageFile.value = file;
  console.log("MyPageView: profileImageFile updated:", profileImageFile.value);
};

watch(
  () => route.params.memberId,
  (newMemberId) => {
    activeTab.value = "profile";
    showLeftContainer.value = false; // Hide before changing
    showRightContainer.value = false; // Hide before changing

    setTimeout(() => {
      showLeftContainer.value = true; // Show after changing
      showRightContainer.value = true; // Show after changing
    }, 50); // Small delay to trigger re-animation
  }
);
</script>

<template>
  <VHeader />
  <div class="background">
    <div class="profile-container">
      <transition name="fade" mode="out-in">
        <div v-if="showLeftContainer" class="left-container">
          <MySideProfileContainer
            :active-tab="activeTab"
            :profile-image-file="profileImageFile"
            @update-profile-image="updateProfileImage"
          />
          <MyTabContainer
            :active-tab="activeTab"
            @update-active-tab="activeTab = $event"
            @open-modal="openModal"
          />
        </div>
      </transition>
      <transition name="fade" mode="out-in">
        <div v-if="showRightContainer" class="right-container">
          <MyContentContainer :active-tab="activeTab" :profile-image-file="profileImageFile" />
        </div>
      </transition>
    </div>
  </div>
  <div v-if="showModal" class="modal-overlay" @click="closeModal"></div>
  <transition name="modal">
    <MyWithdraw v-if="showModal" @close-modal="closeModal" />
  </transition>
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
  align-items: stretch;
}

.left-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 35%;
}

.right-container {
  width: 65%;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
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
  flex: 1;
  overflow-y: auto;
  max-height: 100%;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-enter-active,
.modal-leave-active {
  transition: transform 0.3s cubic-bezier(0.77, 0, 0.175, 1),
    opacity 0.3s cubic-bezier(0.77, 0, 0.175, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
