<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
import { Axios } from "@/api/http-common";

const http = Axios();
const authStore = useAuthStore();
const matches = ref([]);
const route = useRoute();
const router = useRouter();

const fetchMatches = async () => {
  try {
    const response = await http.get("/match/find/matches", {
      params: {
        memberId: route.params.memberId,
      },
    });
    matches.value = response.data.matchByMemberId;
    console.log(matches.value);
  } catch (error) {
    console.error("Error fetching matches:", error);
  }
};

onMounted(() => {
  fetchMatches();
});

const goToMatch = (matchId) => {
  router.push({
    name: "match-view",
    params: { matchid: matchId },
  });
};

// 현재 시간 기준으로 모집 상태를 반환하는 함수
const getRecruitmentStatus = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  return now < deadlineDate ? "모집중" : "모집완료";
};

// 텍스트를 지정된 길이로 자르고 ...을 추가하는 함수
const truncateText = (text, length) => {
  if (!text) return ""; // null 또는 undefined 경우 빈 문자열 반환
  return text.length > length ? text.substring(0, length) + "..." : text;
};
</script>

<template>
  <div class="user-matches">
    <h2>여행 매칭</h2>
    <div v-if="matches.length > 0">
      <div
        v-for="match in matches"
        :key="match.matchId"
        class="match-item"
        @click="goToMatch(match.matchId)"
      >
        <div class="match-header">
          <h3>{{ truncateText(match.matchTitle, 13) }}</h3>
          <div class="match-meta">
            <span class="match-dates"
              >여행 기간: {{ new Date(match.travelStartDate).toLocaleDateString() }} -
              {{ new Date(match.travelEndDate).toLocaleDateString() }}</span
            >
            <span class="match-people">인원: {{ match.nowPeople }} / {{ match.maxPeople }}</span>
          </div>
        </div>
        <div class="match-content">
          <p>{{ truncateText(match.content, 30) }}</p>
        </div>
        <div class="match-footer">
          <div class="match-hashtags">
            <span v-for="hashtag in match.hashtags" :key="hashtag" class="hashtag"
              >#{{ hashtag }}</span
            >
          </div>
          <div class="match-deadline-status">
            <span class="match-deadline"
              >신청 마감: {{ new Date(match.deadline).toLocaleDateString() }}</span
            >
            <span
              class="recruitment-status"
              :class="{
                active: getRecruitmentStatus(match.deadline) === '모집중',
                completed: getRecruitmentStatus(match.deadline) === '모집완료',
              }"
            >
              {{ getRecruitmentStatus(match.deadline) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>매칭 여행이 없습니다.</p>
    </div>
  </div>
</template>

<style scoped>
.user-matches {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.user-matches h2 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: left;
}

.match-item {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  height: 220px; /* 세로 크기 고정 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.match-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.match-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.match-header h3 {
  margin: 0;
  font-size: 22px;
  color: #333;
}

.match-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 14px;
  color: #555;
  margin-top: 0.5rem;
}

.match-dates,
.match-people {
  margin: 5px 0;
}

.match-content p {
  margin-bottom: 25px;
  font-size: 16px;
  color: #555;
}

.match-hashtags {
  margin-bottom: 0.5rem;
}

.hashtag {
  display: inline-block;
  background: #f0f0f0;
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 5px;
  font-size: 14px;
  color: #555;
}

.match-footer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 14px;
  color: #555;
}

.match-deadline-status {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.match-deadline,
.match-hit {
  background: #f0f0f0;
  padding: 5px 10px;
  border-radius: 5px;
}

.recruitment-status {
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
}

.recruitment-status.active {
  background-color: #4caf50; /* Green */
  color: white;
}

.recruitment-status.completed {
  background-color: #f44336; /* Red */
  color: white;
}

/* Custom scrollbar styles */
.user-matches::-webkit-scrollbar {
  width: 10px;
}

.user-matches::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 10px;
}

.user-matches::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.user-matches::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>
