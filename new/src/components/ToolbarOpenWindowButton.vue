<template>
  <button
    class="button flex min-w-2 flex-1 items-center"
    :class="{ active: props.windowId === focusedWindowId }"
    :style="{ padding: '0 4px' }"
    @click="focusWindow(windowId)"
  >
    <img
      v-if="getWindow(windowId)?.icon"
      :src="getWindow(windowId)?.icon"
      :alt="getWindow(windowId)?.name"
      class="w-3.5"
    />
    <span class="truncate pl-1 overflow-ellipsis whitespace-nowrap">{{
      getWindow(windowId)?.name
    }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useWindowStore } from "@/state/store";

const props = defineProps<{
  windowId: string;
}>();

const store = useWindowStore();

const focusedWindowId = computed(() => {
  return store.focusedWindowId;
});

const getWindow = (id: string) => store.getWindow(id);

const focusWindow = (id: string) => {
  const window = getWindow(id);
  if (window?.minimized) {
    store.minimizeWindow(id); // Toggle minimized state to unminimize
  }
  store.setFocusedWindowId(id);
};
</script>

<style>
.active {
  background: #dfdfdf;
  box-shadow:
    inset -1px -1px #ffffff,
    inset 1px 1px #0a0a0a,
    inset -2px -2px #dfdfdf,
    inset 2px 2px #808080;
}
</style>
