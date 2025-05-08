<template>
  <div ref="container" class="earth-and-flyby-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const container = ref<HTMLDivElement | null>(null)
let scene: THREE.Scene
let camera: THREE.OrthographicCamera
let renderer: THREE.WebGLRenderer
let earth: THREE.Group | undefined
let flybyModels: { model: THREE.Group, config: any }[] = []
let animationFrameId: number | undefined
let prevTime = 0
let flybyIndex = 0
let flybyStartTime: number | undefined
let earthRadius = 0.2 // default, will be updated after loading
let orbitRadius = 0.3; // will be set after loading Earth

// Scale multipliers for flyby model
const FLYBY_MIN_SCALE_MULTIPLIER = 0.25;
const FLYBY_MAX_SCALE_MULTIPLIER = 2.0;

const FLYBY_MODELS = [
  // { name: 'satellite_1.glb', scale: 0.05 },
  // { name: 'shiba_inu.glb', scale: 0.3, rotateRate: 1.25 },
  // { name: 'red_car.glb', scale: 1.3, rotateRate: 0.25 },
  { name: 'ifruit_computer.glb', scale: 1, rotateRate: 1.25 },
  // { name: 'pizza.glb', scale: 2.75, rotateRate: 1.25, initialRotation: { x: 1, y: 1, z: 0 } },
]

const getRectSize = () => {
  if (!container.value) return { w: 0, h: 0 }
  return { w: container.value.offsetWidth, h: container.value.offsetHeight }
}

const handleResize = () => {
  if (!renderer || !container.value) return
  const { w, h } = getRectSize()
  renderer.setSize(w, h, false)
  if (camera) {
    // Set orthographic frustum based on aspect ratio and content
    const aspect = w / h
    // Estimate the max orbit radius
    const maxRadius = earthRadius + Math.max(...flybyModels.map(f => f.radius || 0), 0) + 0.5
    let viewSize = maxRadius * 1.5
    camera.left = -viewSize * aspect
    camera.right = viewSize * aspect
    camera.top = viewSize
    camera.bottom = -viewSize
    camera.near = -100
    camera.far = 100
    camera.position.set(0, 0, 10)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }
}

const pickNextFlyby = () => {
  flybyModels.forEach(({ model }) => (model.visible = false))
  if (flybyModels.length === 0) return
  flybyIndex = (flybyIndex + 1) % flybyModels.length
  flybyModels[flybyIndex].model.visible = true
  flybyStartTime = performance.now()
}

const animate = (time: number) => {
  // Earth rotation
  if (earth) {
    earth.position.set(0, 0, 0); // Always center Earth
    earth.rotation.y += 0.008; // Small, fixed increment per frame
  }
  // Flyby animation (orbit around 0,0,0)
  if (flybyModels.length > 0) {
    const duration = 20
    const t = ((time * 0.001) % duration) / duration
    // Offset orbit so model starts directly behind the Earth (x=0, z=-orbitRadius)
    const angle = t * Math.PI * 2 - Math.PI / 2
    const active = flybyModels[flybyIndex]
    if (active) {
      // Orbit in XZ plane around (0,0,0) with shared orbitRadius
      const x = Math.cos(angle) * orbitRadius
      const z = Math.sin(angle) * orbitRadius
      active.model.position.set(x, 0, z)
      // Constant rotation around its own Y axis
      if (active.model.userData._init === undefined) {
        const initial = active.config.initialRotation || { x: 0, y: 0, z: 0 };
        active.model.rotation.x = initial.x;
        active.model.rotation.z = initial.z;
        active.model.userData._init = true;
      }
      // Use rotateRate from config, but scale it down for per-frame increment
      const spinRate = (active.config.rotateRate !== undefined ? active.config.rotateRate : 1) * 0.01;
      active.model.rotation.y += spinRate;
      // Dynamic scale: largest at center (x=0, z=orbitRadius, angle=π/2), smallest behind (x=0, z=-orbitRadius, angle=3π/2)
      const minScale = active.config.scale * FLYBY_MIN_SCALE_MULTIPLIER
      const maxScale = active.config.scale * FLYBY_MAX_SCALE_MULTIPLIER
      // Scale factor: (1 + sin(angle)) / 2 goes from 1 at angle=π/2 to 0 at angle=3π/2
      const scaleFactor = minScale + (maxScale - minScale) * (1 + Math.sin(angle)) / 2
      active.model.scale.set(scaleFactor, scaleFactor, scaleFactor)
      // Always show the model
      active.model.visible = true
      // Switch to next model when angle wraps from >π to ≤π (i.e., at the back)
      const prevAngle = ((prevTime % duration) / duration) * Math.PI * 2 + Math.PI
      if (prevAngle > Math.PI && angle <= Math.PI) {
        pickNextFlyby()
      }
    }
    prevTime = time * 0.001
  }
  renderer.render(scene, camera)
  animationFrameId = requestAnimationFrame(animate)
}

const getModelBoundingRadius = (group: THREE.Group) => {
  // Compute bounding sphere radius for a model
  const box = new THREE.Box3().setFromObject(group)
  return box.getBoundingSphere(new THREE.Sphere()).radius || 0.2
}

const initThree = () => {
  scene = new THREE.Scene()
  camera = new THREE.OrthographicCamera(-2, 2, 2, -2, -100, 100)
  camera.position.set(0, 0, 10)
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
  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.7)
  scene.add(ambient)
  const light = new THREE.DirectionalLight(0xffffff, 5.5)
  light.position.set(0, 0, 100)
  scene.add(light)
  // Load Earth
  const loader = new GLTFLoader()
  loader.load('/earth_low_poly.glb', (gltf) => {
    earth = gltf.scene
    scene.add(earth)
    // Compute earth radius
    earthRadius = getModelBoundingRadius(earth)
    // After Earth, set a shared orbitRadius and load flyby models
    orbitRadius = earthRadius + 0.1; // margin for clearance, adjust as needed
    let loadedCount = 0;
    FLYBY_MODELS.forEach((config) => {
      loader.load(config.name, (gltf2) => {
        const model = gltf2.scene
        model.visible = false
        model.scale.set(config.scale, config.scale, config.scale)
        scene.add(model)
        flybyModels.push({ model, config })
        loadedCount++
        if (loadedCount === FLYBY_MODELS.length) {
          flybyIndex = -1
          pickNextFlyby()
          animationFrameId = requestAnimationFrame(animate)
        }
      })
    })
  })
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
.earth-and-flyby-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 
