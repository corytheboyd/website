<template>
  <div ref="toolbarRef" class="window flex" style="z-index: 9999">
    <ToolbarStartButton
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
      :toolbarHeight="toolbarHeight"
      @click.outside="store.closeStartMenu()"
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

let resizeObserver: ResizeObserver | null = null;

function updateToolbarHeight() {
  if (toolbarRef.value) {
    toolbarHeight.value = toolbarRef.value.offsetHeight;
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
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateToolbarHeight);
  if (resizeObserver && toolbarRef.value) {
    resizeObserver.unobserve(toolbarRef.value);
  }
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
