<script setup>
import { useTripStore } from "@/stores/trip";
const tripStore = useTripStore();

const props = defineProps({
  attraction: Object,
});

</script>

<template>
  <div class="marker-info">
    <div class="marker-info-top">
      <h2>{{ attraction.title }}</h2>
      <img :src="attraction.firstImage" />
    </div>
    <div class="marker-info-bottom">
      <p>
        {{ attraction.addr1 }}
      </p>
      <p>
        {{ attraction.addr2 }}
      </p>
      <button class="btn-add" v-if="!tripStore.checkIncludes(attraction)" @click="tripStore.addTripPlan(attraction)">
        여행 코스에 추가
      </button>
      <button class="btn-remove" v-if="tripStore.checkIncludes(attraction)" @click="tripStore.removeTripPlan(attraction)">
        여행 코스에서 삭제
      </button>
    </div>
  </div>
</template>

<style scoped>
  .marker-info {
    width: 250px;
    height: 150px;
    padding: 10px;
  }

  .marker-info-top {
    width: 250px;
    height: 50%;
    display: flex;
    justify-content: space-between;
  }

  .marker-info-top h2 {
    font-size: 20px;
    font-weight: 700;
  }

  .marker-info-bottom {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 50%;
  }

  .marker-info-bottom button {
    border: none;
    padding: 5px;
    border-radius: 15px;
    color: white;
    cursor: pointer;
  }
  .marker-info-bottom .btn-add {
    background-color: var(--brand-color);
  }
  .marker-info-bottom .btn-remove {
    background-color: rgb(223, 48, 48);
  }
</style>