import { ref } from 'vue'
import { defineStore } from 'pinia'
import chatApi from '@/api/chat';

export const useChatStore = defineStore('chatStore', () => {
  const chatText = ref('');
  const messages = ref([]);
  let userIdx = 0;
  function sendChat() {
    chatApi.setType('chat');
    chatApi.setContent(chatText.value);
    chatApi.sendChat();
    chatText.value = '';
  }

  function joinChat(matchId) {
    chatApi.connect().then(() => {
      chatApi.setMatchId(matchId);
      // chatApi.setUserIdx(userIdx++);
      chatApi.setType('signin');
      chatApi.setUsername('노의빈');
      chatApi.sendChat();
      chatText.value = '';
      messages.value = [];
    });
  }

  function addChatItem(message) {
    messages.value.push(message);
  }

  return { chatText, messages, sendChat, joinChat, addChatItem }
})
