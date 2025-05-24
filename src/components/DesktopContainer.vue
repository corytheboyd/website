<template>
  <main
    ref="desktopArea"
    class="relative z-20 m-auto flex w-full flex-col items-center justify-center select-none"
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
        <component
          :is="contentComponentMap[window.component]"
          :window-id="window.id"
        />
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

    <section class="w-full" ref="toolbarArea">
      <ToolbarContainer />
    </section>
  </main>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useWindowStore } from "@/state/store.ts";
import ToolbarContainer from "@/components/ToolbarContainer.vue";
import Win98Window from "@/components/base/Win98Window.vue";
import Win98Icon from "@/components/base/Win98Icon.vue";
import Win98IconContainer from "@/components/base/Win98IconContainer.vue";
import WelcomeWindowContent from "@/components/window/WelcomeWindowContent.vue";
import EarthWindowContent from "@/components/window/EarthWindowContent.vue";
import SocialLinksWindowContent from "@/components/window/SocialLinksWindowContent.vue";
import RunWindowContent from "@/components/window/RunWindowContent.vue";
import MSDOSPromptWindowContent from "@/components/window/MSDOSPromptWindowContent.vue";
import type { WindowContentComponent } from "@/state/windowTypes.ts";

const contentComponentMap: Record<WindowContentComponent, Component> = {
  WelcomeWindowContent,
  EarthWindowContent,
  SocialLinksWindowContent,
  RunWindowContent,
  MSDOSPromptWindowContent,
};

const store = useWindowStore();
const windows = computed(() => store.windows.filter((w) => !w.minimized));

const desktopArea = ref<HTMLElement | null>(null);
const toolbarArea = ref<HTMLElement | null>(null);

function handleDesktopClick(e: MouseEvent) {
  // Only clear focus if the click is not on an icon or window
  if (
    !(e.target as HTMLElement).closest(".win98-icon") &&
    !(e.target as HTMLElement).closest(".window")
  ) {
    store.setFocusedIconId(null);
    store.setFocusedWindowId(null);
  }
}

onMounted(() => {
  // Expose desktopArea and toolbarArea globally for window bounds checking
  window.__desktopArea = desktopArea;
  window.__toolbarArea = toolbarArea;

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

  // Global keyboard shortcuts
  const handleGlobalKey = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return;
    const active = document.activeElement;
    if (
      active &&
      (active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        (active as HTMLElement).isContentEditable)
    )
      return;
    if (e.key === "s") {
      store.setStartMenuOpen(true);
      e.preventDefault();
    } else if (e.key === "r" && store.startMenuOpen) {
      // Open Run window
      store.addWindow({
        name: "Run",
        width: 370,
        height: 160,
        resizable: false,
        position: { x: 40, y: 40 },
        icon: "/win98icon/application_hourglass-0.png",
        component: "RunWindowContent",
      });
      store.setStartMenuOpen(false);
      e.preventDefault();
    } else if (e.key === "Escape" && store.startMenuOpen) {
      store.setStartMenuOpen(false);
      e.preventDefault();
    }
  };
  window.addEventListener("keydown", handleGlobalKey);

  // Clean up
  onBeforeUnmount(() => {
    window.removeEventListener("resize", handleResize);
    if (desktopArea.value) {
      desktopArea.value.removeEventListener("click", handleDesktopClick);
    }
    window.removeEventListener("keydown", handleGlobalKey);
  });
});
</script>
