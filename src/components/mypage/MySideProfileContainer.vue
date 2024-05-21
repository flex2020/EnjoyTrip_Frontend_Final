<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { Axios } from '@/api/http-common';
import { useRoute } from 'vue-router';
import MyFollower from '@/components/mypage/MyFollower.vue';
import MyFollowing from '@/components/mypage/MyFollowing.vue';

const http = Axios();
const authStore = useAuthStore();
const route = useRoute();

const props = defineProps({
  activeTab: {
    type: String,
    required: true,
  },
  profileImageFile: {
    type: File,
    default: null,
  },
});

const emit = defineEmits(["update-profile-image"]);

// 데이터 정의
const nickname = ref("사용자");
const followers = ref(0);
const following = ref(0);
const posts = ref(0);
const profileImage = ref("/src/assets/img/profileDefault.png"); // 프로필 이미지 초기화
const fileInputRef = ref(null); // 파일 입력 필드 참조
const showModal = ref(false);
const modalType = ref("");

// API 호출 메소드
const fetchUserData = async (memberId) => {
  try {
    const followerCount = await http.post("/follow/followers/count", {
      memberId: memberId,
    });
    const followeeCount = await http.post("/follow/followees/count", {
      memberId: memberId,
    });
    const profileResponse = await http.post("/member/profile", {
      memberId: memberId,
    });

    const memberInfo = await http.post("/member/info", {
      memberId: memberId,
    });

    nickname.value = memberInfo.data.nickname;
    followers.value = followerCount.data.count;
    following.value = followeeCount.data.count;

    // 프로필 이미지가 존재하면 업데이트
    if (profileResponse.data) {
      profileImage.value = profileResponse.data;
      authStore.updateProfileImage(profileResponse.data); // 프로필 이미지 업데이트
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

// 컴포넌트가 마운트될 때 API 호출
onMounted(() => {
  fetchUserData(route.params.memberId);
});

// route 변경 시 API 호출
watch(() => route.params.memberId, (newMemberId) => {
  fetchUserData(newMemberId);
});

// 이미지 업로드 핸들러
const onImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
    emit("update-profile-image", file);
  }
};

// 파일 입력 필드 클릭 핸들러
const onFileInputClick = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const onFollowersClick = () => {
  if (authStore.getMemberId === route.params.memberId) {
    modalType.value = "followers";
    showModal.value = true;
  }
};

const onFollowingClick = () => {
  if (authStore.getMemberId === route.params.memberId) {
    modalType.value = "following";
    showModal.value = true;
  }
};

const closeModal = () => {
  showModal.value = false;
};

const handleUpdateCount = ({ type, relation }) => {
  if (relation === 'following') {
    if (type === 'increment') {
      following.value++;
    } else if (type === 'decrement') {
      following.value--;
    }
  } else if (relation === 'follower') {
    if (type === 'increment') {
      followers.value++;
    } else if (type === 'decrement') {
      followers.value--;
    }
  }
};
</script>

<template>
  <div class="profile-sidebar">
    <div class="profile-pic-container">
      <img
        :src="profileImage"
        alt="Profile Picture"
        class="profile-pic"
        @click="onFileInputClick"
      />
      <label v-if="activeTab === 'profileUpdate'" class="upload-icon" @click="onFileInputClick">
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          @change="onImageUpload"
          style="display: none"
        />
        <span>+</span>
      </label>
    </div>
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

    <!-- 모달 컴포넌트 렌더링 -->
    <MyFollower v-if="showModal && modalType === 'followers'" @close-modal="closeModal" @update-count="handleUpdateCount"/>
    <MyFollowing v-if="showModal && modalType === 'following'" @close-modal="closeModal" @update-count="handleUpdateCount"/>
  </div>
  <div v-if="showModal" class="modal-overlay" @click="closeModal"></div>
</template>

<style scoped>
.profile-sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.profile-pic-container {
  position: relative;
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
}

.profile-pic {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  cursor: pointer;
}

.upload-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
</style>
