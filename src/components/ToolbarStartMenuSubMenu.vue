<template>
  <div
    class="window absolute top-0 left-full z-10 min-w-[200px] bg-[var(--win98-gray)] shadow-lg"
  >
    <div class="flex flex-col">
      <template v-for="(item, i) in items" :key="i">
        <DividerHorizontal v-if="item.type === 'divider'" class="py-1" />
        <div
          v-else
          class="group relative flex cursor-pointer items-center gap-2 px-3 py-1.5 text-black hover:bg-[var(--win98-blue-dark)] hover:text-white"
        >
          <img :src="item.icon" class="h-5 w-5" :alt="item.label" />
          <span class="flex-1">{{ item.label }}</span>
          <span
            v-if="item.submenu"
            class="text-[10px] text-black group-hover:text-white"
            >▶</span
          >
          <ToolbarStartMenuSubMenu
            v-if="item.submenu"
            :items="item.submenu"
            class="hidden group-hover:block"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import DividerHorizontal from "@/components/DividerHorizontal.vue";

interface MenuItem {
  icon?: string;
  label?: string;
  type?: "divider";
  submenu?: MenuItem[];
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
