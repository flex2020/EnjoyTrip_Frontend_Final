<script setup>
import { getMatchesByMemberId, removeMatchOfMember } from "@/api/match";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from '@/stores/auth';
import { Axios } from '/src/api/http-common';

const http = Axios();
const router = useRouter();
const authStore = useAuthStore();
const isActive = ref(false);
const chatListToggle = ref(false);
const chatList = ref([]);

onMounted(async () => {
  chatList.value = await getMatchesByMemberId(1);
});

const memberOption = () => {
  isActive.value = !isActive.value;
};

const chatListToggleHandler = () => {
  if (chatList.value.length == 0) {
    alert('현재 연결된 채팅이 없습니다.');
    return;
  }
  chatListToggle.value = !chatListToggle.value;
}

const enterChatRoom = (matchId) => {
  router.push({name: 'chat', params: {matchId: matchId}})
}

const leaveMatching = async (matchId) => {
  if (!window.confirm('정말 해당 매칭에서 나가시겠습니까?')) return;
  await removeMatchOfMember(1, matchId);
  chatList.value = chatList.value.filter((match) => match.matchId != matchId);
}

const props = defineProps({
  background: String,
});



const menuClass = computed(() => (props.background == "white" ? "menu-white" : "menu"));

const signout = async () => {
  try {
    // pinia에 있던 토큰 파기
    authStore.signout();

        // Log the state
    console.log('isLogin:', authStore.isLogin);
    console.log('Email:', authStore.getEmail);
    console.log('Nickname:', authStore.getNickname);

    // signout api 호출
    await http.post('/member/signout');

    // Redirect to the main page
    alert('로그아웃이 완료되었습니다.');
    router.push('/');
  } catch (error) {
    console.error(error);
    alert('로그아웃에 실패하였습니다. 다시 시도해주세요.');
  }
};

</script>

<template>
  <header :class="background == 'white' ? 'header-white' : ''">
    <div class="chat-list-bg" v-show="chatListToggle" @click="chatListToggleHandler">
    </div>
    <div class="chat-list" v-show="chatListToggle">
        <div class="chat-list-top">
          <h2>채팅 목록</h2>
        </div>
        <div class="chat-list-item-container" v-for="chat in chatList" :key="chat.matchId">
          <div class="chat-list-item">
            <div class="chat-list-item-title">
              <h2>{{ chat.matchTitle }}</h2>
            </div>
            <div class="chat-list-item-btn">
              <button @click="enterChatRoom(chat.matchId)">입장</button>
              <button @click="leaveMatching(chat.matchId)">나가기</button>
            </div>
          </div>
        </div>
      </div>
    <router-link :to="{ name: 'main' }" id="nav-logo">
      <img src="/src/assets/img/navlog.png" />
    </router-link>
    <div id="trip-menu-container">
      <router-link :to="{ name: 'review' }" :class="menuClass" class="trip-menu"
        >여행 후기</router-link
      >
      <div id="mate-chat"
        :class="menuClass"
        class="trip-menu"
        @click="chatListToggleHandler"
        >메이트 채팅</div
      >
      <router-link :to="{ name: 'match' }" :class="menuClass" class="trip-menu"
        >여행 메이트 찾기</router-link
      >
      <router-link :to="{ name: 'plan' }" :class="menuClass" class="trip-menu"
        >나만의 여행 계획</router-link
      >
      <div :class="menuClass" class="trip-menu" id="profile" @click="memberOption">
        <img src="/src/assets/img/profileEX.png" />
      </div>
    </div>
  </header>
  <div id="member-menu-container" v-show="isActive">
    <router-link :to="{ name: 'member-signup' }">회원가입</router-link>
    <router-link :to="{ name: 'member-signin' }">로그인</router-link>
    <a @click="signout" href="#">로그아웃</a>
    <router-link :to="{ name: 'member-mypage' }">마이페이지</router-link>
  </div>
</template>

<style scoped>
#nav-logo {
  width: 100px;
  height: 60px;
  margin-left: 50px;
}

#nav-logo img {
  width: 100%;
  height: 100%;
}

header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  position: fixed;
  z-index: 100000;
}

.header-white {
  background-color: white;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.19);
}

#trip-menu-container {
  display: flex;
  align-items: center;
  margin-right: 50px;
}

.trip-menu {
  margin-left: 15px;
  text-decoration: none;
  font-weight: bold;
  color: white;
}

#mate-chat {
  cursor: pointer;
}

.menu-white {
  margin-left: 15px;
  text-decoration: none;
  font-weight: bold;
  color: black;
}

#profile {
  width: 70px;
  height: 70px;
}

#profile img {
  width: 100%;
  height: 100%;
}

#member-menu-container {
  position: fixed;
  background-color: rgba(125, 180, 220, 0.8);
  color: black;
  width: 200px;
  height: 300px;
  border-radius: 15px;
  top: 100px;
  right: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  z-index: 100000;
}

#member-menu-container a {
  text-align: center;
  width: 100px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  padding-bottom: 10px;
  font-weight: bold;
}

.chat-list-bg {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100vh;
  background-color: #00000088;
  z-index: 100001;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chat-list {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 25%);
  width: 400px;
  height: 600px;
  z-index: 100001;
  background-color: rgba(240, 248, 255, 0.85);
  border-radius: 15px;;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chat-list-top {
  width: 100%;
  padding: 15px;
  border-bottom: 1px solid var(--brand-color);
}

.chat-list-top h2 {
  font-size: 25px;
  font-weight: 700;
  text-align: center;
}

.chat-list-item-container {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid black;
}

.chat-list-item {
  width: 100%;
  padding: 10px;
  display: flex;
}

.chat-list-item {
  font-size: 20px;
  font-weight: 600;
}

.chat-list-item-title {
  width: 60%;
  display: flex;
  align-items: center;
}

.chat-list-item-btn {
  width: 40%;
}
.chat-list-item-btn button {
  margin-right: 5px;
  border: 5px;
  background-color: white;
  border-radius: 15px;
  font-size: 18px;
  padding: 2px 10px;
  cursor: pointer;
  transition: 0.2s;
}

.chat-list-item-btn button:first-child {
  color: var(--brand-color);
  border: 1px solid var(--brand-color);
}

.chat-list-item-btn button:first-child:hover {
  background-color: var(--brand-color);
  color: white;
}

.chat-list-item-btn button:last-child {
  color: rgb(220, 35, 35);
  border: 1px solid rgb(220, 35, 35);;
}

.chat-list-item-btn button:last-child:hover {
  background-color: rgb(220, 35, 35);
  color: white;
}
</style>
