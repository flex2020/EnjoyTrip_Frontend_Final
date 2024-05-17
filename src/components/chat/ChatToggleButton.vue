<script setup>
import { computed } from "vue";

const props = defineProps({
  toggle: Boolean,
});

const imageSrc = computed(() => props.toggle ? '/src/assets/img/fontawesome/arrow-left-solid-white.svg' : '/src/assets/img/fontawesome/comments-solid-white.svg');
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
  position: absolute;
  top: 10px;
  left: 385px;
  width: 45px;
  height: 45px;
  z-index: 10;
}

.toggle-area button {
  background-color: var(--brand-color);
  border-radius: 50%;
  border: none;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  width: inherit;
  height: inherit;
  padding: 9px;
  cursor: pointer;
}

.toggle-area button:focus {
  outline: none;
}

</style>