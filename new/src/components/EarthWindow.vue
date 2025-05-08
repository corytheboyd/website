<template>
  <section class="w-full">
    <win98-window title="Earth" class="mx-3 md:mx-24" body-class="p-0 m-0">
      <div
        class="flex flex-col items-center justify-center p-2 bg-gray-900 relative overflow-hidden"
      >
        <EarthAndFlyby class="w-38 sm:w-64 md:w-72 lg:w-96 z-10" />
      </div>
    </win98-window>
  </section>
</template>

<script setup lang="ts">
import Win98Window from "./base/Win98Window.vue";
import EarthAndFlyby from './custom/EarthAndFlyby.vue'
</script>
