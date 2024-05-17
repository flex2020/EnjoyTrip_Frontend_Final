<script setup>
import TripPlanListItem from "@/components/trip/TripPlanListItem.vue";
import { useTripStore } from "@/stores/trip";

const tripStore = useTripStore();
</script>

<template>
  <div class="trip-plan-list">
    <TripPlanListItem v-for="tripPlan in tripStore.tabItems[tripStore.currentTab] " :key="tripPlan.contentId" :trip-plan="tripPlan"/>
    <p v-if="!tripStore.tabItems[tripStore.currentTab] || tripStore.tabItems[tripStore.currentTab].length == 0">아직 여행계획이 없습니다.</p>
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