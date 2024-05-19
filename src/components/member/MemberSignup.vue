<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Axios } from '/src/api/http-common';

const http = Axios();
const router = useRouter();

const email = ref('');
const nickname = ref('');
const verificationCode = ref('');
const memberName = ref('');
const birthday = ref('');
const password = ref('');
const confirmPassword = ref('');
const mbti = ref('');
const gender = ref('');
const intro = ref('');
const phoneNumber = ref('');
const emailVerifyCode = ref('');
const verificationCodeSent = ref(false);
const verificationCodeValid = ref(false);
const countdown = ref(0);
const countdownInterval = ref(null);
const verificationError = ref('');
const phoneError = ref('');
const passwordError = ref('');

const generateRandomString = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const startCountdown = () => {
  countdown.value = 300;
  countdownInterval.value = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(countdownInterval.value);
      verificationCodeSent.value = false;
      verificationCode.value = '';
      verificationError.value = '';
      emailVerifyCode.value = '';
    }
  }, 1000);
};

const sendEmailVerification = async () => {
  try {
    await http.get(`/email/signup/auth/send?email=${email.value}`);
    verificationCodeSent.value = true;
    verificationError.value = '';
    startCountdown();
  } catch (error) {
    console.error(error);
    alert('인증 번호 전송에 실패했습니다. 다시 시도해주세요.');
  }
};

const verifyEmailCode = async () => {
  console.log("하하");
  try {
    const response = await http.post('/email/signup/verify', { email: email.value, code: verificationCode.value });
    if (response.status === 200) {
      verificationCodeValid.value = true;
      emailVerifyCode.value = verificationCode.value;
      clearInterval(countdownInterval.value);

      // Disable the input fields and buttons
      verificationCodeSent.value = true; // Keeps email input and send button disabled
      verificationCode.value = verificationCode.value; // Keeps verification code input value
      countdown.value = 0; // Clear countdown display

      alert('이메일 인증에 성공했습니다.');
    }
  } catch (error) {
    verificationError.value = '유효하지 않거나 만료된 인증 코드입니다.';
    console.error(error);
  }
};

const validatePhoneNumber = () => {
  const phonePattern = /^\d{3}-\d{3,4}-\d{4}$/;
  if (!phonePattern.test(phoneNumber.value)) {
    phoneError.value = '올바른 핸드폰 번호를 입력해주세요.';
  } else {
    phoneError.value = '';
  }
};

const validatePassword = () => {
  if (password.value !== confirmPassword.value) {
    passwordError.value = '비밀번호가 일치하지 않습니다.';
  } else {
    passwordError.value = '';
  }
};

const formatPhoneNumber = () => {
  let input = phoneNumber.value.replace(/\D/g, '');
  if (input.length > 3 && input.length <= 7) {
    input = `${input.slice(0, 3)}-${input.slice(3)}`;
  } else if (input.length > 7) {
    input = `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(7, 11)}`;
  }
  phoneNumber.value = input;
};

const selectGender = (value) => {
  gender.value = value;
  console.log(gender.value);
};

const register = async () => {
  if (password.value !== confirmPassword.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }
  if (phoneError.value) {
    alert('올바른 핸드폰 번호를 입력해주세요.');
    return;
  }

  try {
    const registrationData = {
      email: email.value,
      nickname: nickname.value,
      memberName: memberName.value,
      birthday: birthday.value,
      password: password.value,
      mbti: mbti.value,
      gender: gender.value,
      phoneNumber: phoneNumber.value,
      intro: intro.value,
      emailVerifyCode: emailVerifyCode.value,
    };
    
    const response = await http.post('/member/signup', registrationData);
    alert('회원가입이 완료되었습니다.');
    router.push('/');
  } catch (error) {
    console.error(error);
    alert('회원가입에 실패했습니다. 다시 시도해주세요.');
  }
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
              <div class="inline-input">
                <input type="email" id="email" v-model="email" required :disabled="verificationCodeSent && verificationCodeValid">
                <button type="button" @click="sendEmailVerification" :disabled="verificationCodeSent && verificationCodeValid">{{ verificationCodeSent ? '인증번호 재발송' : '인증번호 발송' }}</button>
              </div>
            </div>
            <div class="form-group">
              <label for="verificationCode">인증번호 *</label>
              <div class="inline-input">
                <input type="text" id="verificationCode" v-model="verificationCode" :disabled="!verificationCodeSent || verificationCodeValid">
                <button type="button" @click="verifyEmailCode" :disabled="!countdown || verificationCodeValid">인증</button>
                <div v-if="countdown > 0" class="countdown">{{ Math.floor(countdown / 60) }}:{{ ('0' + (countdown % 60)).slice(-2) }}</div>
              </div>
              <div v-if="verificationError" class="error">{{ verificationError }}</div>
            </div>
            <div class="form-group">
              <label for="memberName">이름 *</label>
              <input type="text" id="memberName" v-model="memberName" required>
            </div>
            <div class="form-group">
              <label for="birthday">생년월일 *</label>
              <input type="date" id="birthday" v-model="birthday" required>
            </div>
            <div class="form-group">
              <label for="password">비밀번호 *</label>
              <input type="password" id="password" v-model="password" required>
            </div>
            <div class="form-group">
              <label for="confirmPassword">비밀번호 확인 *</label>
              <input type="password" id="confirmPassword" v-model="confirmPassword" @blur="validatePassword" required>
              <div v-if="passwordError" class="error">{{ passwordError }}</div>
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
              <label>성별 *</label>
                <div class="gender-buttons">
                  <button type="button" @click="selectGender(1)" :class="{ selected: gender === 1 }">남</button>
                  <button type="button" @click="selectGender(0)" :class="{ selected: gender === 0 }">여</button>
                </div>
            </div>
            <div class="form-group">
              <label for="phoneNumber">핸드폰 *</label>
              <input type="tel" id="phoneNumber" v-model="phoneNumber" @input="formatPhoneNumber" @blur="validatePhoneNumber" required>
              <div v-if="phoneError" class="error">{{ phoneError }}</div>
            </div>
            <div class="form-group">
              <label for="intro">자기소개</label>
              <textarea id="intro" v-model="intro"></textarea>
            </div>
          </div>
        </div>
        <button type="submit" :disabled="!verificationCodeValid">회원가입</button>
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
  width: 1000px; /* Increased width for the signup form */
  max-width: 90%;
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
  position: relative; /* Added for positioning countdown */
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
  font-family: inherit; /* Ensure consistent font family */
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
  font-family: inherit; /* Ensure consistent font family */
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

.gender-buttons {
  display: flex;
  justify-content: space-around;
}

.gender-buttons button {
  flex: 1;
  padding: 0.75rem;
  margin: 0 0.5rem;
  background-color: #fff;
  color: #000;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  font-family: inherit; /* Ensure consistent font family */
  transition: background-color 0.3s, color 0.3s; /* Smooth transition for background and color */
}

.gender-buttons button.selected {
  background-color: #000; /* Change to a dark color to show selected state */
  color: #fff;
}

.gender-buttons button:hover:not(.selected) {
  background-color: #000; /* Change to a lighter color for hover state when not selected */
  color: #fff;
}

.form-container {
  display: flex;
  flex-direction: column;
}

.form-input-container {
  display: flex;
  width: 100%;
}

.form-left {
  margin-right: 25px;
}

.form-right {
  margin-left: 25px;
}

.countdown {
  color: red;
  font-weight: bold;
  position: absolute;
  right: 10px; /* Adjust as needed to position properly */
  bottom: -25px; /* Adjust as needed to position properly */
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 0.5rem;
}
</style>
