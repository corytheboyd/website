<template>
  <Win98Window :id="id" title="Welcome">
    <p class="mb-4">
      Hello! I am <strong>corytheboyd</strong>, and this is my computer.
    </p>
    <p>
      Feel free to poke around, I don't mind :) Can you find all of my secrets?
    </p>
  </Win98Window>
</template>

<script setup lang="ts">
import Win98Window from "@/components/base/Win98Window.vue";

defineProps<{
  id: string;
}>();
</script>
