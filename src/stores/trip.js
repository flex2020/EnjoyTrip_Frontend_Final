import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { getAttractionSearchResults, getMatchCourse, updateMatchCourse } from "@/api/trip";
import chatApi from '@/api/chat';

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
  const courseId = ref(-1);
  const tabItems = ref([]);
  const tabItemsLatLng = ref([[]]);
  const currentTab = ref(0);
  const removedTabs = ref([]);


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
    const message = {
      type: 'update-tab',
      username: chatApi.username,
      content: JSON.stringify(tabItems.value),
      matchId: chatApi.matchId,
    };
    chatApi.sendMessage(message);
  }

  function removeTripPlan(tripPlan) {
    tabItems.value[currentTab.value] = tabItems.value[currentTab.value].filter((item) => item.contentId != tripPlan.contentId);
    tabItemsLatLng.value[currentTab.value] = tabItemsLatLng.value[currentTab.value].filter((item) => item.contentId != tripPlan.contentId);
    toggledAttraction.value = '';
    const message = {
      type: 'update-tab',
      username: chatApi.username,
      content: JSON.stringify(tabItems.value),
      matchId: chatApi.matchId,
    };
    chatApi.sendMessage(message);
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
    const temp = await getMatchCourse(matchId);
    const matchCourse = await temp.courseItem;
    console.log('addtab', matchCourse)
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

  function isRemovedTab(index) {
    return removedTabs.value.includes(index);
  }

  function removeTab(index) {
    const currentTabCount = tabItems.value.length - removedTabs.value.length;
    if (currentTabCount > 1) {
      removedTabs.value.push(index);
      for (let i=0; i<tabItems.value.length; i++) {
        if (isRemovedTab(i)) continue;
        currentTab.value = i;
        break;
      }
    } else {
      alert('최소 1개 이상의 여행 코스는 있어야 합니다.')
      return;
    }
  }

  async function updateCourse() {
    const data = [];
    const currentCourse = tabItems.value[currentTab.value];
    for (let i=0; i<currentCourse.length; i++) {
      data.push({
        courseId: courseId.value,
        attractionId: currentCourse[i].contentId,
        order: i+1,
      });
    }
    await updateMatchCourse(data);
  }

  function refreshCoursePath() {
    const currentCourse = tabItems.value[currentTab.value];
    tabItemsLatLng.value[currentTab.value] = [];
    for (let i=0; i<currentCourse.length; i++) {
      tabItemsLatLng.value[currentTab.value].push({
        lat: currentCourse[i].latitude,
        lng: currentCourse[i].longitude,
        contentId: currentCourse[i].contentId,
      })
    }
  }

  function refreshCoursePathByIndex(tabIndex) {
    const currentCourse = tabItems.value[tabIndex];
    tabItemsLatLng.value[tabIndex] = [];
    for (let i=0; i<currentCourse.length; i++) {
      tabItemsLatLng.value[tabIndex].push({
        lat: currentCourse[i].latitude,
        lng: currentCourse[i].longitude,
        contentId: currentCourse[i].contentId,
      })
    }
  }

  return {
    sido, gugun, keyword, attractionSearchResults, pagination, totalPages, page, mapCenter, toggledAttraction, tabItems, tabItemsLatLng, currentTab, removedTabs, courseId, 
    searchAttractions, setCenter, addTripPlan, removeTripPlan, checkIncludes, getTripPlanIndex, addTab, changeTab, isRemovedTab, removeTab, updateCourse, refreshCoursePath, refreshCoursePathByIndex,
  }
})
