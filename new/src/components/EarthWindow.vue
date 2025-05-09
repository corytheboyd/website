<template>
  <section>
    <win98-window
      id="earth"
      title="Earth"
      body-class="p-0 m-0"
      :width="400"
      :height="300"
      :position="{ x: 200, y: 200 }"
    >
      <div
        class="relative flex flex-col items-center justify-center overflow-hidden bg-gray-900 p-2"
      >
        <EarthAndFlyby class="z-10 w-38 sm:w-64 md:w-72 lg:w-96" />
      </div>
    </win98-window>
  </section>
</template>

<script setup lang="ts">
import Win98Window from "@/components/base/Win98Window.vue";
import EarthAndFlyby from "@/components/custom/EarthAndFlyby.vue";
</script>
