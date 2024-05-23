<script setup>
import { getMatchesByMemberId, removeMatchOfMember } from "@/api/match";
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "/src/api/http-common";

const http = Axios();

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const isActive = ref(false);
const chatListToggle = ref(false);
const chatList = ref([]);
const chatListElement = ref(null);
const profileImage = ref(authStore.getProfileImage);
const currentPath = ref(route.path);

const firstSegment = computed(() => {
  const path = route.path;
  const segments = path.split("/").filter(Boolean); // 빈 문자열 제거
  return segments[0] || ""; // 첫 번째 세그먼트가 없으면 빈 문자열 반환
});

onMounted(async () => {
  const memberId = authStore.getMemberId;
  if (memberId) {
    chatList.value = await getMatchesByMemberId(memberId);
    const profileResponse = await http.post("/member/profile", {
      memberId: authStore.getMemberId,
    });

    if (profileResponse.data) {
      profileImage.value = profileResponse.data;
      authStore.updateProfileImage(profileResponse.data); // 프로필 이미지 업데이트
    }
  }
});

const memberOption = () => {
  isActive.value = !isActive.value;
};

const chatListToggleHandler = async () => {
  const memberId = authStore.getMemberId;
  chatListToggle.value = !chatListToggle.value;
  if (chatListToggle.value) {
    chatList.value = await getMatchesByMemberId(memberId);
  }
};

const chatListClickHandler = () => {
  if (!authStore.isLogin) {
    alert("로그인 후 이용가능합니다.");
    return;
  }
  if (chatList.value.length == 0) {
    alert("현재 연결된 채팅이 없습니다.");
    return;
  }
  chatListToggleHandler();
};

const enterChatRoom = (matchId) => {
  router.push({ name: "chat", params: { matchId: matchId } });
};

const leaveMatching = async (matchId) => {
  if (!window.confirm("정말 해당 매칭에서 나가시겠습니까?")) return;
  const memberId = authStore.memberId;
  await removeMatchOfMember(memberId, matchId);
  chatList.value = chatList.value.filter((match) => match.matchId != matchId);
  if (route.params.matchId == matchId) {
    router.push({ name: "main" });
  }
};

const goToMyPage = (memberId) => {
  router.push({ name: "mypage", params: { memberId: memberId } });
};

const props = defineProps({
  background: String,
});

const menuClass = computed(() =>
  props.background == "white" ? "menu-white trip-menu" : "menu-white trip-menu"
);
const memberMenuClass = computed(() =>
  props.background == "white" ? "member-menu member-memu-white" : "member-menu member-memu-white"
);

const signout = async () => {
  try {
    authStore.signout();
    await http.post("/member/signout");
    isActive.value = false;
    alert("로그아웃이 완료되었습니다.");
    router.push("/");
    profileImage.value = "/src/assets/img/profileDefault.png";
  } catch (error) {
    console.error(error);
    isActive.value = false;
    alert("로그아웃에 실패하였습니다. 다시 시도해주세요.");
  }
};

watch(chatListToggle, async (newVal) => {
  if (newVal) {
    await nextTick();
    chatListElement.value.focus();
  }
});
</script>

