<script setup>
import { ref, computed } from "vue";

const isActive = ref(false);
const memberOption = () => {
  isActive.value = !isActive.value;
};

const props = defineProps({
  background: String,
});

const menuClass = computed(() => (props.background == "white" ? "menu-white" : "menu"));
</script>

<template>
  <header :class="background == 'white' ? 'header-white' : ''">
    <router-link :to="{ name: 'main' }" id="nav-logo">
      <img src="/src/assets/img/navlog.png" />
    </router-link>
    <div id="trip-menu-container">
      <router-link :to="{ name: 'review' }" :class="menuClass" class="trip-menu"
        >여행 후기</router-link
      >
      <router-link :to="{ name: 'chat' }" :class="menuClass" class="trip-menu"
        >메이트 채팅</router-link
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
    <div>회원가입</div>
    <div>로그인</div>
    <div>로그아웃</div>
    <div>마이페이지</div>
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
  z-index: 10;
}

.header-white {
  background-color: white;
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
  position: absolute;
  background-color: rgba(255, 255, 255, 0.6);
  width: 200px;
  height: 300px;
  border-radius: 15px;
  top: 100px;
  right: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

#member-menu-container div {
  text-align: center;
  width: 100px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  padding-bottom: 10px;
  font-weight: bold;
}
</style>
