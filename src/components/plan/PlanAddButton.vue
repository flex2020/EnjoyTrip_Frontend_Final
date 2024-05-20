<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const updateCourse = () => {
  if (!window.confirm(`현재 코스를 저장하시겠습니까?`)) return;
  tripStore.updateCourse()
    .then(() => {
      alert('저장 되었습니다.')
    })
    .catch(() => {
      alert('저장에 실패했습니다.')
    });
}

</script>

<template>
  <button class="plan-save-btn" @click="updateCourse">
    현재 코스 저장
  </button>
</template>

<style scoped>
.plan-save-btn{
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
  margin-right: 5px;
}

.plan-save-btn:hover {
  background-color: var(--brand-color);
  color: white;
}
</style>