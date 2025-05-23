<template>
  <button
    class="button flex items-center justify-center gap-1 select-none"
    :class="{
      'border-t-2 border-r-2 border-b-0 border-l-0 border-[#fff] bg-[#000080] text-white':
        depressed,
    }"
    :aria-pressed="depressed"
    @click="$emit('click')"
    :style="{ margin: 0, padding: '0 8px', minWidth: 0 }"
  >
    <img src="/win98icon/windows-4.png" alt="Nyan Cat" class="h-4 w-4" />
    <span class="font-bold">Start</span>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{ depressed?: boolean }>();
const emit = defineEmits(["click"]);
</script>
