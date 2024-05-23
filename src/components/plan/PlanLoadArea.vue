<script setup>
import { getCourseByCourseId } from '@/api/plan';
import { useAuthStore } from "@/stores/auth";
import { usePlanStore } from '@/stores/plan';
import { onMounted } from 'vue';

const planStore = usePlanStore();
const authStore = useAuthStore();

onMounted(() => {
  const memberId = authStore.getMemberId;
  planStore.loadCourseList(memberId);
})

const courseChangeHandler = async () => {
  if (!window.confirm('변경 시 마지막 저장 이후의 데이터는 유지되지 않습니다.\n정말 변경하시겠습니까?')) {
    planStore.courseId = planStore.prevCourseId;
    return;
  }
  const courseId =  planStore.courseId;
  planStore.plan = await getCourseByCourseId(courseId);
  planStore.refreshCoursePath();
  planStore.prevCourseId = planStore.courseId;
  planStore.courseName = planStore.getCourseNameByCourseId(planStore.courseId);
  if (planStore.courseList) planStore.setCenter(planStore.planLatLng[0].lat, planStore.planLatLng[0].lng);
  console.log(planStore.courseName);
}

</script>

<template>
  <div class="load-area">
    <select v-model="planStore.courseId" @change="courseChangeHandler">
      <option selected value="-1">불러올 여행 코스를 선택하세요.</option>
      <option v-for="course in planStore.courseList" :value="course.courseId" :key="course.courseId">{{ course.courseName }}</option>
    </select>
  </div>
</template>

<style scoped>
.load-area {
  height: 40px;
  display: flex;
  align-items: end;
  margin-bottom: 10px;
  padding: 0 10px;
  border-bottom: 1px solid var(--brand-color);
}

.load-area select {
  width: 100%;
  height: 30px;
  border-radius: 5px;
  padding-left: 5px;
  margin-bottom: 5px;
  font-size: 16px;
}
</style>