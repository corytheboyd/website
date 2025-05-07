<template>
  <div ref="container" class="picture-frame-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const container = ref<HTMLDivElement | null>(null)
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationFrameId: number | undefined

const getSquareSize = (): number => {
  if (!container.value) return 0
  return Math.min(container.value.offsetWidth, container.value.offsetHeight)
}

const handleResize = () => {
  if (!renderer || !container.value) return
  const size = getSquareSize()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(size, size, false)
  if (camera) {
    camera.aspect = 1
    camera.updateProjectionMatrix()
  }
}

const initThree = () => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(31, 1, 0.1, 10)
  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
  if (!container.value) return
  container.value.innerHTML = ''
  container.value.appendChild(renderer.domElement)
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  handleResize()

  const textureLoader = new THREE.TextureLoader()
  textureLoader.load('/me_dither.png', (texture: THREE.Texture) => {
    const frameWidth = 0.7
    const frameHeight = 0.7
    // Picture frame border
    const frameGeometry = new THREE.PlaneGeometry(frameWidth + 0.06, frameHeight + 0.06)
    const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x222200 })
    const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial)
    frameMesh.position.set(0, 0, 0)
    scene.add(frameMesh)
    // Picture itself
    const picGeometry = new THREE.PlaneGeometry(frameWidth, frameHeight)
    const picMaterial = new THREE.MeshBasicMaterial({ map: texture })
    const picMesh = new THREE.Mesh(picGeometry, picMaterial)
    picMesh.position.set(0, 0, 0.05)
    scene.add(picMesh)
    // Camera: angled for 3D effect
    camera.position.set(0.3, 0.2, 1.5)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    // Animation loop with sin-based movement
    const animate = (time: number = 0) => {
      const t = time * 0.001
      frameMesh.rotation.y = Math.sin(t) * 0.15
      frameMesh.rotation.x = Math.sin(t * 0.7) * 0.08
      picMesh.rotation.y = frameMesh.rotation.y
      picMesh.rotation.x = frameMesh.rotation.x
      frameMesh.position.z = Math.sin(t * 0.5) * 0.04
      picMesh.position.z = 0.05 + frameMesh.position.z
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
.picture-frame-container {
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  min-width: 64px;
  min-height: 64px;
  max-width: 128px;
  max-height: 128px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 
