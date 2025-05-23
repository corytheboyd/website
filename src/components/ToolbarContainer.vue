<template>
  <div class="window flex" style="z-index: 9999">
    <ToolbarStartButton
      :depressed="store.startMenuOpen"
      @click="store.toggleStartMenu()"
    />

    <DividerVertical />

    <div class="flex flex-1 flex-wrap gap-[2px]">
      <ToolbarOpenWindowButton
        v-for="windowId in openWindowIds"
        :key="windowId"
        :windowId="windowId"
      />
    </div>

    <DividerVertical />

    <ToolbarInfo />

    <ToolbarStartMenu
      v-if="store.startMenuOpen"
      class="fixed bottom-10 left-0 z-[10000]"
      @click.outside="store.closeStartMenu()"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useWindowStore } from "@/state/store.ts";
import DividerVertical from "@/components/DividerVertical.vue";
import ToolbarOpenWindowButton from "@/components/ToolbarOpenWindowButton.vue";
import ToolbarStartButton from "@/components/ToolbarStartButton.vue";
import ToolbarInfo from "@/components/ToolbarInfo.vue";
import ToolbarStartMenu from "@/components/ToolbarStartMenu.vue";

const store = useWindowStore();

const openWindowIds = computed(() => store.taskbarOrder);
</script>
