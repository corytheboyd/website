<template>
  <div class="window flex" :class="['absolute bottom-0 left-0 w-full']">
    <!-- START BUTTON -->
    <button
      class="button mx-0 flex w-16 items-center justify-center gap-1 px-0"
    >
      <img src="/win98icon/windows-4.png" alt="Nyan Cat" class="h-4 w-4" />
      <span class="font-bold">Wow</span>
    </button>

    <!-- SPACER -->
    <div class="flex-1"></div>

    <!-- STATUS INFO -->
    <div class="status-bar">
      <p class="status-bar-field">
        <img src="/nyan.gif" alt="Nyan Cat" class="w-12" />
      </p>
      <p class="status-bar-field">With Love From 20XX</p>
    </div>
  </div>
</template>
