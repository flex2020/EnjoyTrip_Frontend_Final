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

async function postMatchesByMemberId(map) {
  // console.log(map);
  const response = await http.post(`match/member-matches`, map);
  const data = await response.data;
  return data;
}

export { getMatchesByMemberId, removeMatchOfMember, postMatchesByMemberId };