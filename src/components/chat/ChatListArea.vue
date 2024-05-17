<script setup>
import ChatListItem from "@/components/chat/ChatListItem.vue";
import ChatNoticeItem from "@/components/chat/ChatNoticeItem.vue";
import { useChatStore } from "@/stores/chat";

const chatStore = useChatStore();


</script>

<template>
  <div class="chat-list-area">
    <template v-for="chat in chatStore.messages">
      <ChatListItem v-if="chat.type == 'chat'" :chat="chat" :key="chat.idx"/>
      <ChatNoticeItem v-if="chat.type == 'notice'" :chat="chat" :key="chat.idx" />
    </template>
    
  </div>
</template>

<style scoped>
.chat-list-area {
  width: 100%;
  height: calc(100% - 100px);
  background-color: white;
  z-index: inherit;
  overflow: auto;
}
</style>