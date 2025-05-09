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
      <WelcomeWindow />
      <SocialLinksWindow />
      <SocialDesktopIcons />
      <EarthWindow />

      <TaskbarFooter />
    </main>
  </div>
</template>

<script setup lang="ts">
import TaskbarFooter from "@/components/TaskbarFooter.vue";
import EarthWindow from "@/components/EarthWindow.vue";
import WelcomeWindow from "@/components/WelcomeWindow.vue";
import SocialLinksWindow from "@/components/SocialLinksWindow.vue";
import SocialDesktopIcons from "@/components/SocialDesktopIcons.vue";
</script>
