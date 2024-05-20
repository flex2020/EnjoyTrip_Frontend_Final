<script setup>
import VHeader from "@/components/common/VHeader.vue";
import VKakaoMapForPlan from "@/components/common/VKakaoMapForPlan.vue";
import PlanSearchArea from "@/components/plan/PlanSearchArea.vue";
import { usePlanStore } from "@/stores/plan";
import { storeToRefs } from "pinia";
import { ref, nextTick, watch } from "vue";

const planStore = usePlanStore();
const { nameInputToggle } = storeToRefs(planStore);
const nameInput = ref(null);

const nameInputToggleHandler = () => {
  nameInputToggle.value = !nameInputToggle.value;
}

watch(nameInputToggle, async (newVal) => {
  console.log(newVal);
  if (newVal) {
    console.log(newVal);
    await nextTick();
    nameInput.value.focus();
  }
});

</script>

<template>
  <VHeader background="white" />
  <VKakaoMapForPlan />
  <PlanSearchArea />
  <div class="course-name-modal-bg" v-if="nameInputToggle" @click="nameInputToggleHandler">
  </div>
  <form class="course-name-modal" @submit.prevent="planStore.saveCourse" v-if="nameInputToggle" ref="nameInput" tabindex="0" @keyup.esc="nameInputToggleHandler">
      <h2>
        저장할 제목 입력
      </h2>
      <input type="text" v-model="planStore.courseName" />
      <button type="submit">코스 저장</button>
    </form>
</template>

<style scoped>
.course-name-modal-bg {
  z-index: 100005;
  background-color: #00000088;
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.course-name-modal {
  width: 100%;
  height: 200px;
  max-width: 400px;
  min-width: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100005;
}

.course-name-modal:focus {
  outline: none;
}

.course-name-modal h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
}

.course-name-modal input {
  border-radius: 10px;
  width: 90%;
  font-size: 20px;
  padding: 3px 5px;
  border: 1px solid var(--brand-color);
  margin-bottom: 15px;
}

.course-name-modal input:focus {
  outline: none;
}

.course-name-modal button {
  border: 1px solid var(--brand-color);
  border-radius: 15px;
  background-color: white;
  color: var(--brand-color);
  cursor: pointer;
  font-size: 16px;
  padding: 5px 10px;
  transition: 0.2s;
}

.course-name-modal button:hover {
  color: white;
  background-color: var(--brand-color);
}

</style>
