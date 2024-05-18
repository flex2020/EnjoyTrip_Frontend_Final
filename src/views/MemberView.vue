<script setup>
import VHeader from "@/components/common/VHeader.vue";
</script>

<template>
  <VHeader></VHeader>
  <div class="background">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<style scoped>
.background {
  width: 100vw;
  height: 100vh;
  background-repeat: no-repeat;
  background-image: url("/src/assets/img/mainpage.png");
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.15);
}

/* Fade transition styles */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
