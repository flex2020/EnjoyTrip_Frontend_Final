<script setup>
import { useTripStore } from '@/stores/trip';
import { useRoute } from 'vue-router';

const route = useRoute();
const tripStore = useTripStore();
</script>

<template>
  <button class="tab-add-btn" @click="tripStore.addTab($route.params.matchId)">
    +
  </button>
</template>

<style scoped>
.tab-add-btn {
  width: 25px;
  height: 25px;
  background-color: white;
  color: var(--brand-color);
  border: 1px solid var(--brand-color);
  cursor: pointer;
}
</style>