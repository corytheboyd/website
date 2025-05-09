<template>
  <div class="window flex" :class="['absolute bottom-0 left-0 w-full']" style="z-index: 9999;">
    <!-- START BUTTON -->
    <button
      class="button mx-0 flex w-16 items-center justify-center gap-1 px-0"
    >
      <img src="/win98icon/windows-4.png" alt="Nyan Cat" class="h-4 w-4" />
      <span class="font-bold">Wow</span>
    </button>

    <TaskbarDivider />

    <!-- OPEN WINDOWS -->
    <div class="flex gap-1">
      <button
        v-for="windowId in taskbarOrder"
        :key="windowId"
        class="button flex items-center gap-1 px-2"
        :class="{ active: windowId === focusedWindowId }"
        @click="focusWindow(windowId)"
      >
        <img
          v-if="getWindow(windowId)?.icon"
          :src="getWindow(windowId)?.icon"
          :alt="getWindow(windowId)?.name"
          class="h-4 w-4"
        />
        <span>{{ getWindow(windowId)?.name }}</span>
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
