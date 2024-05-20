import "./assets/css/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { useKakao } from "vue3-kakao-maps/@utils";
import App from "./App.vue";
import router from "./router";

import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import piniaPersist from "pinia-plugin-persist";

const app = createApp(App);
// Pinia 생성 및 설정
const pinia = createPinia();
pinia.use(piniaPersist);

app.component("QuillEditor", QuillEditor);

app.use(pinia); // pinia를 여기에 추가합니다.npm run
app.use(router);

useKakao(import.meta.env.VITE_KAKAOMAP_SERVICE_KEY);
app.mount("#app");
