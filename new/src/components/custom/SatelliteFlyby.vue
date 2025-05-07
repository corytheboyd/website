<template>
  <div ref="container" class="satellite-flyby-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface ModelConfig {
  name: string
  scale: number
  enabled?: boolean
  rotateRate?: number
  initialRotation?: { x: number; y: number; z: number }
  scene?: THREE.Group
}

const container = ref<HTMLDivElement | null>(null)
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let models: ModelConfig[] = [
  { name: 'satellite_1.glb', scale: 0.05, enabled: true },
  { name: 'shiba_inu.glb', scale: 0.3, enabled: true, rotateRate: 1.25 },
  { name: 'red_car.glb', scale: 1.3, enabled: true, rotateRate: 0.25 },
  { name: 'ifruit_computer.glb', scale: 3, rotateRate: 1.25, enabled: true },
  { name: 'pizza.glb', scale: 2.75, enabled: true, rotateRate: 1.25, initialRotation: { x: 1, y: 1, z: 0 } },
]
let enabledModels: ModelConfig[] = []
let modelIndex = 0
let activeModel: THREE.Group | undefined
let animationFrameId: number | undefined
let prevT = 0
let flybyStartTime: number | undefined

const getRectSize = () => {
  if (!container.value) return { w: 0, h: 0 }
  return { w: container.value.offsetWidth, h: container.value.offsetHeight }
}

const handleResize = () => {
  if (!renderer || !container.value) return
  const { w, h } = getRectSize()
  renderer.setSize(w, h, false)
  if (camera) {
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
}

const pickNextModel = () => {
  // Hide all models
  enabledModels.forEach((model) => {
    if (model.scene) model.scene.visible = false
  })
  // Pick the next model in order
  const model = enabledModels[modelIndex]
  activeModel = model.scene
  if (activeModel) activeModel.visible = true
  modelIndex = (modelIndex + 1) % enabledModels.length
  flybyStartTime = performance.now()
}

const animateFlyby = (time: number) => {
  if (activeModel) {
    const duration = 20
    const { w, h } = getRectSize()
    const aspect = w / h
    const vFOV = (camera.fov * Math.PI) / 180
    const viewHeight = 2 * Math.tan(vFOV / 2) * camera.position.z
    const viewWidth = viewHeight * aspect
    const margin = 2.0
    const t = ((time * 0.001) % duration) / duration
    const x = -viewWidth / 2 - margin + t * (viewWidth + 2 * margin)
    const currentModelIndex = (modelIndex - 1 + enabledModels.length) % enabledModels.length
    const model = enabledModels[currentModelIndex]
    const amplitude = -1.5
    const offset = 0.5
    const y = offset + Math.sin(t * Math.PI) * amplitude
    activeModel.position.set(x, y, 0)
    const elapsed = (time - (flybyStartTime || 0)) * 0.001
    const initial = model.initialRotation || { x: 0, y: Math.PI / 2, z: 0 }
    activeModel.rotation.x = initial.x
    activeModel.rotation.y = initial.y
    activeModel.rotation.z = initial.z
    const rate = model.rotateRate !== undefined ? model.rotateRate : 0
    activeModel.rotation.y += rate * elapsed
    activeModel.rotation.z += Math.sin(time * 0.001) * 0.2
    if (t < prevT) {
      pickNextModel()
    }
    prevT = t
  }
  renderer.render(scene, camera)
  animationFrameId = requestAnimationFrame(animateFlyby)
}

const initThree = () => {
  scene = new THREE.Scene()
  const ambient = new THREE.AmbientLight(0xffffff, 0.7)
  scene.add(ambient)
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.set(0, 0, 5)
  camera.lookAt(0, 0, 0)
  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
  if (!container.value) return
  container.value.innerHTML = ''
  container.value.appendChild(renderer.domElement)
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  renderer.domElement.style.imageRendering = 'pixelated'
  renderer.setClearColor(0x000000, 0)
  handleResize()
  const light = new THREE.DirectionalLight(0xffffff, 3.5)
  light.position.set(0, 0, 10)
  scene.add(light)
  // Preload all models
  const loader = new GLTFLoader()
  let loadedCount = 0
  enabledModels = models.filter((m) => m.enabled !== false)
  enabledModels.forEach((model) => {
    loader.load(model.name, (gltf) => {
      const sceneObj = gltf.scene
      sceneObj.visible = false
      sceneObj.scale.set(model.scale, model.scale, model.scale)
      model.scene = sceneObj
      scene.add(sceneObj)
      loadedCount++
      if (loadedCount === enabledModels.length) {
        pickNextModel()
        animateFlyby(performance.now())
      }
    })
  })
  modelIndex = 0
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
.satellite-flyby-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 20;
}
</style> 
