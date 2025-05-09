<template>
  <div class="hidden md:block">
    <Starscape class="fixed inset-0 z-0 h-full w-full" />
    <SolitaireMadness class="fixed inset-0 z-10 h-full w-full" />
  </div>
</template>

<script setup lang="ts">
import Starscape from "@/components/custom/Starscape.vue";
import SolitaireMadness from "@/components/custom/SolitaireMadness.vue";
</script>
