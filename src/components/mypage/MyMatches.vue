<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "/src/api/http-common";

const http = Axios();
const authStore = useAuthStore();
const matches = ref([]);

const fetchMatches = async () => {
  try {
    // const response = await http.post("/matches/member", {
    //   memberId: authStore.getMemberId,
    // });
    matches.value = response.data;
  } catch (error) {
    console.error("Error fetching matches:", error);
  }
};

onMounted(() => {
  fetchMatches();
});
</script>

<template>
  <div class="user-matches">
    <h2>여행 매칭</h2>
    <div v-for="match in matches" :key="match.match_id" class="match-item">
      <div class="match-header">
        <h3>{{ match.match_title }}</h3>
        <div class="match-meta">
          <span class="match-dates">여행 기간: {{ new Date(match.travel_start_date).toLocaleDateString() }} - {{ new Date(match.travel_end_date).toLocaleDateString() }}</span>
          <span class="match-people">인원: {{ match.cur_people }} / {{ match.max_people }}</span>
        </div>
      </div>
      <div class="match-footer">
        <span class="register-date">등록일: {{ new Date(match.register_date).toLocaleDateString() }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-matches {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
}

.user-matches h2 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: left; /* 회원 정보 왼쪽 정렬 */
}

.match-item {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.match-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.match-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 14px;
  color: #555;
}

.match-dates,
.match-people {
  margin: 5px 0;
}

.match-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  font-size: 14px;
  color: #555;
}

.register-date {
  background: #f0f0f0;
  padding: 5px 10px;
  border-radius: 5px;
}
</style>
