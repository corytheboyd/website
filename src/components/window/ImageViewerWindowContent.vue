<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <img
      :src="props.programArguments.src"
      :alt="props.programArguments.title"
      :style="{
        width: props.programArguments.width + 'px',
        height: props.programArguments.height + 'px',
      }"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  programArguments: {
    src: string;
    title: string;
    width: number;
    height: number;
  };
}>();
</script>
