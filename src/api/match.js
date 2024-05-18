import { Axios } from "@/api/http-common.js";

const http = Axios();

async function getMatchesByMemberId(memberId) {
  const response = await http.get(`/match/member-matches/${memberId}`);
  const data = await response.data;
  return data;
}

async function removeMatchOfMember(memberId, matchId) {
  await http.delete(`/match/member-matches/${memberId}/${matchId}`);
}

export { getMatchesByMemberId, removeMatchOfMember };