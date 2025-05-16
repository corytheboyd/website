<template>
  <div class="window flex" style="z-index: 9999">
    <!-- START BUTTON -->
    <button
      class="button mx-0 flex w-16 items-center justify-center gap-1 px-0"
    >
      <img src="/win98icon/windows-4.png" alt="Nyan Cat" class="h-4 w-4" />
      <span class="font-bold">Wow</span>
    </button>

    <TaskbarDivider />

    <!-- OPEN WINDOWS -->
    <div class="flex gap-[2px]">
      <button
        v-for="windowId in taskbarOrder"
        class="button flex w-4 items-center"
        :key="windowId"
        :class="{ active: windowId === focusedWindowId }"
        :style="{ padding: '0 5px' }"
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

    <TaskbarDivider />

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
import TaskbarDivider from "@/components/TaskbarDivider.vue";

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
