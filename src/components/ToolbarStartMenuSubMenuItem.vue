<template>
  <div
    class="group relative flex cursor-pointer items-center gap-1.5 px-2 py-1 text-black hover:bg-[var(--win98-blue-dark)] hover:text-white"
    @mousedown="action && action()"
  >
    <img :src="icon" class="h-4 w-4" :alt="label" />
    <span class="flex-1 text-[11px]">{{ label }}</span>
    <span
      v-if="submenu"
      :class="open ? 'text-white' : 'text-black'"
      class="text-[8px]"
      >▶</span
    >
    <ToolbarStartMenuSubMenu v-if="submenu && open" :items="submenu" />
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
  open?: boolean;
}

defineProps<{
  icon?: string;
  label?: string;
  submenu?: MenuItem[];
  action?: () => void;
  open?: boolean;
}>();
</script>
