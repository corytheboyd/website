<template>
  <div class="fixed inset-0 z-20 flex items-center justify-center">
    <main
      :class="[
        'background-windows-teal',
        'relative',
        // MOBILE VIEW: FULL SCREEN
        'h-full w-full',
        // DESKTOP VIEW: CENTERED 4:3 SCREEN
        'md:mx-5 md:aspect-4/3 md:h-auto md:max-h-full md:max-w-screen-lg',
      ]"
    >
      <Win98Window
        v-for="window in windows"
        :key="window.id"
        :id="window.id"
        :title="window.name"
        :width="window.width"
        :height="window.height"
        :position="window.position"
      >
        <component :is="contentComponentMap[window.component]" />
      </Win98Window>

      <SocialDesktopIcons />
      <TaskbarFooter />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useWindowStore } from "@/state/store";
import TaskbarFooter from "@/components/TaskbarFooter.vue";
import SocialDesktopIcons from "@/components/SocialDesktopIcons.vue";
import Win98Window from "@/components/base/Win98Window.vue";
import WelcomeWindowContent from "@/components/WelcomeWindowContent.vue";
import EarthWindowContent from "@/components/EarthWindowContent.vue";
import SocialLinksWindowContent from "@/components/SocialLinksWindowContent.vue";
import type { Component } from "vue";
import type { WindowContentComponent } from "@/state/windowTypes";

const contentComponentMap: Record<WindowContentComponent, Component> = {
  WelcomeWindowContent,
  EarthWindowContent,
  SocialLinksWindowContent,
};

const store = useWindowStore();
const windows = computed(() => store.windows);

onMounted(() => {
  // Add default windows if none exist
  if (store.windows.length === 0) {
    store.addWindow({
      name: "Welcome",
      width: 400,
      height: 100,
      position: { x: 50, y: 50 },
      icon: "/win98icon/windows-4.png",
      component: "WelcomeWindowContent",
    });
    store.addWindow({
      name: "Earth",
      width: 800,
      height: 600,
      position: { x: 150, y: 150 },
      icon: "/win98icon/globe.png",
      component: "EarthWindowContent",
    });
    store.addWindow({
      name: "Social Links",
      width: 400,
      height: 300,
      position: { x: 250, y: 250 },
      icon: "/win98icon/network.png",
      component: "SocialLinksWindowContent",
    });
  }
});
</script>
