<script setup>
import { KakaoMap } from 'vue3-kakao-maps';
</script>

<template>
  <div id="map">
    <KakaoMap :lat="37.5664056" :lng="126.9778222" width="100%" height="100vh" level="4" />
  </div>
</template>

<style scoped>
#map {
  z-index: -1;
}
</style>