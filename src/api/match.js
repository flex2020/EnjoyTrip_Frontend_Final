import { Axios } from "@/api/http-common.js";

const http = Axios();

async function getMatchesByMemberId(memberId) {
  const response = await http.get(`/match/member-matches/${memberId}`);
  const data = await response.data;
  return data;
}

async function getMemberMatchesFinish(memberId) {
  const response = await http.get(`/match/finished-matches/${memberId}`);
  const data = await response.data;
  return data;
}

async function removeMatchOfMember(memberId, matchId) {
  await http.delete(`/match/member-matches/${memberId}/${matchId}`);
}

async function postMatchesByMemberId(map) {
  // console.log(map);
  const response = await http.post(`match/member-matches`, map);
  const data = await response.data;
  return data;
}

async function getMatesByMatchId(matchId) {
  const response = await http.get(`/match/match-mates/${matchId}`);
  const data = await response.data;
  // console.log(data);
  return data;
}

async function postMatesScore(dto) {
  console.log(dto);
  for (let index = 0; index < dto.length; index++) {
    if (dto[index].score !== null) {
      const data = {
        memberId: dto[index].memberId,
        score: dto[index].score,
      }
      
      await http.post(`/member/score`, data);
    }
  }
}

export {
  getMatchesByMemberId,
  getMemberMatchesFinish,
  removeMatchOfMember,
  postMatchesByMemberId,
  getMatesByMatchId,
  postMatesScore
};