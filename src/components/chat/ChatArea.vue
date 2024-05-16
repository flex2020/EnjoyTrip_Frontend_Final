<script setup>
import { onMounted, ref } from "vue";
import ChatToggleButton from "@/components/chat/ChatToggleButton.vue";
import ChatListArea from "@/components/chat/ChatListArea.vue";
import ChatInputArea from "@/components/chat/ChatInputArea.vue";
import ChatTitleArea from "@/components/chat/ChatTitleArea.vue";
import { useChatStore } from "@/stores/chat";
import { useRoute } from "vue-router";

const chatStore = useChatStore();
const chatToggle = ref(false);
const route = useRoute();

onMounted(() => {
  chatStore.joinChat(route.params.matchId);
})

const toggleClick = () => {
  chatToggle.value = !chatToggle.value;
  console.log(chatToggle.value)
}

</script>

<template>
  <div :class="'chat-area ' + (chatToggle ? 'chat-area-on' : 'chat-area-off')">
    <ChatToggleButton @click="toggleClick" :toggle="chatToggle"/>
    <div class="chat-area-wrapper">
      <ChatTitleArea />
      <ChatListArea />
      <ChatInputArea />
    </div>
  </div>
</template>

<style scoped>
.chat-area {
  position: absolute;
  top: 80px;
  height: calc(100vh - 80px);
  width: 375px;
  border-radius: 0 10px 10px 0;
  z-index: 10;
  transition: 0.2s;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 8px 8px rgba(0,0,0,0.23);
}
.chat-area-off {
  left: -375px;
}

.chat-area-on {
  left: 0px;
}

.chat-area-wrapper {
  height: inherit;
}
</style>