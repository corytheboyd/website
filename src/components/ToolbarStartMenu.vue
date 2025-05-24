<template>
  <div
    ref="menuRef"
    class="window absolute left-0 z-50 flex w-48"
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
    <div class="flex flex-1 flex-col">
      <template v-for="(item, i) in menuItems" :key="i">
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
import { ref, onMounted, onBeforeUnmount } from "vue";
import DividerHorizontal from "@/components/DividerHorizontal.vue";
import ToolbarStartMenuListItem from "./ToolbarStartMenuListItem.vue";
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
  store.addWindow({
    name: "Run",
    width: 370,
    height: 160,
    resizable: false,
    position: { x: 40, y: 40 },
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
        submenu: [
          {
            icon: "/win98icon/directory_open_file_mydocs-0.png",
            label: "My Documents",
          },
        ],
      },
    ],
  },
  {
    icon: "/win98icon/settings_gear-0.png",
    label: "Settings",
    submenu: [
      { icon: "/win98icon/settings_gear-0.png", label: "Control Panel" },
      { icon: "/win98icon/settings_gear-0.png", label: "Printers" },
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
  { icon: "/win98icon/shut_down_normal-0.png", label: "Shut Down..." },
];
</script>

<style>
:root {
  --win98-blue: #0000ff;
  --win98-blue-dark: #00007b;
}
</style>