<template>
  <header class="header-white">
    <div class="chat-list-bg" v-show="chatListToggle" @click="chatListClickHandler"></div>
    <div
      class="chat-list"
      v-show="chatListToggle"
      tabindex="0"
      @keyup.esc="chatListToggleHandler"
      ref="chatListElement"
    >
      <div class="chat-list-top">
        <h2>채팅 목록</h2>
      </div>
      <div class="chat-list-item-container" v-for="chat in chatList" :key="chat.matchId">
        <div class="chat-list-item">
          <div class="chat-list-item-title">
            <h3>{{ chat.matchTitle }}</h3>
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
    <div style="display: flex; align-items: center">
      <div id="trip-menu-container">
        <router-link
          :to="{ name: 'review' }"
          :class="menuClass + (firstSegment == 'review' ? ' trip-menu-selected' : '')"
          >여행 후기</router-link
        >
        <div
          id="mate-chat"
          :class="menuClass + (firstSegment == 'chat' ? ' trip-menu-selected' : '')"
          @click="chatListClickHandler"
        >
          메이트 채팅
        </div>
        <router-link
          :to="{ name: 'match' }"
          :class="menuClass + (firstSegment == 'match' ? ' trip-menu-selected' : '')"
          >여행 메이트 찾기</router-link
        >
        <router-link
          :to="{ name: 'plan' }"
          :class="menuClass + (firstSegment == 'plan' ? ' trip-menu-selected' : '')"
          >나만의 여행 계획</router-link
        >
      </div>
      <div id="profile">
        <img :src="profileImage" @click="memberOption" />
      </div>
      <div :class="memberMenuClass" v-show="isActive">
        <router-link v-if="!authStore.getMemberId" :to="{ name: 'member-signup' }"
          >회원가입</router-link
        >
        <router-link v-if="!authStore.getMemberId" :to="{ name: 'member-signin' }"
          >로그인</router-link
        >
        <a v-if="authStore.getMemberId" @click="() => goToMyPage(authStore.getMemberId)"
          >마이페이지</a
        >
        <a v-if="authStore.getMemberId" @click="signout" href="#">로그아웃</a>
      </div>
    </div>
  </header>
</template>

<style scoped>
#nav-logo {
  width: 150px;
  margin-left: 150px;
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
  background-color: #ffffff;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.19);
}

#trip-menu-container {
  display: flex;
  align-items: center;
  margin-right: 50px;
}

.trip-menu {
  text-decoration: none;
  font-weight: bold;
  color: white;
  padding: 15px;
  position: relative;
  font-size: 18px;
}

.menu-white {
  text-decoration: none;
  font-weight: bold;
  color: #444444;
}

.trip-menu::after {
  position: absolute;
  content: "";
  width: 0;
  height: 3px;
  bottom: 0;
  right: 0;
  z-index: -1;
  background: black;
  transition: all 0.3s ease;
  border-radius: 7px;
}

.trip-menu:hover::after {
  left: 0;
  width: 100%;
}

.trip-menu-selected::after {
  position: absolute;
  content: "";
  left: 0;
  width: 100%;
  height: 3px;
  bottom: 0;
  z-index: -1;
  background: black;
  transition: all 0.3s ease;
  border-radius: 7px;
}

#mate-chat {
  cursor: pointer;
}

#profile {
  width: 150px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#profile img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.2s;
}

#profile img:hover {
  transform: scale(120%);
}

.member-menu {
  position: absolute;
  background-color: rgba(125, 180, 220, 0.8);
  color: black;
  width: 200px;
  border-radius: 15px;
  top: 70px;
  right: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  z-index: 100000;
  padding: 15px;
}

.member-memu-white {
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 8px 8px rgba(0, 0, 0, 0.23);
}

.member-menu a {
  text-align: center;
  width: 100%;
  padding: 10px;
  font-weight: bold;
  border-radius: 5px;
  transition: 0.2s;
  cursor: pointer;
}

.member-menu a:hover {
  background-color: black;
  color: white;
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
  width: 450px;
  height: 600px;
  z-index: 100001;
  background-color: #ffffff;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.chat-list:focus {
  outline: none;
}

.chat-list-top {
  width: 100%;
  padding: 15px;
  background-color: #4a90e2;
  color: white;
}

.chat-list-top h2 {
  font-size: 25px;
  font-weight: 700;
  text-align: center;
  margin: 0;
}

.chat-list-item-container {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.chat-list-item {
  width: 90%;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.chat-list-item-title h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  margin-right: 30px;
  color: #333;
}

.chat-list-item-btn {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.chat-list-item-btn button {
  border: none;
  background-color: #4a90e2;
  color: white;
  border-radius: 5px;
  font-size: 14px;
  padding: 7px 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
  font-family: inherit;
}

.chat-list-item-btn button:hover {
  background-color: #357ab8;
}

.chat-list-item-btn button:last-child {
  background-color: #d9534f;
}

.chat-list-item-btn button:last-child:hover {
  background-color: #c9302c;
}
</style>
