<script setup>
import { ref } from 'vue';

const email = ref('');
const nickname = ref('');
const verificationCode = ref('');
const name = ref('');
const birthdate = ref('');
const password = ref('');
const confirmPassword = ref('');
const mbti = ref('');
const gender = ref('');
const selfDescription = ref('');
const phone = ref('');

const register = () => {
  // Handle registration logic here
  console.log('Registering with:', {
    email: email.value,
    nickname: nickname.value,
    verificationCode: verificationCode.value,
    name: name.value,
    birthdate: birthdate.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    mbti: mbti.value,
    gender: gender.value,
    selfDescription: selfDescription.value,
    phone: phone.value,
  });
};
</script>

<template>
  <div class="signup-background">
    <div class="signup-container">
      <img src="/src/assets/img/navlog.png" alt="logo" class="logo">
      <h2>회원가입</h2>
      <form class="form-container" @submit.prevent="register">
        <div class="form-input-container">
        <div class="form-left">
          <div class="form-group">
            <label for="email">이메일 *</label>
            <input type="email" id="email" v-model="email" required>
          </div>
          <div class="form-group">
            <label for="verificationCode">인증번호 *</label>
            <div class="inline-input">
              <input type="text" id="verificationCode" v-model="verificationCode" required>
              <button type="button">인증</button>
            </div>
          </div>
          <div class="form-group">
            <label for="name">이름 *</label>
            <input type="text" id="name" v-model="name" required>
          </div>
          <div class="form-group">
            <label for="birthdate">생년월일 *</label>
            <input type="date" id="birthdate" v-model="birthdate" required>
          </div>
          <div class="form-group">
            <label for="password">비밀번호 *</label>
            <input type="password" id="password" v-model="password" required>
          </div>
          <div class="form-group">
            <label for="confirmPassword">비밀번호 확인 *</label>
            <input type="password" id="confirmPassword" v-model="confirmPassword" required>
          </div>
        </div>
        <div class="form-right">
          <div class="form-group">
            <label for="nickname">닉네임 *</label>
            <div class="inline-input">
              <input type="text" id="nickname" v-model="nickname" required>
              <button type="button">자동생성</button>
            </div>
          </div>
          <div class="form-group">
            <label for="mbti">MBTI</label>
            <input type="text" id="mbti" v-model="mbti">
          </div>
          <div class="form-group">
            <label for="gender">성별 *</label>
            <input type="text" id="gender" v-model="gender" required>
          </div>
          <div class="form-group">
            <label for="phone">핸드폰 *</label>
            <input type="tel" id="phone" v-model="phone" required>
          </div>
          <div class="form-group">
            <label for="selfDescription">자기소개</label>
            <textarea id="selfDescription" v-model="selfDescription"></textarea>
          </div>
        </div>
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.signup-background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('/src/assets/background.jpg'); /* Replace with the path to your background image */
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
}

.signup-container {
  background: rgba(255, 255, 255, 0.8);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 900px; /* Increased width for the signup form */
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 120px;
  height: 60px;
  margin-bottom: 1.5rem;
}

h2 {
  margin-bottom: 1.5rem;
  font-weight: bold;
  font-size: 36px;
}

form {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.form-left, .form-right {
  width: 48%; /* Two equal columns */
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.inline-input {
  display: flex;
  align-items: center;
}

.inline-input input {
  flex: 1;
  margin-right: 0.5rem; /* Space between input and button */
}

.inline-input button {
  flex-shrink: 0; /* Prevent button from shrinking */
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 18px;
}

button[type="button"],
button[type="submit"] {
  padding: 0.75rem 1rem;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
}

button[type="button"]:hover,
button[type="submit"]:hover {
  background-color: #444;
}

button[type="submit"] {
  width: 100%;
  margin-top: 1.5rem;
  font-size: 20px; /* Increased font size */
}

.form-container {
    display: flex;
    flex-direction: column;
}

.form-input-container {
    display: flex;
}

.form-left {
    margin-right: 25px;
}

.form-right {
    margin-left: 25px;
}
</style>
