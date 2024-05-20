<script setup>
import PlanListItem from "@/components/plan/PlanListItem.vue";
import { usePlanStore } from "@/stores/plan";
import draggable from "vuedraggable";

const planStore = usePlanStore();

// 드래그 이벤트 핸들러
const onEnd = (event) => {
  planStore.refreshCoursePath();
};
</script>

<template>
  <div class="trip-plan-list">
    <draggable group="tripplan" v-model="planStore.plan" @end="onEnd" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
      <template #item="{element}">
        <PlanListItem :trip-plan="element"/>
      </template>
      
    </draggable>
    
    <p v-if="!planStore.plan || planStore.plan.length == 0">아직 여행계획이 없습니다.</p>
  </div>
</template>

<style scoped>
.trip-plan-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  height: calc(100vh - 280px);
}

.trip-plan-list>p {
  overflow: hidden;
}
</style>