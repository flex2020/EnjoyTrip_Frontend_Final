<script setup>
import PlanListItem from "@/components/plan/PlanListItem.vue";
import { usePlanStore } from "@/stores/plan";
import { ref, computed } from "vue";
import draggable from "vuedraggable";

const planStore = usePlanStore();

const drag = ref(false);
const dragOptions = computed(() => ({
  animation: 200,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost'
}));

// 드래그 이벤트 핸들러
const onEnd = (event) => {
  drag.value = false;
  planStore.refreshCoursePath();
};
</script>

<template>
  <div class="trip-plan-list">
    <draggable
        tag="transition-group"
        :component-data="{
          tag: 'ul',
          type: 'transition-group',
          name: !drag ? 'flip-list' : null
        }"
        v-model="planStore.plan"
        v-bind="dragOptions"
        @start="drag = true"
        @end="onEnd"
        item-key="order"
      >
      <template #item="{ element }">
          <li class="list-group-item">
            <i
              :class="
                element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
              "
              @click="element.fixed = !element.fixed"
              aria-hidden="true"
            ></i>
            <PlanListItem :trip-plan="element"/>
          </li>
        </template>
    </draggable>
    <!-- <draggable group="tripplan" v-model="planStore.plan" @end="onEnd" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
      <template #item="{element}">
        <PlanListItem :trip-plan="element"/>
      </template>
      
    </draggable> -->
    
    <p v-if="!planStore.plan || planStore.plan.length == 0">아직 여행계획이 없습니다.</p>
  </div>
</template>

<style scoped>
.trip-plan-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  height: calc(100vh - 280px);
}

.trip-plan-list>p {
  overflow: hidden;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

ul {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

li {
  width: 100%;
}
</style>