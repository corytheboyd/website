<template>
  <span class="win98-icon">
    <img :src="`/win98icon/${icon}.png`" :alt="icon" />
  </span>
</template>

<script setup lang="ts">
defineProps<{ icon: string }>()
</script>

<style scoped>
.win98-icon {
  display: inline-block;
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.win98-icon img {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}
</style> 
