<script setup>
import { usePlanStore } from "@/stores/plan";

defineProps({
  tripPlan: Object,
});

const planStore = usePlanStore();
</script>

<template>
  <div class="trip-plan-list-item">
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
      <button @click="planStore.removePlan(tripPlan)">
        <img src="/src/assets/img/fontawesome/trash-solid.svg" width="20"/>
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
  margin: 2px;
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
  width: 40px;
  height: 40px;
  cursor: pointer;
}

</style>