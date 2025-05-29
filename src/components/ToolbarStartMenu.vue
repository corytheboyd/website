<template>
  <div
    ref="menuRef"
    class="window absolute left-0 z-[10001] flex w-48"
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
import { programShortcuts } from "@/programs";

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
  store.openProgram("run");
  emit("close");
}

const fourByteBurgerShortcut = programShortcuts.find(
  (s) => s.id === "four-byte-burger.png",
);
const fourByteBurgerProgram = fourByteBurgerShortcut
  ? store.getProgramById(fourByteBurgerShortcut.targetProgramId)
  : undefined;
function openFourByteBurger() {
  if (!fourByteBurgerShortcut) return;
  store.openProgram(fourByteBurgerShortcut.targetProgramId, {
    programArguments: fourByteBurgerShortcut.programArguments,
    windowArguments: {
      ...fourByteBurgerShortcut.windowArguments,
      title: fourByteBurgerShortcut.name,
    },
  });
  emit("close");
}

const menuItems: MenuItem[] = [
  {
    icon: "/win98icon/directory_open_file_mydocs-0.png",
    label: "Documents",
    submenu: [
      {
        icon: fourByteBurgerProgram?.window?.icon,
        label: fourByteBurgerShortcut?.name,
        action: openFourByteBurger,
      },
    ],
  },
  { type: "divider" },
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
