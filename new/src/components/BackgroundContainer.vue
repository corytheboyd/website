<template>
  <div class="hidden md:block">
    <Starscape class="fixed inset-0 w-full h-full z-0" />
    <SolitaireMadness class="fixed inset-0 w-full h-full z-10" />
  </div>
</template>

<script setup lang="ts">
import Starscape from "./custom/Starscape.vue";
import SolitaireMadness from "./custom/SolitaireMadness.vue";
</script>
