<script setup>
import { useTripStore } from "@/stores/trip";

defineProps({
  tripPlan: Object,
});

const tripStore = useTripStore();
</script>

<template>
  <div
    class="trip-plan-list-item"
    @click="tripStore.setCenter(tripPlan.latitude, tripPlan.longitude)"
  >
    <div class="trip-plan-list-item-top">
      <h2>{{ tripPlan.title }}</h2>
      <img :src="tripPlan.firstImage" />
    </div>
    <div class="trip-plan-list-item-bottom">
      <div>
        <p>
          {{ tripPlan.addr1 }}
        </p>
        <p>
          {{ tripPlan.addr2 }}
        </p>
      </div>
      <button @click="tripStore.removeTripPlan(tripPlan)">
        <img src="/src/assets/img/fontawesome/trash-solid.svg" width="16px"/>
      </button>
    </div>
  </div>
</template>

<style scoped>
.trip-plan-list-item {
  width: 90%;
  height: 120px;
  box-shadow: 0 0 5px #333;
  border-radius: 7px;
  padding: 10px;
  margin: 2px auto;
  cursor: grab;
  transition: 0.2s;
}
.trip-plan-list-item:hover {
  background-color: var(--brand-color);
  color: white;
}
.trip-plan-list-item-top {
  width: 100%;
  height: 65%;
  display: flex;
  justify-content: space-between;
}

.trip-plan-list-item-top h2 {
  font-size: 20px;
  font-weight: 700;
}

.trip-plan-list-item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 35%;
}

.trip-plan-list-item-bottom button {
  border: none;
  border-radius: 50%;
  background-color: rgb(223, 48, 48);
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style>
