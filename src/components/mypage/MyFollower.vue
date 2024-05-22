<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Axios } from "@/api/http-common";
import { useAuthStore } from "@/stores/auth";

const http = Axios();
const route = useRoute();
const router = useRouter();
const followers = ref([]);
const authStore = useAuthStore();
const emit = defineEmits(["update-count"]);

const fetchFollowers = async () => {
  try {
    const response = await http.post("/follow/followers/list", {
      memberId: route.params.memberId,
    });
    console.log(response.data);
    followers.value = response.data;
  } catch (error) {
    console.error("Error fetching followers:", error);
  }
};

const toggleFollow = async (follower) => {
  try {
    const apiUrl =
      follower.relation === 1 || follower.relation === 3 ? "/follow/unfollow" : "/follow/follow";
    await http.post(apiUrl, {
      fromMemberId: authStore.getMemberId,
      toMemberId: follower.memberId,
    });

    if (follower.relation === 1) {
      follower.relation = 0;
      emit("update-count", { type: "decrement", relation: "following" });
    } else if (follower.relation === 0) {
      follower.relation = 1;
      emit("update-count", { type: "increment", relation: "following" });
    } else if (follower.relation === 3) {
      follower.relation = 2;
      emit("update-count", { type: "decrement", relation: "following" });
    } else if (follower.relation === 2) {
      follower.relation = 3;
      emit("update-count", { type: "increment", relation: "following" });
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
  }
};

const goToUserPage = (memberId) => {
  router.push({ name: "mypage", params: { memberId: memberId } }).then(() => {
    window.location.reload();
  });
};

onMounted(() => {
  fetchFollowers();
});
</script>

<template>
  <div class="modal-content">
    <h2>팔로워 목록</h2>
    <ul>
      <li
        v-for="follower in followers"
        :key="follower.memberId"
        class="follower-item"
        @click="goToUserPage(follower.memberId)"
      >
        <img :src="follower.profileImage" alt="Profile Picture" class="profile-pic" />
        <span class="nickname">{{ follower.nickname }}</span>
        <button
          @click.stop="toggleFollow(follower)"
          class="btn follow-toggle-button"
          :class="
            follower.relation === 1 || follower.relation === 3 ? 'unfollow-button' : 'follow-button'
          "
        >
          {{ follower.relation === 1 || follower.relation === 3 ? "언팔로우" : "팔로우" }}
        </button>
      </li>
    </ul>
    <div class="button-group">
      <button class="btn" @click="$emit('close-modal')">닫기</button>
    </div>
  </div>
</template>

<style scoped>
.modal-content {
  background: white;
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  max-width: 500px;
  width: 100%;
  height: 400px; /* 5명의 사용자 고정 크기 */
  z-index: 1001;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -200px; /* 모달 창 높이의 절반 */
  margin-left: -250px; /* 모달 창 너비의 절반 */
  display: flex;
  flex-direction: column;
}

.modal-content h2 {
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: bold;
}

.modal-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
  flex-grow: 1;
}

.follower-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.follower-item:hover {
  background-color: #f9f9f9;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.nickname {
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  text-align: left;
  padding-left: 10px;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
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
  line-height: 30px;
  z-index: 2;
  transition: background-color 0.3s, color 0.3s;
  font-weight: bold;
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

.follow-toggle-button {
  font-size: 14px;
  padding: 5px 10px;
}

.follow-button {
  background-color: #000;
  color: #fff;
  border: 2px solid #000;
}

.unfollow-button {
  background-color: #fff;
  color: #000;
  border: 2px solid #000;
}

/* Custom scrollbar styles */
.modal-content ul::-webkit-scrollbar {
  width: 10px;
}

.modal-content ul::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 10px;
}

.modal-content ul::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.modal-content ul::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>
