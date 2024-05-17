<script setup>
import { onMounted, ref } from "vue";
import { getSidoList, getGugunList } from "@/api/trip";
import { useTripStore } from "@/stores/trip";
import TripSearchInput from "@/components/trip/TripSearchInput.vue";
import TripPlanList from "@/components/trip/TripPlanList.vue"

const sidoList = ref([]);
const gugunList = ref([]);
const tripStore = useTripStore();

onMounted(async () => {
  sidoList.value = await getSidoList();
});

const changeSidoHandler = async () => {
  gugunList.value = await getGugunList(tripStore.sido);
};

</script>

<template>
  <div class="trip-search-area">
    <div class="trip-search-area-top">
      <select v-model="tripStore.sido" @change="changeSidoHandler">
        <option selected value="">시도 선택 안함</option>
        <option v-for="sido in sidoList" :key="sido.sidoCode" :value="sido.sidoCode">{{ sido.sidoName }}</option>
      </select>
      <select v-model="tripStore.gugun">
        <option selected value="">구군 선택 안함</option>
        <option v-for="gugun in gugunList" :key="gugun.gugunCode" :value="gugun.gugunCode">{{ gugun.gugunName }}</option>
      </select>
      <TripSearchInput />
    </div>
    <TripPlanList />
  </div>
</template>

<style scoped>
.trip-search-area {
  position: absolute;
  top: 80px;
  right: 0;
  display: flex;
  flex-direction: column;
  width: 400px;
  height: calc(100vh - 80px);
  background-color: white;
  z-index: 10;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 8px 8px rgba(0,0,0,0.23);
}

.trip-search-area-top {
  width: 100%;
  height: 90px;
}
</style>