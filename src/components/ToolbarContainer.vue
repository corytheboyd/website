<template>
  <div ref="toolbarRef" class="window flex" style="z-index: 9999">
    <ToolbarStartButton
      ref="startButtonRef"
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
      ref="menuRef"
      :toolbarHeight="toolbarHeight"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watchEffect, watch } from "vue";
import { computed } from "vue";
import { useWindowStore } from "@/state/store.ts";
import DividerVertical from "@/components/DividerVertical.vue";
import ToolbarOpenWindowButton from "@/components/ToolbarOpenWindowButton.vue";
import ToolbarStartButton from "@/components/ToolbarStartButton.vue";
import ToolbarInfo from "@/components/ToolbarInfo.vue";
import ToolbarStartMenu from "@/components/ToolbarStartMenu.vue";

const store = useWindowStore();
const openWindowIds = computed(() => store.taskbarOrder);

const toolbarRef = ref<HTMLElement | null>(null);
const toolbarHeight = ref(40);
const menuRef = ref<HTMLElement | null>(null);
const startButtonRef = ref<HTMLElement | null>(null);

let resizeObserver: ResizeObserver | null = null;

function updateToolbarHeight() {
  if (toolbarRef.value) {
    toolbarHeight.value = toolbarRef.value.offsetHeight;
  }
}

function handleGlobalClick(e: MouseEvent | TouchEvent) {
  const path = (e as any).composedPath?.() || [];
  if (
    store.startMenuOpen &&
    !path.includes(menuRef.value) &&
    !path.includes(startButtonRef.value)
  ) {
    store.closeStartMenu();
  }
}

onMounted(() => {
  updateToolbarHeight();
  window.addEventListener("resize", updateToolbarHeight);

  // Use ResizeObserver for dynamic toolbar height changes
  if (toolbarRef.value) {
    resizeObserver = new ResizeObserver(updateToolbarHeight);
    resizeObserver.observe(toolbarRef.value);
  }
  document.addEventListener("mousedown", handleGlobalClick, true);
  document.addEventListener("touchstart", handleGlobalClick, true);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateToolbarHeight);
  if (resizeObserver && toolbarRef.value) {
    resizeObserver.unobserve(toolbarRef.value);
  }
  document.removeEventListener("mousedown", handleGlobalClick, true);
  document.removeEventListener("touchstart", handleGlobalClick, true);
});
watchEffect(updateToolbarHeight);

watch(
  () => store.startMenuOpen,
  (open) => {
    if (open) {
      setTimeout(updateToolbarHeight, 0);
    }
  },
);
</script>
