<script setup>
defineProps({
  chat: Object,
});
</script>

<template>
  <div class="chat-notice-item">
    <p>
      {{ chat.content }}
    </p>
  </div>
</template>

<style scoped>
.chat-notice-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  max-width: 100%;
  min-height: 50px;
}

.chat-notice-item p {
  padding: 7px 10px;
  border-radius: 15px;
  background-color: var(--brand-color);
}
</style>