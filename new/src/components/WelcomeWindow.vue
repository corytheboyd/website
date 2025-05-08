<template>
  <Win98Window title="Welcome" class="mt-3 mx-3">
    <div class="flex flex-row space-x-3 items-center">
      <div class="flex space-x-2">
        <img src="/me_dither.png" class="w-12 rounded shadow" />
        <div>
          <p>
            Hello! I am <b>corytheboyd</b>, and welcome to my Personal Computer.
          </p>
          <br>
          <p>Can you find all of the hidden features? 🔎</p>
        </div>
      </div>
    </div>
  </Win98Window>
</template>

<script setup lang="ts">
import Win98Window from './base/Win98Window.vue'
</script>
