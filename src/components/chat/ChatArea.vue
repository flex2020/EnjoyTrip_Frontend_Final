<script setup>
import { ref } from "vue";
import ChatToggleButton from "@/components/chat/ChatToggleButton.vue";


const chatToggle = ref(false);

const toggleClick = () => {
  chatToggle.value = !chatToggle.value;
  console.log(chatToggle.value)
}

</script>

<template>
  <div :class="'chat-area ' + (chatToggle ? 'chat-area-on' : 'chat-area-off')">
    <ChatToggleButton @click="toggleClick" :toggle="chatToggle"/>
  </div>
</template>

<style scoped>
.chat-area {
  position: absolute;
  top: 80px;
  height: calc(100vh - 80px);
  width: 350px;
  background-color: red;
  z-index: 10;
  transition: 0.2s;
}
.chat-area-off {
  left: -350px;
}

.chat-area-on {
  left: 0px;
}
</style>