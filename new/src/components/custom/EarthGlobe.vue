<template>
  <div ref="container" class="earth-globe-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const container = ref<HTMLDivElement | null>(null)
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let model: THREE.Group | undefined
let animationFrameId: number | undefined
let fitCameraToEarth: (() => void) | undefined

const getSquareSize = (): number => {
  if (!container.value) return 0
  return Math.min(container.value.offsetWidth, container.value.offsetHeight)
}

const handleResize = () => {
  if (!renderer || !container.value) return
  const size = getSquareSize()
  renderer.setSize(size, size, false)
  if (camera) {
    camera.aspect = 1
    camera.updateProjectionMatrix()
  }
  if (fitCameraToEarth) fitCameraToEarth()
}

const initThree = () => {
  const EARTH_ROTATION_SPEED = 0.3
  let previousTime = 0
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(48.5, 1, 0.1, 2000)
  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 5.5)
  light.position.set(0, 0, 100)
  light.target.position.set(0, 0, 0)
  scene.add(light)
  scene.add(light.target)
  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
  if (!container.value) return
  container.value.innerHTML = ''
  container.value.appendChild(renderer.domElement)
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  renderer.domElement.style.imageRendering = 'pixelated'
  handleResize()

  // Load Earth model
  const loader = new GLTFLoader()
  loader.load('/earth_low_poly.glb', (gltf) => {
    model = gltf.scene
    scene.add(model)
    fitCameraToEarth = () => {
      camera.position.set(0, 0, 1.7)
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
    }
    handleResize()
    // Animation loop
    const animate = (time: number) => {
      if (model) {
        const deltaTime = (time - previousTime) / 1000
        model.rotation.y += deltaTime * EARTH_ROTATION_SPEED
        previousTime = time
      }
      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }
    animationFrameId = requestAnimationFrame(animate)
  })
  handleResize()
}

onMounted(() => {
  initThree()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>

<style scoped>
.earth-globe-container {
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  min-width: 64px;
  min-height: 64px;
  max-width: 512px;
  max-height: 512px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 
