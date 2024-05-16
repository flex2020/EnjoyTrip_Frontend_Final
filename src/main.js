import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useKakao } from 'vue3-kakao-maps/@utils';
import App from './App.vue'
import router from './router'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const app = createApp(App)

app.component('QuillEditor', QuillEditor)

app.use(createPinia())
app.use(router)

useKakao(import.meta.env.VITE_KAKAOMAP_SERVICE_KEY);
app.mount('#app')
