<script setup>
import { computed } from 'vue';
import MyProfile from '@/components/mypage/MyProfile.vue';
import MyProfileUpdate from '@/components/mypage/MyProfileUpdate.vue';
import MyCourses from '@/components/mypage/MyCourses.vue';
import MyMatches from '@/components/mypage/MyMatches.vue';
import MyReviews from '@/components/mypage/MyReviews.vue';
import MyWithdraw from '@/components/mypage/MyWithdraw.vue';

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  }
});

const componentsMap = {
  profile: MyProfile,
  profileUpdate: MyProfileUpdate,
  courses: MyCourses,
  matches: MyMatches,
  reviews: MyReviews,
  withdraw: MyWithdraw,
};

const activeComponent = computed(() => componentsMap[props.activeTab]);
</script>

<template>
  <div class="content-container">
    <component :is="activeComponent"></component>
  </div>
</template>

<style scoped>
.content-container {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
}
</style>
