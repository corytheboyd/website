<template>
  <div class="status-bar">
    <p class="status-bar-field flex items-center justify-center">
      {{ currentTime }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const currentTime = ref("");

function updateTime() {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

let timer;

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>
