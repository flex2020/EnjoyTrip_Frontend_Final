<script setup>

</script>

<template>
  <div class="chat-list-item">
    <div class="chat-list-item-profile">
      <img src="/src/assets/img/sample_img.jpg"/>
    </div>
    <div style="width: 100%;">
      <div class="chat-list-item-name">
        닉네임
      </div>
      <div class="chat-list-item-content">
        채팅 내용 채팅 내용
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-list-item {
  display: flex;
  align-items: center;
  padding: 5px;
  width: 75%;
  min-height: 80px;
}

.chat-list-item-profile {
  position: absolute;
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid black;
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
  left: 50px;
  font-size: 13px;
}

.chat-list-item-content {
  position: relative;
  font-size: 14px;
  top: 5px;
  left: 50px;
  width: 85%;
  min-height: 18px;
  border: 1px solid var(--brand-color);
  border-radius: 7px;
  padding: 3px;
}

</style>