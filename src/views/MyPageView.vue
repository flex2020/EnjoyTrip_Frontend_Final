<script>
import MyProfile from "@/components/mypage/MyProfile.vue";
import MyCourses from "@/components/mypage/MyCourses.vue";
import MyMatches from "@/components/mypage/MyMatches.vue";
import MyReviews from "@/components/mypage/MyReviews.vue";
import VHeader from "@/components/common/VHeader.vue"; // VHeader import

export default {
  data() {
    return {
      activeTab: "profile",
      hoverTab: null,
    };
  },
  computed: {
    activeTabComponent() {
      switch (this.activeTab) {
        case "profile":
          return MyProfile;
        case "courses":
          return MyCourses;
        case "matches":
          return MyMatches;
        case "reviews":
          return MyReviews;
      }
    },
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    setHoverTab(tab) {
      this.hoverTab = tab;
    },
  },
};
</script>

<template>
  <VHeader></VHeader>
  <div class="background">
    <transition name="fade">
      <div class="profile-container">
        <div class="left-container">
          <div class="profile-sidebar">
            <img src="/src/assets/img/profileEX.png" alt="Profile Picture" class="profile-pic" />
            <h1>ooo님의 페이지</h1>
            <p>팔로워 3명 | 팔로잉 7명</p>
            <button class="follow-button">팔로잉</button>
          </div>
          <div class="tab-container">
            <nav>
              <ul>
                <li
                  :class="{ active: activeTab === 'profile', hover: hoverTab === 'profile' }"
                  @click="setActiveTab('profile')"
                  @mouseenter="setHoverTab('profile')"
                  @mouseleave="setHoverTab(null)"
                >
                  개인정보 수정
                </li>
                <li
                  :class="{ active: activeTab === 'courses', hover: hoverTab === 'courses' }"
                  @click="setActiveTab('courses')"
                  @mouseenter="setHoverTab('courses')"
                  @mouseleave="setHoverTab(null)"
                >
                  내 여행 코스
                </li>
                <li
                  :class="{ active: activeTab === 'matches', hover: hoverTab === 'matches' }"
                  @click="setActiveTab('matches')"
                  @mouseenter="setHoverTab('matches')"
                  @mouseleave="setHoverTab(null)"
                >
                  매칭 게시물 목록
                </li>
                <li
                  :class="{ active: activeTab === 'reviews', hover: hoverTab === 'reviews' }"
                  @click="setActiveTab('reviews')"
                  @mouseenter="setHoverTab('reviews')"
                  @mouseleave="setHoverTab(null)"
                >
                  여행 후기 목록
                </li>
                <li
                  :class="{ active: activeTab === 'signout', hover: hoverTab === 'signout' }"
                  @click="setActiveTab('signout')"
                  @mouseenter="setHoverTab('signout')"
                  @mouseleave="setHoverTab(null)"
                >
                  회원 탈퇴
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div class="content-container">
          <component :is="activeTabComponent"></component>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("/src/assets/img/mainpage.png");
  background-size: cover;
  background-position: center;
  position: relative;
}

.background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.15);
  z-index: 1;
}

.profile-container {
  display: flex;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  height: 80%;
  max-width: 1200px;
  position: relative;
  z-index: 2;
}

.left-container {
  width: 35%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-sidebar,
.tab-container,
.content-container {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.tab-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.tab-container nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
}

.tab-container nav ul li {
  position: relative;
  padding: 15px;
  cursor: pointer;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
  font-size: 18px;
}

.tab-container nav ul li:last-child {
  border-bottom: none;
}

.tab-container nav ul li::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  background-color: #000;
  border-radius: 5px;
  z-index: -1;
  transition: height 0.3s ease;
}

.tab-container nav ul li.active::before,
.tab-container nav ul li.hover::before {
  height: 100%;
}

.tab-container nav ul li:hover,
.tab-container nav ul li.active {
  color: #fff;
}

.content-container {
  width: 65%;
  margin-left: 20px;
}

.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.follow-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}
</style>
