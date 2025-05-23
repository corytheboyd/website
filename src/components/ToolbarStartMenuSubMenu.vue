<template>
  <div
    class="window absolute top-0 left-full z-10 min-w-[200px] bg-[var(--win98-gray)] shadow-lg"
  >
    <div class="flex flex-col">
      <template v-for="(item, i) in items" :key="i">
        <DividerHorizontal v-if="item.type === 'divider'" class="py-1" />
        <ToolbarStartMenuListItem
          v-else
          :icon="item.icon"
          :label="item.label"
          :submenu="item.submenu"
          :action="item.action"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import DividerHorizontal from "@/components/DividerHorizontal.vue";
import ToolbarStartMenuListItem from "./ToolbarStartMenuListItem.vue";

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
</script>

<style>
:root {
  --win98-gray: #c0c0c0;
}
</style>
