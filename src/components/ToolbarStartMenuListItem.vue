<template>
  <div
    class="group relative flex items-center gap-2 py-1.5 pr-0.5 pl-3 text-black hover:bg-[var(--win98-blue-dark)] hover:text-white"
    :class="{ 'cursor-pointer': action }"
    @mousedown="action && action()"
  >
    <img :src="icon" class="h-8 w-8" :alt="label" />
    <span class="flex-1">{{ label }}</span>
    <span v-if="submenu" class="text-[8px] text-black group-hover:text-white"
      >▶</span
    >
    <ToolbarStartMenuSubMenu
      v-if="submenu"
      :items="submenu"
      class="hidden group-hover:block"
    />
  </div>
</template>

<script setup lang="ts">
import ToolbarStartMenuSubMenu from "./ToolbarStartMenuSubMenu.vue";

interface MenuItem {
  icon?: string;
  label?: string;
  type?: "divider";
  submenu?: MenuItem[];
  action?: () => void;
}

defineProps<{
  icon?: string;
  label?: string;
  submenu?: MenuItem[];
  action?: () => void;
}>();
</script>
