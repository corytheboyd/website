<template>
  <div class="flex h-full w-full flex-col items-center justify-center bg-black">
    <img
      :src="props.programArguments.src"
      :alt="props.programArguments.title"
      class="max-h-full max-w-full border border-gray-400 bg-white object-contain"
    />
    <div
      v-if="props.programArguments.title"
      class="mt-2 w-full truncate px-2 text-center text-xs text-white"
    >
      {{ props.programArguments.title }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  programArguments: {
    src: string;
    title: string;
  };
}>();
</script>
