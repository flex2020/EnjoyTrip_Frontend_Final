<script setup>
import chatApi from "@/api/chat";
import ChatArea from "@/components/chat/ChatArea.vue";
import VHeader from "@/components/common/VHeader.vue";
import VKakaoMap from "@/components/common/VKakaoMap.vue"
import TripSearchArea from "@/components/trip/TripSearchArea.vue";
import { useTripStore } from "@/stores/trip";
import { onBeforeRouteLeave } from "vue-router";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";

const route = useRoute();
const tripStore = useTripStore();
onBeforeRouteLeave((to, from) => {
  if (!window.confirm('정말 채팅에서 나가시겠습니까?\n이전의 채팅 내용은 복구되지 않습니다.')) return false;
  chatApi.disconnect();
  tripStore.tabItems = [];
  tripStore.tabItemsLatLng = [[]];
  return true;
});

watch(
  () => route.params.matchId,
  (newId, oldId) => {
    console.log(newId, oldId)
    if (newId !== oldId) {
      window.location.reload();
    }
  }
);
</script>

<template>
  <VHeader background="white" />
  <ChatArea />
  <VKakaoMap /> 
  <TripSearchArea />
</template>

<style scoped></style>
