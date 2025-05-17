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

    <ToolbarInfo />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useWindowStore } from "@/state/store.ts";
import ToolbarDivider from "@/components/ToolbarDivider.vue";
import ToolbarOpenWindowButton from "@/components/ToolbarOpenWindowButton.vue";
import ToolbarStartButton from "@/components/ToolbarStartButton.vue";
import ToolbarInfo from "@/components/ToolbarInfo.vue";

const store = useWindowStore();

const openWindowIds = computed(() => store.taskbarOrder);
</script>
