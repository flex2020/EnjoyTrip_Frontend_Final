<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Axios } from "@/api/http-common";

const http = Axios();
const route = useRoute();
const followings = ref([]);

const fetchFollowings = async () => {
  try {
    const response = await http.post("/follow/followees/list", {
      memberId: route.params.memberId,
    });
    followings.value = response.data;
  } catch (error) {
    console.error("Error fetching followings:", error);
  }
};

onMounted(() => {
  fetchFollowings();
});
</script>

<template>
  <div class="modal-content">
    <h2>팔로잉 목록</h2>
    <ul>
      <li v-for="following in followings" :key="following.id">{{ following.name }}</li>
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
  max-width: 400px;
  width: 100%;
  z-index: 1001;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
}

.modal-content li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
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
