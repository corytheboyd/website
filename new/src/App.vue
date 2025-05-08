<template>
  <div class="h-full bg-black">
    <Starscape class="fixed inset-0 w-full h-full z-0" />
    <SolitaireMadness class="fixed inset-0 w-full h-full z-10" />

    <div class="relative z-20 flex flex-col items-center justify-center h-full w-full">
      <div
        class="background-windows-teal w-full h-full max-w-full max-h-full flex flex-col items-center shadow-[0_30px_70px_rgba(0,0,0,0.7)] aspect-[4/3] md:max-w-[1200px] md:max-h-[900px]">
        <WelcomeWindow class="mt-3 mx-3" />

        <SocialIcons class="mt-6" />
        <SocialLinks class="w-auto mr-3 mt-6" />

        <EarthWindow />
        <TaskbarFooter />
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
import Starscape from "./components/custom/Starscape.vue";
import SolitaireMadness from "./components/custom/SolitaireMadness.vue";
</script>

<style>
/* Global styles will be imported from style.css */
</style>
