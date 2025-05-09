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
      <component
        v-for="window in windows"
        :key="window.id"
        :is="componentMap[window.component]"
        :id="window.id"
      />

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
import WelcomeWindow from "@/components/WelcomeWindow.vue";
import EarthWindow from "@/components/EarthWindow.vue";
import SocialLinksWindow from "@/components/SocialLinksWindow.vue";
import type { Component } from "vue";
import type { DesktopWindowComponent } from "@/state/windowTypes";

const componentMap: Record<DesktopWindowComponent, Component> = {
  WelcomeWindow,
  EarthWindow,
  SocialLinksWindow,
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
      component: "WelcomeWindow",
    });
    store.addWindow({
      name: "Earth",
      width: 800,
      height: 600,
      position: { x: 150, y: 150 },
      icon: "/win98icon/globe.png",
      component: "EarthWindow",
    });
    store.addWindow({
      name: "Social Links",
      width: 400,
      height: 300,
      position: { x: 250, y: 250 },
      icon: "/win98icon/network.png",
      component: "SocialLinksWindow",
    });
  }
});
</script>
