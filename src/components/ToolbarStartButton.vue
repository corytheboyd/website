<template>
  <button
    class="button flex items-center justify-center gap-1"
    :style="{ margin: 0, padding: '0 8px', minWidth: 0 }"
  >
    <img src="/win98icon/windows-4.png" alt="Nyan Cat" class="h-4 w-4" />
    <span class="font-bold">Start</span>
  </button>
</template>

<script>
export default {
  name: "ToolbarStartButton",
};
</script>
