import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getAttractionSearchResults, updateMatchCourse } from '@/api/trip';
import { getCourseListByMember, savePlan } from '@/api/plan';
import { useAuthStore } from "./auth";

export const usePlanStore = defineStore('planStore', () => {
  const courseId = ref(-1);
  const prevCourseId = ref(-1);
  const searchResults = ref([]);
  const plan = ref([]);
  const planLatLng = ref([]);
  const mapCenter = ref({
    lat: 37.5664056,
    lng: 126.9778222,
  });
  const nameInputToggle = ref(false);
  const courseName = ref('');

  const sido = ref('');
  const gugun = ref('');
  const keyword = ref('');
  const toggledAttraction = ref('');
  const courseList = ref([]);

  async function searchAttractions() {
    const temp = await getAttractionSearchResults(sido.value, gugun.value, keyword.value);
    searchResults.value = await temp.data;
    if (searchResults.value.length == 0) {
      alert('검색 결과가 없습니다.');
      return;
    }
    console.log(searchResults.value);
    if (searchResults.value.length > 0) {
      setCenter(searchResults.value[0].latitude, searchResults.value[0].longitude)
    }
  }

  function setCenter(lat, lng) {
    mapCenter.value = {
      lat: lat,
      lng: lng,
    }
  }

  function checkIncludes(attraction) {
    for (let i = 0; i < plan.value.length; i++) {
      const item = plan.value[i];
      if (item.contentId == attraction.contentId) {
        return true;
      }
    }
    return false;
  }

  async function loadCourseList(memberId) {
    courseList.value = await getCourseListByMember(memberId);
  }

  function refreshCoursePath() {
    const currentCourse = plan.value;
    planLatLng.value = [];
    for (let i=0; i<currentCourse.length; i++) {
      planLatLng.value.push({
        lat: currentCourse[i].latitude,
        lng: currentCourse[i].longitude,
        contentId: currentCourse[i].contentId,
      })
    }
    console.log('planLatLng', planLatLng.value)
  }

  function getPlanIndex(attraction) {
    for (let i = 0; i < plan.value.length; i++) {
      const item = plan.value[i];
      if (item.contentId == attraction.contentId) {
        return i+1;
      }
    }
    return -1;
  }

  async function updateCourse() {
    const data = [];
    const currentCourse = plan.value;
    for (let i=0; i<currentCourse.length; i++) {
      data.push({
        courseId: courseId.value,
        attractionId: currentCourse[i].contentId,
        order: i+1,
      });
    }
    await updateMatchCourse(data);
  }

  function addPlan(attraction) {
    plan.value.push(attraction);
    planLatLng.value.push({
      lat: plan.value[plan.value.length - 1].latitude,
      lng: plan.value[plan.value.length - 1].longitude,
      contentId: plan.value[plan.value.length - 1].contentId,
    })
    toggledAttraction.value = '';
  }

  function removePlan(attraction) {
    plan.value = plan.value.filter((item) => attraction.contentId != item.contentId);
    planLatLng.value = planLatLng.value.filter((item) => attraction.contentId != item.contentId);
    toggledAttraction.value = '';
  }

  async function saveCourse() {
    if (courseName.value == '') {
      alert('코스명을 입력해주세요.');
      return;
    }
    const authStore = useAuthStore();
    const memberId = authStore.getMemberId;
    await savePlan(courseId.value, courseName.value, memberId, plan.value);
    console.log(plan.value)
    alert('저장되었습니다.');
    nameInputToggle.value = false;
    await loadCourseList(memberId);
    if (courseId.value == -1) {
      plan.value = [];
      planLatLng.value = [];
    } 
  }

  function getCourseNameByCourseId(courseId) {
    for (let i = 0; i < courseList.value.length; i++) {
      if (courseList.value[i].courseId == courseId) return courseList.value[i].courseName;
    }
    return '';
  }

  return { 
    courseId,
    prevCourseId,
    searchResults,
    nameInputToggle,
    courseName,
    plan,
    mapCenter,
    keyword,
    sido,
    gugun,
    toggledAttraction,
    courseList,
    planLatLng,
    searchAttractions,
    setCenter,
    checkIncludes,
    loadCourseList,
    refreshCoursePath,
    getPlanIndex,
    updateCourse,
    addPlan,
    removePlan,
    saveCourse,
    getCourseNameByCourseId,
  }
})
