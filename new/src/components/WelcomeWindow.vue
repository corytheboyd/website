<template>
  <Win98Window title="Welcome" class="mt-3 mx-3">
    <div class="flex flex-row space-x-3 items-center">
      <PictureFrame class="w-24" />
      <div class="flex flex-col space-y-2">
        <p>
          Hello, my name is <b>Cory Boyd</b>, and welcome to my personal
          website.
        </p>
        <p>To learn more about me, click on the below hyperlinks.</p>
      </div>
    </div>
  </Win98Window>
</template>

<script setup lang="ts">
import Win98Window from './base/Win98Window.vue'
import PictureFrame from './custom/PictureFrame.vue'
</script>
