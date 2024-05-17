import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getAttractionSearchResults } from "@/api/trip";

export const useTripStore = defineStore('tripStore', () => {
  const sido = ref('');
  const gugun = ref('');
  const keyword = ref('');
  const attractionSearchResults = ref([]);
  const pagination = ref([]);
  const totalPages = ref(0);
  const toggledAttraction = ref('');
  const page = ref(1);
  const mapCenter = ref({
    lat: 37.5664056,
    lng: 126.9778222,
  });
  const tripPlanList = ref([]);
  const tripPlanLatLngList = ref([]);

  async function searchAttractions() {
    const data = await getAttractionSearchResults(sido.value, gugun.value, keyword.value, page.value);
    attractionSearchResults.value = await data.data;
    pagination.value = await data.pagination;
    totalPages.value = await data.totalPages;
    page.value = await data.page;
    if (attractionSearchResults.value.length > 0) {
      setCenter(attractionSearchResults.value[0].latitude, attractionSearchResults.value[0].longitude)
    }
    console.log(attractionSearchResults.value)
  }

  function setCenter(lat, lng) {
    mapCenter.value.lat = lat;
    mapCenter.value.lng = lng;
  }

  function addTripPlan(attraction) {
    const item = { ...attraction };
    console.log(item)
    tripPlanList.value.push(item);
    console.log(tripPlanList.value)
    toggledAttraction.value = '';
    tripPlanLatLngList.value.push({
      lat: item.latitude,
      lng: item.longitude,
      contentId: item.contentId,
    })
    console.log(tripPlanLatLngList.value)
  }

  function removeTripPlan(tripPlan) {
    tripPlanList.value = tripPlanList.value.filter((item) => item.contentId != tripPlan.contentId);
    tripPlanLatLngList.value = tripPlanLatLngList.value.filter((item) => item.contentId != tripPlan.contentId);
    toggledAttraction.value = '';
  }

  function checkIncludes(tripPlan) {
    for (let i = 0; i < tripPlanList.value.length; i++) {
      const item = tripPlanList.value[i];
      if (item.contentId == tripPlan.contentId) {
        return true;
      }
    }
    return false;
  }

  function getTripPlanIndex(tripPlan) {
    for (let i = 0; i < tripPlanList.value.length; i++) {
      const item = tripPlanList.value[i];
      if (item.contentId == tripPlan.contentId) {
        return i+1;
      }
    }
    return -1;
  }

  return {
    sido, gugun, keyword, attractionSearchResults, pagination, totalPages, page, mapCenter, toggledAttraction, tripPlanList, tripPlanLatLngList,
    searchAttractions, setCenter, addTripPlan, removeTripPlan, checkIncludes, getTripPlanIndex
  }
})
