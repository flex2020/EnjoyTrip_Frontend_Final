import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { getAttractionSearchResults, getMatchCourse, updateMatchCourse } from "@/api/trip";
import chatApi from '@/api/chat';

export const useChatListStore = defineStore('chatlistStore', () => {
  const chatList = ref([]);

  
  function checkIncludes(matchId) {
    for (let i=0; i<chatList.value.length; i++) {
      if (chatList.value[i].matchId == matchId) return true;
    }
    return false;
  }

  return {
    chatList,
    checkIncludes,
  }
})
