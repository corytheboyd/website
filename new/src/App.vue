<template>
  <template v-if="!isMobile">
    <Starscape class="fixed inset-0 w-full h-full z-0" />
    <SolitaireMadness class="fixed inset-0 w-full h-full z-10" />
  </template>
  <div class="relative z-20 h-full">
    <!-- DESKTOP -->
    <div
      :class="[
        'background-windows-teal',
        'shadow-[0_30px_70px_rgba(0,0,0,0.7)]',
        'md:aspect-[4/3]',
        'h-full',
        'flex flex-col items-center relative',
        'overflow-hidden',
      ]"
    >
      <WelcomeWindow />
      <SocialIcons />
      <SocialLinks />
      <TaskbarFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import WelcomeWindow from "./components/WelcomeWindow.vue";
import SocialIcons from "./components/SocialIcons.vue";
import SocialLinks from "./components/SocialLinks.vue";
import EarthWindow from "./components/EarthWindow.vue";
import TaskbarFooter from "./components/TaskbarFooter.vue";
import Starscape from "./components/custom/Starscape.vue";
import SolitaireMadness from "./components/custom/SolitaireMadness.vue";

const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});
onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<style>
/* Global styles will be imported from style.css */
</style>
