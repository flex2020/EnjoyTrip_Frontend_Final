<script setup>
import { usePlanStore } from "@/stores/plan";
import { getAttractionSearchResults } from "@/api/trip";

const planStore = usePlanStore();

</script>

<template>
  <form class="plan-search-form" @submit.prevent="planStore.searchAttractions">
    <div class="plan-search-bar">
      <input type="text" placeholder="검색어를 입력해주세요." v-model="planStore.keyword">
      <button type="submit">
        <img src="/src/assets/img/fontawesome/magnifying-glass-solid.svg" width="25" height="25"/>
      </button>
    </div>
  </form>
  
</template>

<style scoped>
.plan-search-form {
  width: 100%;
  height: auto;
}

.plan-search-bar {
  width: 100%;
  height: 50px;
  background-color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 11;
}

.plan-search-bar input {
  border: 1px solid var(--brand-color);
  width: 100%;
  margin: 7px;
  height: 38px;
  border-radius: 10px;
  font-size: 20px;
  padding-left: 5px;
  padding-right: 45px;  
}

.plan-search-bar input:focus {
  outline: none;
}

.plan-search-area button {
  border: none;
  background-color: transparent;
  position: absolute;
  right: 15px;
  cursor: pointer;
}
</style>