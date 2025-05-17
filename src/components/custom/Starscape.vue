<template>
  <canvas ref="canvas" class="star-canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Star {
  x: number;
  y: number;
  z: number;
  phase: number;
  opacity: number;
  fadeSpeed: number;
}

const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const width = ref(0);
const height = ref(0);
const STAR_COUNT = 80;
const stars = ref<Star[]>([]);
let animationFrameId: number | undefined;

const createStar = (): Star => ({
  x: Math.random() * width.value,
  y: Math.random() * height.value,
  z: Math.random() * 1 + 0.5,
  phase: Math.random() * Math.PI * 2,
  opacity: 1,
  fadeSpeed: 0.005 + Math.random() * 0.008, // Slower fade speed between 0.005 and 0.013
});

const resize = () => {
  if (!canvas.value) return;
  const parent = canvas.value.parentElement;
  if (!parent) return;

  width.value = parent.offsetWidth;
  height.value = parent.offsetHeight;
  canvas.value.width = width.value;
  canvas.value.height = height.value;

  // Regenerate stars for new size
  stars.value = [];
  for (let i = 0; i < STAR_COUNT; ++i) {
    stars.value.push(createStar());
  }
};

const draw = () => {
  if (!ctx.value || !canvas.value) return;

  ctx.value.clearRect(0, 0, width.value, height.value);
  const now = performance.now() * 0.002;

  // Update and draw stars
  for (let i = stars.value.length - 1; i >= 0; i--) {
    const star = stars.value[i];

    // Update opacity
    star.opacity -= star.fadeSpeed;

    // Remove star if fully faded out
    if (star.opacity <= 0) {
      stars.value.splice(i, 1);
      // Add a new star if we're below the target count
      if (stars.value.length < STAR_COUNT) {
        stars.value.push(createStar());
      }
      continue;
    }

    const twinkle = 0.6 + 0.4 * Math.sin(now * star.z + star.phase);
    ctx.value.globalAlpha = twinkle * star.opacity;

    // Use different ASCII characters for variety
    let starChar = "*";
    if (Math.random() < 0.3) starChar = "+";
    else if (Math.random() < 0.3) starChar = "·";
    else if (Math.random() < 0.3) starChar = "×";

    // Randomly select from a few different sizes
    const sizes = ["12px", "16px", "20px", "24px"];
    ctx.value.font = `${
      sizes[Math.floor(Math.random() * sizes.length)]
    } monospace`;
    ctx.value.textAlign = "center";
    ctx.value.textBaseline = "middle";

    if (Math.random() < 0.03) ctx.value.fillStyle = "#88f";
    else if (Math.random() < 0.03) ctx.value.fillStyle = "#ff8";
    else ctx.value.fillStyle = "#fff";

    ctx.value.fillText(starChar, Math.round(star.x), Math.round(star.y));
  }

  ctx.value.globalAlpha = 1;
};

const animateStars = () => {
  draw();
  animationFrameId = requestAnimationFrame(animateStars);
};

onMounted(() => {
  if (!canvas.value) return;
  const context = canvas.value.getContext("2d");
  if (!context) return;

  ctx.value = context;
  window.addEventListener("resize", resize);

  setTimeout(() => {
    resize();
    animateStars();
  }, 100);
});

onUnmounted(() => {
  window.removeEventListener("resize", resize);
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
});
</script>

<style scoped>
.star-canvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: block;
  image-rendering: pixelated;
  background: transparent;
  pointer-events: none;
}
</style>
