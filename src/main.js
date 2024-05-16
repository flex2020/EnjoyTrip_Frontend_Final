import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useKakao } from 'vue3-kakao-maps/@utils';
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

useKakao(import.meta.env.VITE_KAKAOMAP_SERVICE_KEY);
app.mount('#app')
