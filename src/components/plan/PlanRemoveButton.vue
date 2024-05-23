<script setup>

import { removeCourseByCourseId } from "@/api/plan";
import { usePlanStore } from "@/stores/plan";
import { useRoute } from 'vue-router';

const planStore = usePlanStore();
const route = useRoute();
const removePlan = async () => {
  if (!window.confirm(`코스 [${planStore.courseName}] 를 삭제하시겠습니까?`)) return;
  await removeCourseByCourseId(planStore.courseId);
  console.log(planStore.courseId)
  console.log(planStore.courseList)
  planStore.courseList = planStore.courseList.filter((course) => course.courseId != planStore.courseId);
  planStore.courseId = -1;
  planStore.plan = [];
  planStore.planLatLng = [];
}
</script>

<template>
  <button class="trip-plan-edit-btn" @click="removePlan">
    코스 삭제하기
  </button>
</template>

<style scoped>
.trip-plan-edit-btn {
  border: 1px solid rgb(224, 35, 35);
  color: rgb(224, 35, 35);
  background-color: white;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.2s;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
}

.trip-plan-edit-btn:hover {
  background-color: rgb(224, 35, 35);;
  color: white;
}
</style>