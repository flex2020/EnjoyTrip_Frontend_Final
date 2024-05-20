<script setup>
import { usePlanStore } from "@/stores/plan";
import { useRoute } from 'vue-router';

const route = useRoute();
const planStore = usePlanStore();

const saveCourse = () => {
  planStore.nameInputToggle = true;
}

</script>

<template>
  <button class="plan-save-btn" @click="saveCourse">
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