<script setup>
import { ref } from "vue";
import { KakaoMap, KakaoMapMarker, KakaoMapPolyline } from 'vue3-kakao-maps';
import { useTripStore } from "@/stores/trip";
import VMarkerInfo from "./VMarkerInfo.vue";
const tripStore = useTripStore();

const map = ref();

const onLoadKakaoMap = (mapRef) => {
  map.value = mapRef;
  kakao.maps.event.addListener(map.value, 'click', function (mouseEvent) {
    tripStore.toggledAttraction = '';
    // const latlng = mouseEvent.latLng;
  });
};

const getMarkerNumber = (number) => `<div style="font-weight: 1000; font-size: 20px; color: white;">${number}</div>`


const markerToggle = (attraction) => {
  tripStore.toggledAttraction = tripStore.toggledAttraction == attraction.contentId ? '' : attraction.contentId;
  tripStore.setCenter(attraction.latitude, attraction.longitude);
  map.value.setCenter(new kakao.maps.LatLng(attraction.latitude, attraction.longitude));
  map.value.setLevel(3);
}

</script>

<template>
  <div id="map">
    <KakaoMap :lat="tripStore.mapCenter.lat" :lng="tripStore.mapCenter.lng" width="100%" height="100vh" level="4" @onLoadKakaoMap="onLoadKakaoMap">
      <!-- 기본 마커 -->
      <template v-for="attraction in tripStore.attractionSearchResults" :key="attraction.contentId">
        <KakaoMapMarker :lat="attraction.latitude" :lng="attraction.longitude" v-if="!tripStore.checkIncludes(attraction)"
          :clickable="true" @onClickKakaoMapMarker="markerToggle(attraction)">
          <template v-slot:infoWindow v-if="tripStore.toggledAttraction == attraction.contentId">
            <VMarkerInfo :attraction="attraction" />
          </template>
        </KakaoMapMarker>
      </template>
      
      <!-- 커스텀 마커 -->
      <KakaoMapMarker :lat="tripPlan.latitude" :lng="tripPlan.longitude" v-for="tripPlan in tripStore.tripPlanList" :key="tripPlan.contentId"
        :clickable="true" @onClickKakaoMapMarker="markerToggle(tripPlan)"
        :order="tripStore.checkIncludes(tripPlan) ? getMarkerNumber(tripStore.getTripPlanIndex(tripPlan)) : '' "
        order-bottom-margin="38px"
        :image="{
          imageSrc: '/src/assets/img/fontawesome/location-pin-solid.svg',
          imageWidth: 35,
          imageHeight: 50,
          imageOption: {}
        }">
        <template v-slot:infoWindow v-if="tripStore.toggledAttraction == tripPlan.contentId">
          <VMarkerInfo :attraction="tripPlan" />
        </template>
      </KakaoMapMarker>
      <KakaoMapPolyline :latLngList="tripStore.tripPlanLatLngList" />
    </KakaoMap>
  </div>
</template>

<style scoped>
#map {
  z-index: -1;
  width:calc(100vw - 400px);
}
</style>