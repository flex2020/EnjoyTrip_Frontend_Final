<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useKakaoStore } from '@/stores/kakao';
import { Axios } from "/src/api/http-common";

const http = Axios();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const kakaoStore = useKakaoStore();

const email = ref("");
const password = ref("");

const login = async () => {
  try {
    const response = await http.post("/api/member/signin", {
      email: email.value,
      password: password.value,
    });

    const token = response.data; // Assuming the token is in response.data.token

    if (token) {
      // Log the state
      authStore.setToken(token);

      console.log("isLogin:", authStore.isLogin);
      console.log("Email:", authStore.getEmail);
      console.log("Nickname:", authStore.getNickname);
      console.log("memberId:", authStore.getMemberId);

      const profileResponse = await http.post("/api/member/profile", {
        memberId: authStore.getMemberId,
      });

      if (profileResponse.data) {
        authStore.updateProfileImage(profileResponse.data); // 프로필 이미지 업데이트
      }

      alert("로그인에 성공하였습니다.");
      router.push("/");
    } else {
      throw new Error("로그인에 실패하였습니다. 다시 시도해주세요.");
    }
  } catch (error) {
    console.error(error);
    alert("로그인에 실패하였습니다. 다시 시도해주세요.");
  }
};

const kakaoLogin = () => {
  Kakao.Auth.login({
    success: async (authObj) => {
      try {
        // 카카오 SDK를 통해 얻은 액세스 토큰으로 사용자 정보 가져오기
        const userInfo = await Kakao.API.request({
          url: '/v2/user/me'
        });

        const response = await http.post("/member/oauth2/kakao", {
          email: userInfo.kakao_account.email,
          nickname: userInfo.kakao_account.profile.nickname
        });

        console.log(response.data);
        console.log(response.data.newUser);
        console.log(response.data.email);
        console.log(response.data.nickname);

        if (response.data.newUser) {

          kakaoStore.setEmail(response.data.email);
          kakaoStore.setNickname(response.data.nickname);
          router.push({ name: 'member-signup' });
        } else {
          // 기존 사용자 - 로그인 처리
          authStore.setToken(response.data);
          alert("카카오 로그인에 성공하였습니다.");
          router.push("/");
        }
      } catch (error) {
        console.error("카카오 로그인 중 오류 발생:", error);
        alert("카카오 로그인에 실패하였습니다. 다시 시도해주세요.");
      }
    },
    fail: (err) => {
      console.error("카카오 로그인 실패:", err);
      alert("카카오 로그인에 실패하였습니다. 다시 시도해주세요.");
    }
  });
};
</script>

<template>
  <div class="login-background">
    <div class="login-container">
      <img src="/src/assets/img/navlog.png" alt="logo" class="logo" />
      <h2>로그인</h2>
      <form @submit.prevent="login">
        <input type="email" v-model="email" placeholder="your@email.com" required />
        <input type="password" v-model="password" placeholder="********" required />
        <button type="submit">로그인</button>
      </form>
      <button @click="kakaoLogin" class="kakao-login-button">카카오 로그인</button>
      <div class="links">
        <router-link :to="{ name: 'member-signup' }">회원가입</router-link> |
        <router-link :to="{ name: 'member-findpassword' }">비밀번호 찾기</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-background {
  width: 100vw; /* Viewport width */
  height: 100vh; /* Viewport height */
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute; /* Absolute position */
  top: 0;
  left: 0;
}

.login-container {
  background: rgba(255, 255, 255, 0.8);
  padding: 3rem; /* Increased padding */
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 500px; /* Increased width */
  text-align: center;
}

.logo {
  width: 120px; /* Increased logo size */
  height: 60px;
  margin-bottom: 1.5rem;
}

h2 {
  margin-bottom: 2rem;
  font-weight: bold;
  font-size: 36px; /* Increased font size */
}

form input {
  width: 100%;
  padding: 1rem; /* Increased padding */
  margin-bottom: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-weight: bold;
  font-size: 18px; /* Increased font size */
}

form button {
  width: 100%;
  padding: 0.75rem; /* Increased padding */
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 20px; /* Increased font size */
}

form button:hover {
  background-color: #444;
}

.kakao-login-button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background-color: #F7E600;
  color: #3C1E1E;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 20px;
}

.kakao-login-button:hover {
  background-color: #E5D600;
}

.links {
  margin-top: 1.5rem;
}

.links a {
  color: rgba(0, 0, 0, 0.3);
  text-decoration: none;
  margin: 0 0.5rem;
  font-weight: bold;
  font-size: 16px; /* Increased font size */
}

.links a:hover {
  color: rgba(0, 0, 0, 1);
  text-decoration: underline;
}
</style>
