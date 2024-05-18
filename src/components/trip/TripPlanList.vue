<script setup>
import chatApi from "@/api/chat";
import TripPlanListItem from "@/components/trip/TripPlanListItem.vue";
import { useTripStore } from "@/stores/trip";
import draggable from "vuedraggable";

const tripStore = useTripStore();

// 드래그 이벤트 핸들러
const onEnd = (event) => {
  tripStore.refreshCoursePath();
  const content = {
      tabIndex: tripStore.currentTab,
      data: tripStore.tabItems[tripStore.currentTab],
    };
    const message = {
      type: 'update-tab',
      username: chatApi.username,
      content: JSON.stringify(content),
      matchId: chatApi.matchId,
    };
    chatApi.sendMessage(message);
};
</script>

<template>
  <div class="trip-plan-list">
    <draggable group="tripplan" v-model="tripStore.tabItems[tripStore.currentTab]" @end="onEnd" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
      <template #item="{element}">
        <TripPlanListItem :trip-plan="element"/>
      </template>
      
    </draggable>
    
    <p v-if="!tripStore.tabItems[tripStore.currentTab] || tripStore.tabItems[tripStore.currentTab].length == 0">아직 여행계획이 없습니다.</p>
  </div>
</template>

<style scoped>
.trip-plan-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  height: calc(100vh - 280px);
}

.trip-plan-list>p {
  overflow: hidden;
}
</style>