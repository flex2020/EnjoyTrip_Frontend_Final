import { useChatStore } from "@/stores/chat";
import { useTripStore } from "@/stores/trip";
class ChatApi {
  
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.type = '';
    this.username = '';
    this.content = '';
    this.matchId = -1;
    this.userIdx = -1;
    this.chatStore = null;
    this.tripStore = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket('ws://localhost:8080/chat');

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
    if (message.type == 'chat' || message.type == 'notice') {
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

  sendMessage(message) {
    if (this.isConnected && this.socket) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send message: WebSocket connection is not open.');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  setType(type) {
    this.type = type;
  }

  setUsername(username) {
    this.username = username;
  }

  setContent(content) {
    this.content = content;
  }

  setMatchId(matchId) {
    this.matchId = matchId;
  }

  setUserIdx(userIdx) {
    this.userIdx = userIdx;
  }

  sendChat() {
    const message = {
      type: this.type,
      username: this.username,
      content: this.content,
      matchId: this.matchId
    };
    console.log(message);
    this.sendMessage(message);
  }
}

const chatApi = new ChatApi();
export default chatApi;
