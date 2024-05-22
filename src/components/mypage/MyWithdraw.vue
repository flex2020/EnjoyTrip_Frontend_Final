<script setup>
import { defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "/src/api/http-common";

const router = useRouter();
const authStore = useAuthStore();
const http = Axios();

const confirmWithdraw = async () => {
  try {
    // 회원탈퇴 API 호출
    await http.post("/member/withdraw", {
      memberId: authStore.getMemberId(),
    });
    // 로그아웃 처리
    authStore.signout();
    // 메인 페이지로 이동
    router.push("/");
  } catch (error) {
    console.error("Error withdrawing member:", error);
  }
};

const emit = defineEmits(["close-modal"]);

const cancelWithdraw = () => {
  emit("close-modal");
};
</script>

<template>
  <div class="modal-content">
    <h2>회원탈퇴</h2>
    <p class="withdraw-text">정말 탈퇴하시겠습니까?</p>
    <div class="button-group">
      <button @click="confirmWithdraw" class="btn confirm-button">예</button>
      <button @click="cancelWithdraw" class="btn cancel-button">아니요</button>
    </div>
  </div>
</template>

<style scoped>
.modal-content {
  background: white;
  padding: 40px; /* 패딩 크기 조정 */
  border-radius: 10px;
  text-align: center;
  max-width: 400px;
  width: 100%;
  z-index: 1001; /* 오버레이보다 앞에 오도록 설정 */
  position: absolute; /* 화면 중앙에 위치 */
  top: 50%;
  left: 50%;
  margin-top: -112px; /* 모달 창 높이의 절반 */
  margin-left: -200px; /* 모달 창 너비의 절반 */
}

.modal-content h2 {
  font-size: 28px; /* 글꼴 크기 */
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.withdraw-text {
  font-size: 18px;
  color: #555;
  margin-bottom: 30px; /* 텍스트 아래 여백 추가 */
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn {
  position: relative;
  background-color: #fff;
  color: #000;
  border: 2px solid #000;
  padding: 2px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  font-family: inherit;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  line-height: 40px;
  z-index: 2;
  transition: background-color 0.3s, color 0.3s;
}

.btn:hover {
  color: #fff;
  background-color: #000;
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
</style>
