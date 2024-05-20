<script setup>
import { ref, defineProps, defineEmits } from 'vue';

// Props 정의
const props = defineProps({
  activeTab: {
    type: String,
    required: true
  }
});

const hoverTab = ref(null);

const setHoverTab = (tab) => {
  hoverTab.value = tab;
};

const tabs = [
  { name: 'profile', label: '회원정보 조회' },
  { name: 'profileUpdate', label: '회원정보 수정' },
  { name: 'matches', label: '매칭 게시물 목록' },
  { name: 'reviews', label: '여행 후기 목록' },
  { name: 'withdraw', label: '회원 탈퇴' },
];

const emit = defineEmits(['update-active-tab', 'open-modal']);
</script>

<template>
  <div class="tab-container">
    <nav>
      <ul>
        <li
          v-for="tab in tabs"
          :key="tab.name"
          :class="{ active: props.activeTab === tab.name, hover: hoverTab === tab.name }"
          @mouseenter="setHoverTab(tab.name)"
          @mouseleave="setHoverTab(null)"
          @click="tab.name === 'withdraw' ? emit('open-modal') : emit('update-active-tab', tab.name)"
        >
          {{ tab.label }}
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.tab-container {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
}

.tab-container nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  height: 100%;
}

.tab-container nav ul li {
  padding: 15px;
  cursor: pointer;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 10px;
  transition: background-color 0.3s, color 0.3s;
  font-size: 18px;
  text-align: center;
  color: #000;
}

.tab-container nav ul li:last-child {
  border-bottom: none;
}

.tab-container nav ul li.active,
.tab-container nav ul li.hover {
  background-color: #000;
  color: #fff;
}
</style>
