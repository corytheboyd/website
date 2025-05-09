<template>
  <div
    class="relative flex flex-col items-center justify-center overflow-hidden bg-gray-900 p-2"
  >
    <EarthAndFlyby class="z-10 w-38 sm:w-64 md:w-72 lg:w-96" />
  </div>
</template>

<script setup lang="ts">
import EarthAndFlyby from "@/components/custom/EarthAndFlyby.vue";
// No props needed for content-only component
</script>
