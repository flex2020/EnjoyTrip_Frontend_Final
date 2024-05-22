// src/stores/auth.js
import { defineStore } from "pinia";

function base64DecodeUnicode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/'); // Base64 URL Safe 변환
  const pad = str.length % 4;
  if (pad) {
    if (pad === 1) {
      throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
    }
    str += new Array(5 - pad).join('=');
  }
  const binaryString = atob(str);
  const chars = [];
  for (let i = 0; i < binaryString.length; i++) {
    chars.push("%" + ("00" + binaryString.charCodeAt(i).toString(16)).slice(-2));
  }
  return decodeURIComponent(chars.join(""));
}


export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    email: null,
    nickname: null,
    memberId: null,
    profileImage: "/src/assets/img/profileDefault.png", // 프로필 이미지 추가
  }),

  getters: {
    isLogin: (state) => !!state.token,
    getEmail: (state) => state.email,
    getNickname: (state) => state.nickname,
    getMemberId: (state) => state.memberId,
    getProfileImage: (state) => state.profileImage, // 프로필 이미지 getter 추가
  },

  actions: {
    setToken(token) {
      this.token = token;
      const payload = JSON.parse(base64DecodeUnicode(token.split(".")[1]));
      console.log(payload);
      this.email = payload.email;
      this.nickname = payload.nickname;
      this.memberId = payload.memberId;
    },
    signout() {
      this.token = null;
      this.email = null;
      this.nickname = null;
      this.memberId = null;
      this.profileImage = "/src/assets/img/profileDefault.png"; // 로그아웃 시 프로필 이미지 초기화
    },
    updateNickname(newNickname) {
      this.nickname = newNickname;
    },
    updateProfileImage(newProfileImage) {
      // 프로필 이미지 업데이트 메소드 추가
      this.profileImage = newProfileImage;
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: "auth",
        storage: localStorage,
      },
    ],
  },
});
