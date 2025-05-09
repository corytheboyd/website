<template>
  <Win98Window title="Welcome">
    <div class="flex flex-row items-center space-x-3">
      <div class="flex space-x-2">
        <img src="/me_dither.png" class="w-12 rounded shadow" />
        <div>
          <p>
            Hello! I am <b>corytheboyd</b>, and welcome to my Personal Computer.
          </p>
          <br />
          <p>Can you find all of the hidden features? 🔎</p>
        </div>
      </div>
    </div>
  </Win98Window>
</template>

<script setup lang="ts">
import Win98Window from "./base/Win98Window.vue";
</script>
