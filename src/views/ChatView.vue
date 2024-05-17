<script setup>
import chatApi from "@/api/chat";
import ChatArea from "@/components/chat/ChatArea.vue";
import VHeader from "@/components/common/VHeader.vue";
import VKakaoMap from "@/components/common/VKakaoMap.vue"
import TripSearchArea from "@/components/trip/TripSearchArea.vue";
import { onBeforeRouteLeave } from "vue-router";

onBeforeRouteLeave((to, from) => {
  if (!window.confirm('정말 채팅에서 나가시겠습니까?\n이전의 채팅 내용은 복구되지 않습니다.')) return false;
  chatApi.disconnect();
  return true;
});

</script>

<template>
  <VHeader background="white" />
  <ChatArea />
  <VKakaoMap /> 
  <TripSearchArea />
</template>

<style scoped></style>
