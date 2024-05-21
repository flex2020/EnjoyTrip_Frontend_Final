import { defineStore } from 'pinia';

export const useKakaoStore = defineStore('kakao', {
  state: () => ({
    email: '',
    nickname: ''
  }),
  actions: {
    setEmail(email) {
      this.email = email;
    },
    setNickname(nickname) {
      this.nickname = nickname;
    },
    clearEmail() {
        this.email = '';
    },
    clearNickname() {
        this.nickname = '';
    }
  }
});