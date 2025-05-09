<template>
  <section>
    <win98-window title="Earth" body-class="p-0 m-0">
      <div
        class="relative flex flex-col items-center justify-center overflow-hidden bg-gray-900 p-2"
      >
        <EarthAndFlyby class="z-10 w-38 sm:w-64 md:w-72 lg:w-96" />
      </div>
    </win98-window>
  </section>
</template>

<script setup lang="ts">
import Win98Window from "./base/Win98Window.vue";
import EarthAndFlyby from "./custom/EarthAndFlyby.vue";
</script>
