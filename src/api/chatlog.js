import { Axios } from "@/api/http-common.js";

const http = Axios();

async function loadChatLog(matchId) {
  const response = await http.get(`/chat/${matchId}`);
  console.log(response)
  const data = await response.data;
  return data;
}

export {
  loadChatLog,
};