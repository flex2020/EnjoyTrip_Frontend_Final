<script setup>
import { computed } from "vue";

const props = defineProps({
  toggle: Boolean,
});

const imageSrc = computed(() => props.toggle ? '/src/assets/img/fontawesome/arrow-left-solid.svg' : '/src/assets/img/fontawesome/comments-solid.svg');
</script>

<template>
  <div class="toggle-area">
    <button @click="$emit('toggleClick')">
      <img :src="imageSrc" width="25" height="25"/>
    </button>
  </div>
</template>

<style scoped>
.toggle-area {
  position: relative;
  top: 10px;
  left: 360px;
  width: 35px;
  height: 35px;
  z-index: 10;
}

.toggle-area button {
  background-color: white;
  border-radius: 50%;
  border: 1px solid black;
  width: inherit;
  height: inherit;
  padding: 2px;
  cursor: pointer;
}

</style>