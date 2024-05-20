<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Axios } from '/src/api/http-common';

const http = Axios();
const router = useRouter();
const authStore = useAuthStore();

const signout = async () => {
  try {
    // pinia에 있던 토큰 파기
    authStore.clearToken();

    // signout api 호출
    await http.post('/member/signout');

    // Redirect to the main page
    alert('로그아웃이 완료되었습니다.');
    router.push('/');
  } catch (error) {
    console.error(error);
    alert('로그아웃에 실패하였습니다. 다시 시도해주세요.');
  }
};
</script>

<template>
    <div>
        MemberSignout.vue
    </div>
</template>

<style scoped>

</style>