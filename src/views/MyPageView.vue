<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "/src/api/http-common";
import VHeader from "@/components/common/VHeader.vue";
import MyProfile from "@/components/mypage/MyProfile.vue";
import MyProfileUpdate from "@/components/mypage/MyProfileUpdate.vue";
import MyCourses from "@/components/mypage/MyCourses.vue";
import MyMatches from "@/components/mypage/MyMatches.vue";
import MyReviews from "@/components/mypage/MyReviews.vue";

const http = Axios();
const authStore = useAuthStore();

// 데이터 정의
const hoverTab = ref(null);
const activeTab = ref("profile"); // 기본 활성 탭 설정
const nickname = ref("사용자"); // 예시 닉네임
const followers = ref(0); // 예시 팔로워 수
const following = ref(0); // 예시 팔로잉 수
const posts = ref(0); // 예시 게시글 수

// 컴포넌트 맵
const componentsMap = {
  profile: MyProfile,
  profileUpdate: MyProfileUpdate,
  courses: MyCourses,
  matches: MyMatches,
  reviews: MyReviews,
};

// API 호출 메소드
const fetchUserData = async () => {
  try {
    const followerCount = await http.post("/follow/followers/count", {
      email: authStore.getEmail,
    });
    const followeeCount = await http.post("/follow/followees/count", {
      email: authStore.getEmail,
    });
    nickname.value = authStore.getNickname;
    followers.value = followerCount.data.count;
    following.value = followeeCount.data.count;
    posts.value = data.posts;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

// 컴포넌트가 마운트될 때 API 호출
onMounted(() => {
  fetchUserData();
});

// 메소드 정의
const setHoverTab = (tab) => {
  hoverTab.value = tab;
};

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const onFollowersClick = () => {
  console.log("팔로워 클릭");
};

const onFollowingClick = () => {
  console.log("팔로잉 클릭");
};

const onPostsClick = () => {
  console.log("게시글 클릭");
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
            <h1>{{ nickname }}님의 페이지</h1>
            <div class="profile-stats">
              <div class="stat-item" @click="onFollowersClick">
                <p>팔로워</p>
                <p>{{ followers }}</p>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item" @click="onFollowingClick">
                <p>팔로잉</p>
                <p>{{ following }}</p>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item" @click="onPostsClick">
                <p>게시글</p>
                <p>{{ posts }}</p>
              </div>
            </div>
            <button class="follow-button">팔로잉</button>
          </div>
          <div class="tab-container">
            <nav>
              <ul>
                <li
                  :class="{
                    active: activeTab === 'profile',
                    hover: hoverTab === 'profile',
                  }"
                  @mouseenter="setHoverTab('profile')"
                  @mouseleave="setHoverTab(null)"
                  @click="setActiveTab('profile')"
                >
                  회원정보 조회
                </li>
                <li
                  :class="{
                    active: activeTab === 'profileUpdate',
                    hover: hoverTab === 'profileUpdate',
                  }"
                  @mouseenter="setHoverTab('profileUpdate')"
                  @mouseleave="setHoverTab(null)"
                  @click="setActiveTab('profileUpdate')"
                >
                  회원정보 수정
                </li>
                <li
                  :class="{
                    active: activeTab === 'courses',
                    hover: hoverTab === 'courses',
                  }"
                  @mouseenter="setHoverTab('courses')"
                  @mouseleave="setHoverTab(null)"
                  @click="setActiveTab('courses')"
                >
                  여행 코스
                </li>
                <li
                  :class="{
                    active: activeTab === 'matches',
                    hover: hoverTab === 'matches',
                  }"
                  @mouseenter="setHoverTab('matches')"
                  @mouseleave="setHoverTab(null)"
                  @click="setActiveTab('matches')"
                >
                  매칭 게시물 목록
                </li>
                <li
                  :class="{
                    active: activeTab === 'reviews',
                    hover: hoverTab === 'reviews',
                  }"
                  @mouseenter="setHoverTab('reviews')"
                  @mouseleave="setHoverTab(null)"
                  @click="setActiveTab('reviews')"
                >
                  여행 후기 목록
                </li>
                <li
                  :class="{
                    active: activeTab === 'signout',
                    hover: hoverTab === 'signout',
                  }"
                  @mouseenter="setHoverTab('signout')"
                  @mouseleave="setHoverTab(null)"
                  @click="setActiveTab('signout')"
                >
                  회원 탈퇴
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div class="content-container">
          <component :is="componentsMap[activeTab]"></component>
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

.profile-sidebar h1 {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
}

.profile-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
}

.stat-item {
  flex: 1;
  cursor: pointer;
  text-align: center;
}

.stat-item p {
  margin: 5px;
}

.stat-divider {
  width: 1px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
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
  color: #000; /* 기본 글자 색상 검정 */
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

.tab-container nav ul li.active,
.tab-container nav ul li.hover {
  background-color: #000;
  color: #fff; /* 호버링 및 클릭 시 글자 색상 흰색 */
}

.tab-container nav ul li:hover {
  color: #fff; /* 호버링 시 글자 색상 흰색 */
}

.tab-container nav ul li button {
  all: unset;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.content-container {
  width: 65%;
  margin-left: 20px;
}

.profile-pic {
  width: 150px;
  height: 150px;
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
  margin-top: auto;
  font-size: 16px;
}
</style>
