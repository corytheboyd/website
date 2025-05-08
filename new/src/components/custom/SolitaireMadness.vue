<template>
  <canvas ref="canvas" width="800" height="600" class="solitaire-canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)

const CARD_WIDTH = 71
const CARD_HEIGHT = 96

// Images
let iBg: HTMLImageElement
let iCards: HTMLImageElement
let iSpot: HTMLImageElement
let imagesLoaded = 0

// Animation state
let goals = [3, 1, 2, 0]
let spot = 0
let value = 12
let vx = -4
let vy = 4
let cx = 450
let cy = 10
let decay = 0.2
let speed = 1
let decaydecay = 1
let animationFrameId: number | null = null

const shuffle = <T,>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const reset = () => {
  if (!ctx.value) return
  ctx.value.clearRect(0, 0, 800, 600)
  goals = shuffle([...goals])
  for (let g = 0; g < 4; g++) {
    ctx.value.drawImage(
      iCards,
      12 * CARD_WIDTH,
      goals[g] * CARD_HEIGHT,
      CARD_WIDTH,
      CARD_HEIGHT,
      450 + g * 80,
      10,
      CARD_WIDTH,
      CARD_HEIGHT
    )
  }
  spot = 0
  value = 12
  vx = -4
  vy = 4
  cx = 450
  cy = 10
  decay = 0.2
}

const draw = () => {
  if (!ctx.value) return
  cx += vx * speed
  cy += vy * speed
  vy += decay * decaydecay

  // Bounce
  if (cy >= 600 - CARD_HEIGHT) {
    cy = 600 - CARD_HEIGHT
    vy = vy * -1 * 0.7 + (1.0 - Math.random() * 2.0)
    if (vy > 0.1) vy = -1
  }

  // Next card
  if (cx <= -CARD_WIDTH || cx >= 800) {
    spot++
    if (spot >= 4) {
      spot = 0
      value--
    }
    decay = 0.3
    vx = 4 * (1 - Math.random() * 2)
    if (vx > 0) vx += 1
    else vx -= 1
    vy = 4 * Math.random()
    cx = 450 + spot * 80
    cy = 10
  }

  ctx.value.drawImage(
    iCards,
    value * CARD_WIDTH,
    goals[spot] * CARD_HEIGHT,
    CARD_WIDTH,
    CARD_HEIGHT,
    Math.round(cx + 0.5),
    Math.round(cy + 0.5),
    CARD_WIDTH,
    CARD_HEIGHT
  )
}

const runAnimation = () => {
  if (value < 0) reset()
  animationFrameId = requestAnimationFrame(runAnimation)
  draw()
}

const start = () => {
  reset()
  runAnimation()
}

const stop = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

const loadImages = () => {
  const imgLoad = () => {
    imagesLoaded--
    if (imagesLoaded === 0) start()
  }
  imagesLoaded = 1
  iCards = new window.Image()
  iCards.onload = imgLoad
  iCards.src = '/solitaire/cards.png'
}

onMounted(() => {
  if (!canvas.value) return
  ctx.value = canvas.value.getContext('2d')!
  loadImages()
})

onUnmounted(() => {
  stop()
})
</script>

<style scoped>
.solitaire-canvas {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  display: block;
  pointer-events: none;
  z-index: 10;
}
</style>
