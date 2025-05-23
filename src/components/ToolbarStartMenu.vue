<template>
  <div class="window flex">
    <!-- BLUE BAR -->
    <div
      class="bg-linear-to-t from-[#00007B] via-[#0000FF] via-15% to-[#00007B] to-55% px-1 py-[1.5px] leading-none tracking-wide text-white"
      :style="{ 'writing-mode': 'sideways-lr', 'font-family': 'MS Sans Serif' }"
    >
      <span class="text-[18px] font-extrabold">Wowsuch</span>
      <span class="text-[20px] font-extralight">98</span>
    </div>

    <!-- MENU ITEMS -->
    <div class="flex flex-1 flex-col">
      <template v-for="(item, i) in menuItems" :key="i">
        <DividerHorizontal v-if="item.type === 'divider'" class="py-1" />
        <div
          v-else
          class="flex cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-[#000080] hover:text-white"
        >
          <img :src="item.icon" class="h-5 w-5" :alt="item.label" />
          <span>{{ item.label }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import DividerHorizontal from "@/components/DividerHorizontal.vue";

const menuItems = [
  { icon: "/win98icon/directory_favorites-0.png", label: "Favorites" },
  { icon: "/win98icon/directory_open_file_mydocs-0.png", label: "Documents" },
  { icon: "/win98icon/settings_gear-0.png", label: "Settings" },
  { type: "divider" },
  { icon: "/win98icon/help_book_cool-4.png", label: "Help" },
  { icon: "/win98icon/application_hourglass-0.png", label: "Run..." },
  { type: "divider" },
  { icon: "/win98icon/key_win-0.png", label: "Log Off..." },
];
</script>
