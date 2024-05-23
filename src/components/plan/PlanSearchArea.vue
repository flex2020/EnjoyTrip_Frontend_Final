<script setup>
import { onMounted, ref } from "vue";
import { getSidoList, getGugunList, getMatchCourse } from "@/api/trip";
import PlanSearchInput from "@/components/plan/PlanSearchInput.vue";
import { useRoute } from "vue-router";
import { usePlanStore } from "@/stores/plan";
import PlanLoadArea from "./PlanLoadArea.vue";
import PlanButtonArea from "./PlanButtonArea.vue";
import PlanList from "./PlanList.vue";

const sidoList = ref([]);
const gugunList = ref([]);
const planStore = usePlanStore();
const route = useRoute();

onMounted(async () => {
  sidoList.value = await getSidoList();
});

const changeSidoHandler = async () => {
  if (!planStore.sido || planStore.sido === '') planStore.gugun = '';
  gugunList.value = await getGugunList(planStore.sido);
};

</script>

<template>
  <div class="plan-search-area">
    <div class="plan-search-area-top">
      <select v-model="planStore.sido" @change="changeSidoHandler">
        <option selected value="">시도 선택 안함</option>
        <option v-for="sido in sidoList" :key="sido.sidoCode" :value="sido.sidoCode">{{ sido.sidoName }}</option>
      </select>
      <select v-model="planStore.gugun">
        <option selected value="">구군 선택 안함</option>
        <option v-for="gugun in gugunList" :key="gugun.gugunCode" :value="gugun.gugunCode">{{ gugun.gugunName }}</option>
      </select>
      <PlanSearchInput />
    </div>
    <PlanLoadArea />
    <PlanList />
    <PlanButtonArea />
  </div>
</template>

<style scoped>
.plan-search-area {
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

.plan-search-area-top {
  width: 100%;
  height: 120px;
}

.plan-search-area select {
  width: 46%;
  height: 30px;
  border-radius: 5px;
  padding-left: 5px;
  margin: 15px 7px 10px;
  font-size: 16px;
}

</style>