<template>
  <div class="fixed inset-0 flex items-center justify-center z-20">
    <main
      :class="[
        'background-windows-teal',
        // MOBILE VIEW: FULL SCREEN
        'h-full w-full',
        // DESKTOP VIEW: CENTERED 4:3 SCREEN
        'md:h-auto md:max-w-screen-lg md:max-h-full md:aspect-4/3',
      ]"
    >
      <!--
      <WelcomeWindow />
      <SocialIcons />
      <SocialLinks />
      <TaskbarFooter />
      <EarthWindow />
      -->
    </main>
  </div>
</template>

<script setup lang="ts"></script>
