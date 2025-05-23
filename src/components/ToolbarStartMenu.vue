<template>
  <div
    ref="menuRef"
    class="window absolute left-0 z-50 flex"
    :style="{ bottom: `${toolbarHeight}px`, marginLeft: '2px' }"
  >
    <!-- BLUE BAR -->
    <div
      class="bg-linear-to-t from-[var(--win98-blue-dark)] via-[var(--win98-blue)] via-15% to-[var(--win98-blue-dark)] to-55% px-1 py-[1.5px] leading-none tracking-wide text-white"
      :style="{ 'writing-mode': 'sideways-lr', 'font-family': 'MS Sans Serif' }"
    >
      <span class="text-[18px] font-extrabold">Wowsuch</span>
      <span class="text-[20px] font-extralight">98</span>
    </div>

    <!-- MENU ITEMS -->
    <div class="flex w-46 flex-1 flex-col">
      <template v-for="(item, i) in menuItems" :key="i">
        <DividerHorizontal v-if="item.type === 'divider'" class="py-1" />
        <div
          v-else
          class="group relative flex items-center gap-2 py-1.5 pr-0.5 pl-3 hover:bg-[var(--win98-blue-dark)] hover:text-white"
          @mousedown="item.action && item.action()"
        >
          <img :src="item.icon" class="h-5 w-5" :alt="item.label" />
          <span class="flex-1">{{ item.label }}</span>
          <span
            v-if="item.submenu"
            class="text-[8px] text-black group-hover:text-white"
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
import { ref, onMounted, onBeforeUnmount } from "vue";
import DividerHorizontal from "@/components/DividerHorizontal.vue";
import ToolbarStartMenuSubMenu from "./ToolbarStartMenuSubMenu.vue";
import { useWindowStore } from "@/state/store.ts";

defineProps<{ toolbarHeight: number }>();
const emit = defineEmits(["close"]);

const menuRef = ref<HTMLElement | null>(null);

function handleDocumentClick(e: MouseEvent | TouchEvent) {
  const path = (e as any).composedPath?.() || [];
  if (menuRef.value && !path.includes(menuRef.value)) {
    emit("close");
  }
}

onMounted(() => {
  document.addEventListener("mousedown", handleDocumentClick, true);
  document.addEventListener("touchstart", handleDocumentClick, true);
});
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleDocumentClick, true);
  document.removeEventListener("touchstart", handleDocumentClick, true);
});

interface MenuItem {
  icon?: string;
  label?: string;
  type?: "divider";
  submenu?: MenuItem[];
  action?: () => void;
}

const store = useWindowStore();

function openRunWindow() {
  console.log("openRunWindow");
  store.addWindow({
    name: "Run",
    width: 370,
    height: 160,
    resizable: false,
    position: { x: 40, y: 40 },
    icon: "/win98icon/application_hourglass-0.png",
    component: "RunWindowContent",
  });
  emit("close");
}

const menuItems: MenuItem[] = [
  {
    icon: "/win98icon/directory_favorites-0.png",
    label: "Favorites",
    submenu: [
      {
        icon: "/win98icon/directory_open_file_mydocs-0.png",
        label: "My Documents",
      },
      {
        icon: "/win98icon/directory_open_file_mydocs-0.png",
        label: "My Pictures",
      },
      { type: "divider" },
      {
        icon: "/win98icon/directory_open_file_mydocs-0.png",
        label: "My Music",
      },
    ],
  },
  {
    icon: "/win98icon/directory_open_file_mydocs-0.png",
    label: "Documents",
    submenu: [
      {
        icon: "/win98icon/directory_open_file_mydocs-0.png",
        label: "Recent Documents",
      },
      { type: "divider" },
      {
        icon: "/win98icon/directory_open_file_mydocs-0.png",
        label: "My Documents",
      },
    ],
  },
  {
    icon: "/win98icon/settings_gear-0.png",
    label: "Settings",
    submenu: [
      { icon: "/win98icon/settings_gear-0.png", label: "Control Panel" },
      { icon: "/win98icon/settings_gear-0.png", label: "Printers" },
      { type: "divider" },
      { icon: "/win98icon/settings_gear-0.png", label: "Taskbar & Start Menu" },
    ],
  },
  { type: "divider" },
  { icon: "/win98icon/help_book_cool-4.png", label: "Help" },
  {
    icon: "/win98icon/application_hourglass-0.png",
    label: "Run...",
    action: openRunWindow,
  },
  { type: "divider" },
  { icon: "/win98icon/key_win-0.png", label: "Log Off..." },
];
</script>

<style>
:root {
  --win98-blue: #0000ff;
  --win98-blue-dark: #00007b;
}
</style>
