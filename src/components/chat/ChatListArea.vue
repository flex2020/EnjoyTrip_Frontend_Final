<script setup>
import ChatListItem from "@/components/chat/ChatListItem.vue";
import { useChatStore } from "@/stores/chat";

const chatStore = useChatStore();


</script>

<template>
  <div class="chat-list-area">
    <ChatListItem v-for="chat in chatStore.messages" :chat="chat"/>
  </div>
</template>

<style scoped>
.chat-list-area {
  width: 100%;
  height: calc(100% - 100px);
  background-color: white;
  z-index: inherit;
  border-radius: 0 10px 0 0;
  overflow: auto;
}
</style>