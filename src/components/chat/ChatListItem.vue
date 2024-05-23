<script setup>
import { useAuthStore } from "@/stores/auth";

defineProps({
  chat: Object,
});

const authStore = useAuthStore();
</script>

<template>
  <div class="chat-list-item">
    <div class="chat-list-item-profile">
      <img :src="chat.profileImage"/>
    </div>
    <div style="width: 80%;">
      <div class="chat-list-item-name">
        {{ chat.username }}
      </div>
      <div class="chat-list-item-content">
        {{ chat.content }}
      </div>
      <div class="chat-list-item-time">
        {{ chat.time }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-list-item {
  display: flex;
  align-items: center;
  padding: 5px;
  max-width: 100%;
  min-height: 80px;
}

.chat-list-item-profile {
  position: relative;
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid var(--brand-color);
  background-color: white;
}

.chat-list-item-profile img {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 40px;
}

.chat-list-item-name {
  position: relative;
  left: 10px;
  font-size: 13px;
}

.chat-list-item-content {
  position: relative;
  font-size: 14px;
  top: 5px;
  left: 10px;
  width: 85%;
  min-height: 18px;
  border: 1px solid var(--brand-color);
  border-radius: 7px;
  padding: 7px;
}

.chat-list-item-time {
  font-size: 12px;
  width: 86%;
  text-align: end;
  margin: 5px;
}

</style>