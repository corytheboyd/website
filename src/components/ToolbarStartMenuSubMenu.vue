<template>
  <div
    class="window absolute top-0 left-full z-10 -mt-[3px] min-w-[200px] border border-t-0 border-r-0 border-b-0 bg-[var(--win98-gray)] shadow-lg"
    style="margin-left: 0"
  >
    <div class="flex flex-col">
      <template v-for="(item, i) in items" :key="i">
        <DividerHorizontal v-if="item.type === 'divider'" class="py-1" />
        <ToolbarStartMenuSubMenuItem
          v-else
          :icon="item.icon"
          :label="item.label"
          :submenu="item.submenu"
          :action="item.action"
          :open="hoveredIndex === i"
          @mouseenter.native="hoveredIndex = i"
          @mouseleave.native="hoveredIndex = null"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DividerHorizontal from "@/components/DividerHorizontal.vue";
import ToolbarStartMenuSubMenuItem from "./ToolbarStartMenuSubMenuItem.vue";

interface MenuItem {
  icon?: string;
  label?: string;
  type?: "divider";
  submenu?: MenuItem[];
  action?: () => void;
}

defineProps<{
  items: MenuItem[];
}>();

const hoveredIndex = ref<number | null>(null);
</script>

<style>
:root {
  --win98-gray: #c0c0c0;
}
</style>
