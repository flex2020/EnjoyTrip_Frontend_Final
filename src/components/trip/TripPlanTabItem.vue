<script setup>
import { useTripStore } from "@/stores/trip";
import { computed } from "vue";
const props = defineProps({
  index: Number,
})
const tripStore = useTripStore();

const styleClass = computed(() => {
  return tripStore.currentTab == props.index ? 'tab tab-selected' : 'tab';
})
</script>

<template>
  <button :class=styleClass @click="tripStore.changeTab(index)">
    {{ index + 1 }}안
  </button>
</template>

<style scoped>
.tab {
  background-color: white;
  color: var(--brand-color);
  border: 1px solid var(--brand-color);
  padding: 5px 22px;
  cursor: pointer;
  transition: 0.2s;
}

.tab:hover {
  background-color: var(--brand-color);
  color: white;
}

.tab-selected {
  background-color: var(--brand-color);
  color: white;
  padding: 9px 22px;
  z-index: 1;
  cursor: default;
}
</style>