<script setup>
import { ref } from "vue";
import { KakaoMap, KakaoMapMarker, KakaoMapPolyline } from 'vue3-kakao-maps';
import VMarkerInfoForPlan from "@/components/common/VMarkerInfoForPlan.vue";
import { usePlanStore } from "@/stores/plan";
const planStore = usePlanStore();

const map = ref();

const onLoadKakaoMap = (mapRef) => {
  map.value = mapRef;
  kakao.maps.event.addListener(map.value, 'click', function (mouseEvent) {
    planStore.toggledAttraction = '';
    // const latlng = mouseEvent.latLng;
  });
};

const getMarkerNumber = (number) => `<div style="font-weight: 1000; font-size: 20px; color: white;">${number}</div>`


const markerToggle = (attraction) => {
  planStore.toggledAttraction = planStore.toggledAttraction == attraction.contentId ? '' : attraction.contentId;
  planStore.setCenter(attraction.latitude, attraction.longitude);
  map.value.setCenter(new kakao.maps.LatLng(attraction.latitude, attraction.longitude));
  map.value.setLevel(3);
}

</script>

<template>
  <div id="map">
    <KakaoMap :lat="planStore.mapCenter.lat" :lng="planStore.mapCenter.lng" width="100%" height="100vh" level="4" @onLoadKakaoMap="onLoadKakaoMap">
      <template v-for="attraction in planStore.searchResults" :key="attraction.contentId">
        <KakaoMapMarker :lat="attraction.latitude" :lng="attraction.longitude" v-if="!planStore.checkIncludes(attraction)"
          :clickable="true" @onClickKakaoMapMarker="markerToggle(attraction)">
          <template v-slot:infoWindow v-if="planStore.toggledAttraction == attraction.contentId">
            <VMarkerInfoForPlan :attraction="attraction" />
          </template>
        </KakaoMapMarker>
      </template>
      <!-- 커스텀 마커 -->
      <KakaoMapMarker :lat="plan.latitude" :lng="plan.longitude" v-for="plan in planStore.plan" :key="plan.contentId"
        :clickable="true" @onClickKakaoMapMarker="markerToggle(plan)"
        :order="planStore.checkIncludes(plan) ? getMarkerNumber(planStore.getPlanIndex(plan)) : '' "
        order-bottom-margin="38px"
        :image="{
          imageSrc: '/src/assets/img/fontawesome/location-pin-solid.svg',
          imageWidth: 35,
          imageHeight: 50,
          imageOption: {}
        }">
        <template v-slot:infoWindow v-if="planStore.toggledAttraction == plan.contentId">
          <VMarkerInfoForPlan :attraction="plan" />
        </template>
      </KakaoMapMarker>
      <KakaoMapPolyline :latLngList="planStore.planLatLng" />
    </KakaoMap>
  </div>
</template>

<style scoped>
#map {
  z-index: -1;
  width:calc(100vw - 400px);
}
</style>