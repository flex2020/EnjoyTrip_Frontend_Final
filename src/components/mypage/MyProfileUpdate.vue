<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Axios } from "/src/api/http-common";
import { useAuthStore } from "@/stores/auth";

const http = Axios();
const router = useRouter();
const authStore = useAuthStore();

// 사용자 정보 상태 정의
const email = ref("");
const memberName = ref("");
const nickname = ref("");
const mbti = ref("");
const intro = ref("");
const phoneNumber = ref("");
const phoneError = ref("");
const activeTab = ref("profile"); // 기본 활성 탭 설정
const profileImageFile = ref(null); // 프로필 이미지 파일

// 전화번호 형식 검사 메소드
const validatePhoneNumber = () => {
  const phonePattern = /^\d{3}-\d{3,4}-\d{4}$/;
  if (!phonePattern.test(phoneNumber.value)) {
    phoneError.value = "올바른 핸드폰 번호를 입력해주세요.";
  } else {
    phoneError.value = "";
  }
};

// 전화번호 형식 맞추기 메소드
const formatPhoneNumber = () => {
  let input = phoneNumber.value.replace(/\D/g, "");
  if (input.length > 3 && input.length <= 7) {
    input = `${input.slice(0, 3)}-${input.slice(3)}`;
  } else if (input.length > 7) {
    input = `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(7, 11)}`;
  }
  phoneNumber.value = input;
};

// API 호출 메소드
const fetchUserData = async () => {
  try {
    const response = await http.post("/member/info", {
      email: authStore.getEmail,
    });
    const data = response.data;
    email.value = data.email;
    memberName.value = data.memberName;
    nickname.value = data.nickname;
    mbti.value = data.mbti;
    intro.value = data.intro;
    phoneNumber.value = data.phoneNumber;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

// 업데이트 API 호출 메소드
const updateProfile = async () => {
  validatePhoneNumber();
  if (phoneError.value) {
    alert("올바른 핸드폰 번호를 입력해주세요.");
    return;
  }

  try {
    // 사진 데이터 포함 저장해보기
    // const formData = new FormData();
    // formData.append('nickname', nickname.value);
    // formData.append('email', email.value);
    // if (profileImageFile.value) {
    //   formData.append('profileImage', profileImageFile.value);
    // }

    // const response = await http.post('/profile/update', formData);
    // console.log('프로필 데이터 저장 성공:', response.data);


    await http.put("/member/update", {
      email: email.value,
      memberName: memberName.value,
      nickname: nickname.value,
      mbti: mbti.value,
      intro: intro.value,
      phoneNumber: phoneNumber.value,
    });
    alert("회원 정보가 성공적으로 수정되었습니다.");
    router.push("/mypage/profile"); // 프로필 페이지로 리다이렉트
    location.reload(); // 페이지 새로고침
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("회원 정보 수정에 실패했습니다. 다시 시도해주세요.");
  }
};

// 컴포넌트가 마운트될 때 사용자 데이터 가져오기
onMounted(() => {
  fetchUserData();
});
</script>

<template>
  <div class="profile-update">
    <h2>회원 정보 수정</h2>
    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="email">이메일</label>
        <input type="email" id="email" v-model="email" disabled />
      </div>
      <div class="form-group">
        <label for="memberName">이름</label>
        <input type="text" id="memberName" v-model="memberName" required />
      </div>
      <div class="form-group">
        <label for="nickname">닉네임</label>
        <input type="text" id="nickname" v-model="nickname" required />
      </div>
      <div class="form-group">
        <label for="mbti">MBTI</label>
        <input type="text" id="mbti" v-model="mbti" required />
      </div>
      <div class="form-group">
        <label for="intro">소개글</label>
        <textarea id="intro" v-model="intro" required></textarea>
      </div>
      <div class="form-group">
        <label for="phoneNumber">전화번호</label>
        <input
          type="text"
          id="phoneNumber"
          v-model="phoneNumber"
          @input="formatPhoneNumber"
          @blur="validatePhoneNumber"
          required
        />
        <div v-if="phoneError" class="error">{{ phoneError }}</div>
      </div>
      <div class="button-group">
        <button type="submit" class="btn btn-update">수정</button>
        <router-link :to="{ name: 'member-findpassword' }" class="btn btn-reset">비밀번호 재설정</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
.profile-update {
  padding: 15px;
  width: 100%;
  height: 100%;
  margin: auto;
  text-align: left; /* 왼쪽 정렬로 변경 */
}

.profile-update h2 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 18px;
  font-family: inherit;
}

.form-group textarea {
  resize: none;
  height: 70px;
}

.button-group {
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬로 변경 */
  gap: 10px;
}

.btn {
  position: relative;
  background-color: #fff; /* 배경 흰색 */
  color: #000; /* 글씨 검은색 */
  border: 2px solid #000; /* 테두리 검은색 */
  padding: 2px 20px; /* 크기 조정 */
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  font-family: inherit;
  text-align: center;
  text-decoration: none; /* Remove underline for router-link */
  display: inline-block;
  line-height: 40px;
  z-index: 2;
  transition: background-color 0.3s, color 0.3s;
}

.btn:hover {
  color: #fff;
  background-color: #000; /* 호버 시 배경색 변경 */
}

.btn::before {
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

.btn:hover::before {
  height: 100%;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 0.5rem;
}
</style>
