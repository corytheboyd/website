<template>
  <div class="window flex" style="z-index: 9999">
    <!-- START BUTTON -->
    <button
      class="button flex w-34 items-center justify-center gap-1"
      :style="{ margin: 0, padding: '0 8px', minWidth: 0 }"
    >
      <img src="/win98icon/windows-4.png" alt="Nyan Cat" class="h-4 w-4" />
      <span class="font-bold">Start</span>
    </button>

    <ToolbarDivider />

    <!-- OPEN WINDOWS -->
    <div class="flex flex-wrap gap-[2px] bg-red-300">
      <button
        v-for="windowId in taskbarOrder"
        class="button flex max-w-40 items-center"
        :key="windowId"
        :class="{ active: windowId === focusedWindowId }"
        :style="{ padding: '0 4px' }"
        @click="focusWindow(windowId)"
      >
        <img
          v-if="getWindow(windowId)?.icon"
          :src="getWindow(windowId)?.icon"
          :alt="getWindow(windowId)?.name"
          class="w-3.5"
        />
        <span class="truncate pl-1 whitespace-nowrap">{{
          getWindow(windowId)?.name
        }}</span>
      </button>
    </div>

    <!-- SPACER -->
    <div class="flex-1"></div>

    <ToolbarDivider />

    <!-- STATUS INFO -->
    <div class="status-bar">
      <p class="status-bar-field">
        <img src="/nyan.gif" alt="Nyan Cat" class="w-12" />
      </p>
    </div>
  </div>
</template>

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

<script setup lang="ts">
import { computed } from "vue";
import { useWindowStore } from "@/state/store";
import ToolbarDivider from "@/components/ToolbarDivider.vue";

const store = useWindowStore();

const taskbarOrder = computed(() => store.taskbarOrder);
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
