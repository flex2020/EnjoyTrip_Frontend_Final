<script setup>
import { getMatchCourse } from "@/api/trip";
import { onMounted, ref, watch } from "vue";
import { KakaoMap, KakaoMapMarker, KakaoMapPolyline } from 'vue3-kakao-maps';
import VMarkerInfoForPlan from "@/components/common/VMarkerInfoForPlan.vue"

const props = defineProps({
  matchId: Number,
})

onMounted(async() => {
  // courseList로 latlng 리스트 생성 
  const data = await getMatchCourse(props.matchId);
  console.log('props', props.matchId)
  courseList.value = await data.courseItem;
  console.log('test', courseList.value)
  for (let i=0; i<courseList.value.length; i++) {
    latlng.value.push({
      lat: courseList.value[i].latitude,
      lng: courseList.value[i].longitude,
    });
  }
  if (latlng.value.length > 0) {
    // 중심좌표 설정
    center.value = {
      lat: latlng.value[0].lat,
      lng: latlng.value[0].lng,
    }
  }
  console.log(latlng.value)
});

const courseList = ref([]);
const center = ref({
  lat: 37.5664056,
  lng: 126.9778222,
});
const latlng = ref([]);
const toggledAttraction = ref('');
const map = ref(null);
const getMarkerNumber = (number) => `<div style="font-weight: 1000; font-size: 20px; color: white;">${number}</div>`

const onLoadKakaoMap = (mapRef) => {
  map.value = mapRef;
  kakao.maps.event.addListener(map.value, 'click', function (mouseEvent) {
    toggledAttraction.value = '';
    // const latlng = mouseEvent.latLng;
  });
};

const markerToggle = (c) => {
  toggledAttraction.value = c.contentId;
}

</script>

<template>
  <div id="map-review">
    <KakaoMap :lat="center.lat" :lng="center.lng" width="100%" height="100%" level="4" @onLoadKakaoMap="onLoadKakaoMap">
      <!-- 커스텀 마커 -->
      <KakaoMapMarker :lat="course.latitude" :lng="course.longitude" v-for="(course, index) in courseList" :key="course.contentId"
        :clickable="true" @onClickKakaoMapMarker="markerToggle(course)"
        :order="getMarkerNumber(index + 1)"
        order-bottom-margin="38px"
        :image="{
          imageSrc: '/src/assets/img/fontawesome/location-pin-solid.svg',
          imageWidth: 35,
          imageHeight: 50,
          imageOption: {}
        }">
        <template v-slot:infoWindow v-if="toggledAttraction == course.contentId">
          <VMarkerInfoForPlan :attraction="course" from="review" />
        </template>
      </KakaoMapMarker>
      <KakaoMapPolyline :latLngList="latlng" />
    </KakaoMap>
  </div>
</template>

<style scoped>
#map-review {
  z-index: -1;
  width: 100%;
  height: 400px;
}
</style>