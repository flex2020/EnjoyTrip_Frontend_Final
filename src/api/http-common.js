import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from 'vue-router';

const { VITE_API_URL } = import.meta.env;

function Axios() {
  const instance = axios.create({
    baseURL: VITE_API_URL,
    header: {
      "Content-Type": "Application/json;charset=utf-8",
    },
  });

  // 요청 인터셉터 걸어서 pinia에 토큰 있으면 헤더에 포함시켜주기
  instance.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  instance.interceptors.response.use((response) => {
      return response;
  }, (error) => {
      const authStore = useAuthStore();
      const router = useRouter();
  
      if (error.response && error.response.status === 401) {
        authStore.signout();
        location.href = "/member/signin";
      }
  
      return Promise.reject(error);
    });

  return instance;
}

export { Axios };