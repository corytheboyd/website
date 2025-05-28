<template>
  <div
    class="flex h-full w-full flex-col items-center justify-center overflow-hidden"
  >
    <img
      :src="selectedImage"
      alt="Has Science Gone Too Far?"
      class="h-full w-full"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const images = [
  "/has-science-gone-too-far-1.png",
  "/has-science-gone-too-far-2.jpg",
  "/has-science-gone-too-far-3.png",
];

const props = defineProps<{ image?: string }>();
const selectedImage = computed(
  () => props.image || images[Math.floor(Math.random() * images.length)],
);
</script>
