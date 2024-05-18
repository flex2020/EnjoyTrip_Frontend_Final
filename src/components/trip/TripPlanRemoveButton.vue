<script setup>
import { useTripStore } from '@/stores/trip';
import { useRoute } from 'vue-router';

const tripStore = useTripStore();
const route = useRoute();
const updateCourse = () => {
  const index = tripStore.currentTab;
  if (!window.confirm(`현재 코스 [ ${index + 1}안 ]을 삭제하시겠습니까?`)) return;
  tripStore.removeTab(index);
}
</script>

<template>
  <button class="trip-plan-edit-btn" @click="updateCourse">
    현재 탭 닫기
  </button>
</template>

<style scoped>
.trip-plan-edit-btn {
  border: 1px solid rgb(224, 35, 35);
  color: rgb(224, 35, 35);
  background-color: white;
  padding: 5px 15px;
  border-radius: 15px;
  cursor: pointer;
  transition: 0.2s;
  font-size: 16px;
  font-weight: 600;
  width: 40%;
}

.trip-plan-edit-btn:hover {
  background-color: rgb(224, 35, 35);;
  color: white;
}
</style>