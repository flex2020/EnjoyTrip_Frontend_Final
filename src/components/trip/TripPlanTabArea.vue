<script setup>
import { useTripStore } from "@/stores/trip";
import TripPlanTabItem from "@/components/trip/TripPlanTabItem.vue";
import TripPlanTabAdd from "@/components/trip/TripPlanTabAdd.vue";
const tripStore = useTripStore();
</script>

<template>
  <div class="tab-area">
    <template v-for="(tab, index) in tripStore.tabItems" :key="index">
      <TripPlanTabItem v-if="!tripStore.isRemovedTab(index)" :index="index"/>
    </template>
    <TripPlanTabAdd />
  </div>
</template>

<style scoped>
.tab-area {
  height: 40px;
  display: flex;
  align-items: end;
  margin-bottom: 10px;
  padding: 0 10px;
  border-bottom: 1px solid var(--brand-color);
}
</style>