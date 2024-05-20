<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { Axios } from '@/api/http-common';

const http = Axios();
const authStore = useAuthStore();

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  }
});

// 데이터 정의
const nickname = ref("사용자");
const followers = ref(0);
const following = ref(0);
const posts = ref(0);
const profileImage = ref('/src/assets/img/profileEX.png');
const newProfileImageFile = ref(null);
const fileInputRef = ref(null);  // 파일 입력 필드 참조

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
    // posts.value = data.posts; // 게시글 수 업데이트 로직 필요
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

// 컴포넌트가 마운트될 때 API 호출
onMounted(() => {
  fetchUserData();
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
    newProfileImageFile.value = file; // 새 이미지 파일 저장
  }
};

// 프로필 이미지 저장 메소드
const saveProfileImage = async () => {
  if (!newProfileImageFile.value) return;

  try {
    // 프로필 이미지를 서버에 저장하는 API 호출
    const formData = new FormData();
    formData.append('email', authStore.getEmail);
    formData.append('profileImage', newProfileImageFile.value);

    const response = await http.post('/profile/upload', formData);
    console.log('프로필 이미지 저장 성공:', response.data);
  } catch (error) {
    console.error('프로필 이미지 저장 실패:', error);
  }
};

// 파일 입력 필드 클릭 핸들러
const onFileInputClick = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};
</script>

<template>
  <div class="profile-sidebar">
    <div class="profile-pic-container">
      <img :src="profileImage" alt="Profile Picture" class="profile-pic" @click="onFileInputClick" />
      <label v-if="activeTab === 'profileUpdate'" class="upload-icon" @click="onFileInputClick">
        <input ref="fileInputRef" type="file" accept="image/*" @change="onImageUpload" style="display: none;" />
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
  </div>
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
