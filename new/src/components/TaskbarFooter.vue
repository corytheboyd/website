<template>
  <win98-window class="w-full flex flex-row justify-between items-center">
    <button
      class="button flex justify-center items-center gap-1 px-0 mx-0 w-16"
    >
      <img src="/win98icon/windows-4.png" alt="Nyan Cat" class="w-4 h-4" />
      <div class="font-bold">Wow</div>
    </button>
    <div class="status-bar">
      <p class="status-bar-field">
        <img src="/nyan.gif" alt="Nyan Cat" class="w-12" />
      </p>
      <p class="status-bar-field">With Love From 20XX</p>
    </div>
  </win98-window>
</template>

<script setup lang="ts">
import Win98Window from "./base/Win98Window.vue";
</script>
