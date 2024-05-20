<script setup>
import PlanAddButton from "@/components/plan/PlanAddButton.vue"
import PlanRemoveButton from "@/components/plan/PlanRemoveButton.vue"
import { usePlanStore } from "@/stores/plan";
const planStore = usePlanStore();
</script>

<template>
  <div class="trip-button-area">
    <PlanAddButton />
    <PlanRemoveButton v-if="planStore.courseId != -1"/>
  </div>
</template>

<style scoped>
.trip-button-area {
  height: 60px;
  padding: 10px;
  display: flex;
  align-items: center;
}
</style>