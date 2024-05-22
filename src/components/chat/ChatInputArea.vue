<script setup>
import { useChatStore } from '@/stores/chat';

const chatStore = useChatStore();


</script>

<template>
  <form @submit.prevent="chatStore.sendChat">
    <div class="chat-input-area">
      <input type="text" v-model="chatStore.chatText" placeholder="내용을 입력하세요">
      <button type="submit">전송</button>
    </div>
  </form>
</template>

<style scoped>
.chat-input-area {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  background-color: white;
  z-index: inherit;
  border-radius: 0 0 10px 0;
  border-top: 1px solid var(--brand-color);
}

.chat-input-area input {
  width: 80%;
  border-radius: 12px;
  height: 25px;
  font-size: 15px;
  margin-right: 5px;
  padding: 5px 10px;
  border: none;
}

.chat-input-area input:focus {
  outline: none;
}

.chat-input-area button {
  width: 20%;
  height: 100%;
  background-color: var(--brand-color);
  border: none;
  cursor: pointer;
  color: white;
  font-size: 15px;
}
</style>