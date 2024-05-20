import { useChatStore } from "@/stores/chat";
import { useTripStore } from "@/stores/trip";
import { getAttractionRecommend } from "./gpt";
class ChatApi {
  
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.matchId = -1;
    this.chatStore = null;
    this.tripStore = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      const WebSocketURL = import.meta.env.VITE_WEB_SOCKET_URL;
      this.socket = new WebSocket(WebSocketURL);

      this.socket.onopen = () => {
        this.isConnected = true;
        console.log('WebSocket connection established');
        this.chatStore = useChatStore();
        this.tripStore = useTripStore();
        resolve();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      this.socket.onclose = (event) => {
        this.isConnected = false;
        console.log('WebSocket connection closed', event);
      };

      this.socket.onmessage = (event) => {
        if (this.onMessage) {
          this.onMessage(JSON.parse(event.data));
        }
      };
    });
  }

  onMessage(message) {
    //alert('메시지 수신');
    console.log(message)
    if (message.type == 'chat' || message.type == 'notice' || message.type == 'gpt-answer') {
      this.chatStore.addChatItem(message);
    } else if (message.type == 'update-tab') {
      const updatedData = JSON.parse(message.content);
      console.log(updatedData);
      this.tripStore.tabItems[updatedData.tabIndex] = updatedData.data;
      this.tripStore.refreshCoursePathByIndex(updatedData.tabIndex);
    } else if (message.type == 'remove-tab') {
      const index = parseInt(message.content);
      console.log('삭제한 탭 = ' + index);
      this.tripStore.removeTabFromServer(index);
    } else if (message.type == 'add-tab') {
      this.tripStore.addTabFromServer(this.matchId);
    }
  }

  async sendMessage(message) {
    if (this.isConnected && this.socket) {
      this.socket.send(JSON.stringify(message));

      // GPT 여행지 정보 호출
      if (message.content.startsWith('!여행지정보')) {
        const attractionName = message.content.substring('!여행지정보'.length).trim();
        const gptAnswer = 'gpt 답변';
        //const gptAnswer = await getAttractionRecommend(attractionName);
        // GPT답변 전송
        this.sendMessage({
          type: 'gpt-answer',
          username: 'Chat-GPT',
          content: gptAnswer,
          matchId: this.matchId,
        })
      }
    } else {
      console.warn('Cannot send message: WebSocket connection is not open.');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  setMatchId(matchId) {
    this.matchId = matchId;
  }

}

const chatApi = new ChatApi();
export default chatApi;
