<template>
  <div class="user-profile">
    <h2>개인정보 수정</h2>
    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="name">이름</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div class="form-group">
        <label for="email">이메일</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="phone">전화번호</label>
        <input type="tel" id="phone" v-model="phone" required />
      </div>
      <button type="submit">업데이트</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const name = ref("홍길동");
const email = ref("hong@example.com");
const phone = ref("010-1234-5678");

const updateProfile = () => {
  console.log("Updating profile...");
  // Profile update logic here
};
</script>

<style scoped>
.user-profile {
  max-width: 600px;
  margin: auto;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 0.75rem 1.5rem;
  background-color: #3b5998;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #2d4373;
}
</style>
