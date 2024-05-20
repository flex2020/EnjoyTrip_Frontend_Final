import { defineStore } from 'pinia';

function base64DecodeUnicode(str) {
  // Decode base64
  const binaryString = atob(str);
  // Convert binary string to UTF-8 string
  const chars = [];
  for (let i = 0; i < binaryString.length; i++) {
    chars.push('%' + ('00' + binaryString.charCodeAt(i).toString(16)).slice(-2));
  }
  return decodeURIComponent(chars.join(''));
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    email: null,
    nickname: null,
  }),

  getters: {
    isLogin: (state) => !!state.token,
    getEmail: (state) => state.email,
    getNickname: (state) => state.nickname,
  },
  
  actions: {
    setToken(token) {
      this.token = token;
      // Assuming token is a JWT and contains email and nickname
      const payload = JSON.parse(base64DecodeUnicode(token.split('.')[1]));
      this.email = payload.email;
      this.nickname = payload.nickname;
    },
    signout() {
      this.token = null;
      this.email = null;
      this.nickname = null;
    },
  },
});