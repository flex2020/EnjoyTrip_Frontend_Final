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
  },
  components: {
    MyProfile,
    MyCourses,
    MyMatches,
    MyReviews,
    VHeader, // VHeader 추가
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
                <li :class="{ active: activeTab === 'profile' }" @click="setActiveTab('profile')">
                  개인정보 수정
                </li>
                <li :class="{ active: activeTab === 'courses' }" @click="setActiveTab('courses')">
                  내 여행 코스
                </li>
                <li :class="{ active: activeTab === 'matches' }" @click="setActiveTab('matches')">
                  매칭 게시물 목록
                </li>
                <li :class="{ active: activeTab === 'reviews' }" @click="setActiveTab('reviews')">
                  여행 후기 목록
                </li>
                <li :class="{ active: activeTab === 'signout' }" @click="setActiveTab('signout')">
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
  position: relative; /* Changed to relative */
}

.background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.15); /* Adjust the opacity as needed */
  z-index: 1; /* Adjust z-index */
}

.profile-container {
  display: flex;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  height: 80%;
  max-width: 1200px;
  position: relative; /* Ensure it stays above the dark overlay */
  z-index: 2; /* Ensure it's above the overlay */
}

.left-container {
  width: 35%; /* Adjust width as needed */
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
  height: 100%;
}

.tab-container nav ul {
  list-style: none;
  padding: 0;
  text-align: center; /* Center align text */
}

.tab-container nav ul li {
  padding: 10px 0;
  cursor: pointer;
  transition: background-color 0.3s;
  border-bottom: 1px solid #e0e0e0; /* Add bottom border */
}

.tab-container nav ul li:last-child {
  border-bottom: none; /* Remove bottom border for last item */
}

.tab-container nav ul li:hover {
  background-color: #000; /* Change to black on hover */
  color: #fff; /* Change text color to white on hover */
}

.tab-container nav ul li.active {
  background-color: #000; /* Keep black background when active */
  color: #fff; /* Keep text color white when active */
}

.content-container {
  width: 65%; /* Adjust width as needed */
  margin-left: 20px;
}

.profile-pic {
  width: 100px; /* Reduced size */
  height: 100px; /* Reduced size */
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
