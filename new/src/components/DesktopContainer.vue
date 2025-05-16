<template>
  <main
    ref="desktopArea"
    class="fixed z-20 m-auto flex w-full flex-col items-center justify-center select-none"
    :class="[
      // MOBILE VIEW: FULL SCREEN
      'h-full w-full',
      // DESKTOP VIEW: CENTERED 4:3 SCREEN
      'md:aspect-4/3 md:h-auto md:max-h-full md:max-w-screen-lg',
    ]"
  >
    <section class="win98-color-teal w-full flex-1">
      <Win98Window
        v-for="window in windows"
        :key="window.id"
        :id="window.id"
        :title="window.name"
        :width="window.width"
        :height="window.height"
        :position="window.position"
        :minWidth="window.minWidth"
        :minHeight="window.minHeight"
        :resizable="window.resizable"
      >
        <component :is="contentComponentMap[window.component]" />
      </Win98Window>

      <Win98IconContainer>
        <Win98Icon
          v-for="icon in store.desktopIcons"
          :key="icon.id"
          :id="icon.id"
          :name="icon.name"
          :icon="icon.icon"
          :component="icon.component"
          :isFocused="store.focusedIconId === icon.id"
          @focus="store.setFocusedIconId"
        />
      </Win98IconContainer>
    </section>

    <section class="w-full">
      <ToolbarContainer />
    </section>
  </main>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useWindowStore } from "@/state/store";
import ToolbarContainer from "@/components/ToolbarContainer.vue";
import Win98Window from "@/components/base/Win98Window.vue";
import Win98Icon from "@/components/base/Win98Icon.vue";
import Win98IconContainer from "@/components/base/Win98IconContainer.vue";
import WelcomeWindowContent from "@/components/window/WelcomeWindowContent.vue";
import EarthWindowContent from "@/components/window/EarthWindowContent.vue";
import SocialLinksWindowContent from "@/components/window/SocialLinksWindowContent.vue";
import type { WindowContentComponent } from "@/state/windowTypes";

const contentComponentMap: Record<WindowContentComponent, Component> = {
  WelcomeWindowContent,
  EarthWindowContent,
  SocialLinksWindowContent,
};

const store = useWindowStore();
const windows = computed(() => store.windows.filter((w) => !w.minimized));

const desktopArea = ref<HTMLElement | null>(null);

function handleDesktopClick(e: MouseEvent) {
  // Only clear focus if the click is not on an icon
  if (!(e.target as HTMLElement).closest(".win98-icon")) {
    store.setFocusedIconId(null);
  }
}

onMounted(() => {
  // Expose desktopArea globally for window bounds checking
  window.__desktopArea = desktopArea;

  // Clamp windows on resize
  const handleResize = () => {
    if (desktopArea.value) {
      const rect = desktopArea.value.getBoundingClientRect();
      store.clampAllWindowsToDesktop(rect);
    }
  };
  window.addEventListener("resize", handleResize);

  // Optionally, clamp once on mount
  handleResize();

  // Add click listener for desktop focus clearing
  if (desktopArea.value) {
    desktopArea.value.addEventListener("click", handleDesktopClick);
  }

  // Clean up
  onBeforeUnmount(() => {
    window.removeEventListener("resize", handleResize);
    if (desktopArea.value) {
      desktopArea.value.removeEventListener("click", handleDesktopClick);
    }
  });
});
</script>
