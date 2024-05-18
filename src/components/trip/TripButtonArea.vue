<script setup>
import TripPlanEditButton from "@/components/trip/TripPlanEditButton.vue"
import TripPlanRemoveButton from "@/components/trip/TripPlanRemoveButton.vue"
</script>

<template>
  <div class="trip-button-area">
    <TripPlanEditButton />
    <TripPlanRemoveButton />
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