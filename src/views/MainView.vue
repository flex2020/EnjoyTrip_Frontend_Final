<script setup>
import VHeader from "@/components/common/VHeader.vue";
import { onMounted } from "vue";

onMounted(() => {
  const script = document.createElement('script');
  script.src = '/src/assets/js/main.js';
  script.onload = () => {
    // main.js가 로드된 후 실행될 코드
  };
  document.body.appendChild(script);
});
</script>


<template>
  <VHeader></VHeader>
  <div class="background">
    <span id="text1"></span>
      <span id="text2"></span>
    <div id="main-intro">
      <!-- <div>함께 여행할 친구를 찾고</div>
      <div>여행 후기를 기록해보세요</div> -->

    </div>
    <svg id="filters">
    <defs>
        <filter id="threshold">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0
									0 1 0 0 0
									0 0 1 0 0
									0 0 0 255 -140" />
        </filter>
    </defs>
</svg>
  </div>
</template>

<style scoped>
.background {
  width: 100vw;
  height: 100vh;
  background-repeat: no-repeat; /* 이미지 반복 방지 */
  background-image: url("/src/assets/img/main-bg-2.jpg");
  position: relative;
  z-index: -1; /* VHeader 위에 배치되도록 함 */

  filter: url(#threshold) blur(0.6px);
}

@font-face {
    font-family: 'SokchoBadaDotum';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2402_1@1.0/SokchoBadaDotum.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'TTWanjudaedunsancheB';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-2@1.0/TTWanjudaedunsancheB.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
}

#text1,
#text2 {
    width: 100%;
    position: absolute;
    top: 45%;
    left: 0;
    font-family: "TTWanjudaedunsancheB";
    font-size: 80pt;
    text-align: center;
    user-select: none;
    color: white;
}

.background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.15); /* 여기서 투명도 조절 가능 */
}

#main-intro {
  position: absolute;
  top: 320px;
  right: 100px;
  font-weight: 1000;
  color: white;
}

#main-intro div:first-child {
  font-size: 74px;
  margin-bottom: 15px;
  animation: ani 1.5s;
}

#main-intro div:last-child {
  font-size: 54px;
  animation: ani 1.5s;
}

@keyframes ani{
    from{
        letter-spacing: 35px;
        filter: blur(5px);
        opacity: 0;
    }to{
        letter-spacing: 0;
        filter: blur(0);
        opacity: 1px;
    }
}
</style>
