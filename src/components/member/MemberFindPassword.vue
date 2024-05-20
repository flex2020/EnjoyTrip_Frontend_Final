<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Axios } from "/src/api/http-common";

const http = Axios();
const router = useRouter();

const name = ref("");
const email = ref("");
const verificationCode = ref("");
const showVerification = ref(false);
const verificationAttempts = ref(0);
const errorMessage = ref("");

const sendVerificationCode = async () => {
  try {
    const response = await http.post("/member/findpassword", {
      name: name.value,
      email: email.value,
    });
    console.log(response.status);
    if (response.data) {
      await http.get(`/email/findpassword/auth/send?email=${email.value}`);
      showVerification.value = true;
      errorMessage.value = "";
    } else {
      errorMessage.value = "일치하는 계정이 존재하지 않습니다.";
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = "계정 검증에 실패했습니다. 다시 시도해주세요.";
  }
};

const verifyCode = async () => {
  try {
    const response = await http.post("/email/findpassword/verify", {
      email: email.value,
      code: verificationCode.value,
    });
    console.log(response);
    if (response.data) {
      router.push({ name: "member-resetpassword", query: { email: email.value } });
      errorMessage.value = "";
    } else {
      verificationAttempts.value++;
      if (verificationAttempts.value >= 5) {
        errorMessage.value = "인증번호 검증에 5회 실패했습니다. 다시 시도해주세요.";
        showVerification.value = false;
        verificationAttempts.value = 0;
        verificationCode.value = "";
      } else {
        errorMessage.value = "인증번호가 일치하지 않습니다.";
      }
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = "인증번호 검증에 실패했습니다. 다시 시도해주세요.";
  }
};
</script>

<template>
  <div class="forgot-password-background">
    <div class="forgot-password-container">
      <img src="/src/assets/img/navlog.png" alt="logo" class="logo" />
      <h2>비밀번호 재설정</h2>
      <form @submit.prevent="sendVerificationCode" v-if="!showVerification">
        <div class="form-group">
          <label for="name">이름</label>
          <input type="text" id="name" v-model="name" required />
        </div>
        <div class="form-group">
          <label for="email">이메일</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <button type="submit">인증번호 발송</button>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      </form>
      <form @submit.prevent="verifyCode" v-if="showVerification">
        <div class="form-group">
          <label for="verificationCode">인증번호</label>
          <input type="text" id="verificationCode" v-model="verificationCode" required />
        </div>
        <button type="submit">인증하기</button>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.forgot-password-background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("/src/assets/background.jpg"); /* Replace with the path to your background image */
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
}

.forgot-password-container {
  background: rgba(255, 255, 255, 0.8);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 400px; /* 적당한 너비 설정 */
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
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 18px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
}

button:hover {
  background-color: #444;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 0.5rem;
}
</style>
