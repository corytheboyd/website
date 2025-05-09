<template>
  <div class="no-select">
    <BackgroundContainer />
    <DesktopContainer />
  </div>
</template>

<script setup lang="ts">
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import DesktopContainer from "@/components/DesktopContainer.vue";
</script>

<style>
.no-select {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>
