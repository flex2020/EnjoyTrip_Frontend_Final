import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getAttractionSearchResults, getMatchCourse } from "@/api/trip";

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
  const tabItems = ref([]);
  const tabItemsLatLng = ref([[]]);
  const currentTab = ref(0);

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
    tabItems.value[currentTab.value].push(item);
    console.log(tabItems.value[currentTab.value])
    toggledAttraction.value = '';
    tabItemsLatLng.value[currentTab.value].push({
      lat: item.latitude,
      lng: item.longitude,
      contentId: item.contentId,
    })
    console.log(tabItemsLatLng.value[currentTab.value])
  }

  function removeTripPlan(tripPlan) {
    tabItems.value[currentTab.value] = tabItems.value[currentTab.value].filter((item) => item.contentId != tripPlan.contentId);
    tabItemsLatLng.value[currentTab.value] = tabItemsLatLng.value[currentTab.value].filter((item) => item.contentId != tripPlan.contentId);
    toggledAttraction.value = '';
  }

  function checkIncludes(tripPlan) {
    for (let i = 0; i < tabItems.value[currentTab.value].length; i++) {
      const item = tabItems.value[currentTab.value][i];
      if (item.contentId == tripPlan.contentId) {
        return true;
      }
    }
    return false;
  }

  function getTripPlanIndex(tripPlan) {
    for (let i = 0; i < tabItems.value[currentTab.value].length; i++) {
      const item = tabItems.value[currentTab.value][i];
      if (item.contentId == tripPlan.contentId) {
        return i+1;
      }
    }
    return -1;
  }

  async function addTab(matchId) {
    const matchCourse = await getMatchCourse(matchId);
    tabItems.value.push(matchCourse);
    const latlng = [];
    for (let i=0; i<matchCourse.length; i++) {
      const item = matchCourse[i];
      latlng.push({
        lat: item.latitude,
        lng: item.longitude,
        contentId: item.contentId,
      });
    }
    tabItemsLatLng.value.push(latlng);
  }

  function changeTab(index) {
    currentTab.value = index;
  }

  return {
    sido, gugun, keyword, attractionSearchResults, pagination, totalPages, page, mapCenter, toggledAttraction, tabItems, tabItemsLatLng, currentTab,
    searchAttractions, setCenter, addTripPlan, removeTripPlan, checkIncludes, getTripPlanIndex, addTab, changeTab,
  }
})
