<template>
  <div class="h-full bg-black">
    <star-bg class="fixed inset-0 w-full h-full z-0" />
    <SolitaireWin class="fixed inset-0 w-full h-full z-10" />
    <div
      class="relative z-20 flex flex-col items-center justify-center h-full w-full"
    >
      <div
        class="background-windows-teal w-full h-full md:w-[133vh] md:h-[100vh] md:max-w-[1200px] md:max-h-[900px] flex flex-col items-center shadow-[0_30px_70px_rgba(0,0,0,0.7)]"
      >
        <!-- Welcome Window -->
        <welcome-window class="mt-3 mx-3" />

        <!-- Icons and Social Links -->
        <social-icons class="mt-6" />
        <social-links class="w-auto mr-3 mt-6" />

        <div class="flex-1"></div>

        <!-- Earth Window -->
        <earth-window class="w-full mt-6" />

        <!-- Taskbar Footer -->
        <taskbar-footer
          class="w-full flex flex-row justify-between items-center mt-8"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WelcomeWindow from "./components/WelcomeWindow.vue";
import SocialIcons from "./components/SocialIcons.vue";
import SocialLinks from "./components/SocialLinks.vue";
import EarthWindow from "./components/EarthWindow.vue";
import TaskbarFooter from "./components/TaskbarFooter.vue";
import StarBg from "./components/custom/StarBg.vue";
import SolitaireWin from "./components/custom/SolitaireWin.vue";
</script>

<style>
/* Global styles will be imported from style.css */
</style>
