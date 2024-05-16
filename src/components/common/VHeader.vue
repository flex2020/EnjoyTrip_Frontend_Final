<script setup>
import { computed } from "vue";
const props = defineProps({
  background: String,
});

const menuClass = computed(() => props.background == 'white' ? 'menu-white' : 'menu');
</script>

<template>
  <header :class="background == 'white' ? 'header-white' : ''">
    <router-link :to="{ name: 'main' }" id="nav-logo">
      <img src="/src/assets/img/navlog.png" />
    </router-link>
    <div id="menu-box">
      <router-link :to="{ name: 'review' }" :class="menuClass">여행 후기</router-link>
      <router-link :to="{ name: 'chat' }" :class="menuClass">메이트 채팅</router-link>
      <router-link :to="{ name: 'match' }" :class="menuClass">여행 메이트 찾기</router-link>
      <router-link :to="{ name: 'plan' }" :class="menuClass">나만의 여행 계획</router-link>
      <div :class="menuClass" id="profile">
        <img src="/src/assets/img/profileEX.png" />
      </div>
    </div>
  </header>
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

#menu-box {
  display: flex;
  align-items: center;
  margin-right: 50px;
}

.menu {
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
</style>
