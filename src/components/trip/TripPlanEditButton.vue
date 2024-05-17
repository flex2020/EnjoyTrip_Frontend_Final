<script setup>
import { useTripStore } from '@/stores/trip';
import { useRoute } from 'vue-router';

const tripStore = useTripStore();
const route = useRoute();
const updateCourse = () => {
  const index = tripStore.currentTab;
  if (!window.confirm(`여행코스를 [ ${index + 1}안 ]으로 수정하시겠습니까?`)) return;
}
</script>

<template>
  <button class="trip-plan-edit-btn" @click="updateCourse">
    현재 코스 적용
  </button>
</template>

<style scoped>
.trip-plan-edit-btn {
  border: 1px solid var(--brand-color);
  color: var(--brand-color);
  background-color: white;
  padding: 5px 15px;
  border-radius: 15px;
  cursor: pointer;
  transition: 0.2s;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
}

.trip-plan-edit-btn:hover {
  background-color: var(--brand-color);
  color: white;
}
</style>