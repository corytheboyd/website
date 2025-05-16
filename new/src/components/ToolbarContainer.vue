<template>
  <div class="window flex" style="z-index: 9999">
    <ToolbarStartButton />

    <ToolbarDivider />

    <div class="flex flex-1 flex-wrap gap-[2px]">
      <ToolbarOpenWindowButton
        v-for="windowId in openWindowIds"
        :key="windowId"
        :windowId="windowId"
      />
    </div>

    <ToolbarDivider />

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
import ToolbarDivider from "@/components/ToolbarDivider.vue";
import ToolbarOpenWindowButton from "@/components/ToolbarOpenWindowButton.vue";
import ToolbarStartButton from "@/components/ToolbarStartButton.vue";

const store = useWindowStore();

const openWindowIds = computed(() => store.taskbarOrder);
</script>
