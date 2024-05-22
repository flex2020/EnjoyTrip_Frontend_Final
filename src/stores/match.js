import { defineStore } from 'pinia';

export const useMatchStore = defineStore('match', {
  state: () => ({
    hashtag: ''
  }),
  actions: {
    setHashtag(hashtag) {
      this.hashtag = hashtag;
    },
    clearHashtag() {
        this.hashtag = '';
    }
  }
});