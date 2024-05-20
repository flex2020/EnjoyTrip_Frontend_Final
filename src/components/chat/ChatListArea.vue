<script setup>
import ChatListItem from "@/components/chat/ChatListItem.vue";
import ChatNoticeItem from "@/components/chat/ChatNoticeItem.vue";
import ChatGptItem from "@/components/chat/ChatGptItem.vue";
import { useChatStore } from "@/stores/chat";
import { ref, watch, nextTick } from "vue";
import { storeToRefs } from "pinia";

const chatStore = useChatStore();
const { messages } = storeToRefs(chatStore);
const chatListArea = ref(null);

const scrollToBottom = () => {
  if (chatListArea.value) {
    chatListArea.value.scrollTop = chatListArea.value.scrollHeight;
  }
};
// messages의 변화를 감지하여 scrollToBottom 호출
watch(messages, async () => {
  console.log('Messages changed:', messages.value);
  await nextTick();
  scrollToBottom();
}, {deep: true});

</script>

<template>
  <div class="chat-list-area" ref="chatListArea">
    <template v-for="chat in messages">
      <ChatListItem v-if="chat.type === 'chat'" :chat="chat" :key="chat.idx" />
      <ChatNoticeItem v-if="chat.type === 'notice'" :chat="chat" :key="chat.idx" />
      <ChatGptItem v-if="chat.type === 'gpt-answer'" :chat="chat" :key="chat.idx" />
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
