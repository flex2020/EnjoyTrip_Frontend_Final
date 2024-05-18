import { Axios } from "@/api/http-common.js";
import { useTripStore } from "@/stores/trip";
// import store from "@/store/trip.js";

const http = Axios();

async function getSidoList() {
  const response = await http.get(`/trip/sido`);
  const data = await response.data;
  return data;
}

async function getGugunList(sido) {
  const response = await http.get(`/trip/gugun?sido=${sido}`);
  const data = await response.data;
  return data;
}

// GET
// 관광지 정보
async function getAttractionSearchResults(sido, gugun, keyword, page) {
  // api.defaults.headers["access-token"] = store.getters["accessToken"];
  const response = await http.get(`/trip/attractions?sido=${sido}&gugun=${gugun}&keyword=${keyword}&page=${page}`);
  const data = await response.data;
  return data;
}

async function getMatchCourse(matchId) {
  const response = await http.get(`/match/${matchId}`);
  const data = await response.data;
  return data;
}

async function updateMatchCourse(data) {
  http.put(`/course`, data);
}

export { getAttractionSearchResults, getSidoList, getGugunList, getMatchCourse, updateMatchCourse };