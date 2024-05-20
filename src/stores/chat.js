import { ref } from 'vue'
import { defineStore } from 'pinia'
import chatApi from '@/api/chat';
import { useAuthStore } from "./auth";

export const useChatStore = defineStore('chatStore', () => {
  const chatText = ref('');
  const messages = ref([]);
  let userIdx = 0;
  function sendChat() {
    if (!chatText || chatText.value == '') return;
    const authStore = useAuthStore();
    chatApi.sendMessage({
      type: 'chat',
      username: authStore.getNickname,
      matchId: chatApi.matchId,
      content: chatText.value,
    });

    chatText.value = '';
  }

  function joinChat(matchId) {
    chatApi.connect().then(() => {
      const authStore = useAuthStore();
      chatApi.setMatchId(matchId);
      chatApi.sendMessage({
        type: 'signin',
        username: authStore.getNickname,
        matchId: matchId,
        content: '',
      });
      chatText.value = '';
    });
  }

  function resetMessages() {
    console.log('messages = ' + messages.value);
    messages.value = [];
    console.log('reset messages = ' + messages.value);
  }

  function addChatItem(message) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    message.time = `${year}-${month}-${day} ${hours}:${minutes}`;
    console.log(message)
    messages.value.push(message);
  }

  return { chatText, messages, sendChat, joinChat, addChatItem, resetMessages }
})
