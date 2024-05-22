import { Axios } from "@/api/http-common.js";

const http = Axios();

async function getAttractionRecommend(attractionName) {
  const response = await http.post("/gpt/generate/attraction-recommend", {attraction: attractionName});
  const data = await response.data;
  console.log(data);
  return data;
}

async function getMatchRecommend(email) {
  const response = await http.post("/gpt/generate/match-recommend", {email: email});
  const data = await response.data;
  return data;
}

export {
  getAttractionRecommend,
  getMatchRecommend,
};