<template>
  <div v-if="isLocked" style="position: fixed; width: 100%; height: 100vh; overflow: hidden;"></div>
</template>

<script>
export default {
  props: {
    isLocked: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
body {
  overflow: hidden;
}
</style>