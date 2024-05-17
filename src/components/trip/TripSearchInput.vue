<script setup>
import { useTripStore } from "@/stores/trip";
import { getAttractionSearchResults } from "@/api/trip";

const tripStore = useTripStore();

</script>

<template>
  <form class="trip-search-form" @submit.prevent="tripStore.searchAttractions">
    <div class="trip-search-bar">
      <input type="text" placeholder="검색어를 입력해주세요." v-model="tripStore.keyword">
      <button type="submit">
        <img src="/src/assets/img/fontawesome/magnifying-glass-solid.svg" width="25" height="25"/>
      </button>
    </div>
  </form>
  
</template>

<style scoped>
.trip-search-form {
  width: 100%;
  height: auto;
}

.trip-search-bar {
  width: 100%;
  height: 50px;
  background-color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 11;
}

.trip-search-bar input {
  border: 1px solid var(--brand-color);
  width: 100%;
  margin: 7px;
  height: 38px;
  border-radius: 10px;
  font-size: 20px;
  padding-left: 5px;
  padding-right: 45px;  
}

.trip-search-bar input:focus {
  outline: none;
}

.trip-search-area button {
  border: none;
  background-color: transparent;
  position: absolute;
  right: 15px;
  cursor: pointer;
}
</style>