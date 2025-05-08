<template>
  <div ref="container"></div>
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
let earthRadius = 0.2

// Model orbit radius around earth
const ORBIT_RADIUS = 1.2

// Scale multipliers for flyby model
const FLYBY_MIN_SCALE_MULTIPLIER = 1.5;
const FLYBY_MAX_SCALE_MULTIPLIER = 0.25;

// Orbit speed multiplier (higher = faster orbit)
const FLYBY_ORBIT_SPEED = 5;

// Controls how much of the world is visible vertically (smaller = more zoomed in)
const GLOBE_VIEW_HEIGHT = 1.75;

const FLYBY_MODELS = [
  { name: 'chicken.glb', scale: 0.005, rotateRate: 1, yOffset: 0 },
  { name: 'shiba_inu.glb', scale: 0.3, rotateRate: 1, yOffset: -0.33 },
  { name: 'red_car.glb', scale: 0.5, rotateRate: 1, yOffset: 0 },
  { name: 'ifruit_computer.glb', scale: 1, rotateRate: 1, yOffset: 0 },
  { name: 'pizza.glb', scale: 1, rotateRate: 1, initialRotation: { x: 1, y: 1, z: 0 }, yOffset: 0 },
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
    // Sane orthographic frustum: fixed vertical, horizontal based on aspect
    const aspect = w / h;
    camera.top = GLOBE_VIEW_HEIGHT / 2;
    camera.bottom = -GLOBE_VIEW_HEIGHT / 2;
    camera.right = (GLOBE_VIEW_HEIGHT * aspect) / 2;
    camera.left = -(GLOBE_VIEW_HEIGHT * aspect) / 2;
    camera.near = -100;
    camera.far = 100;
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }
}

const pickNextFlyby = () => {
  flybyIndex = (flybyIndex + 1) % flybyModels.length;
  // Set all models to invisible except the new active one
  flybyModels.forEach((fm, idx) => {
    fm.model.visible = (idx === flybyIndex);
  });
}

const animate = (time: number) => {
  // Earth rotation
  if (earth) {
    earth.rotation.y += 0.001; // Small, fixed increment per frame
  }
  // Flyby animation (orbit around 0,0,0)
  if (flybyModels.length > 0) {
    const duration = 20
    const t = ((time * 0.001 * FLYBY_ORBIT_SPEED) % duration) / duration
    const angle = t * Math.PI * 2
    const active = flybyModels[flybyIndex]

    // Orbit in XZ plane around (0,0,0) with shared orbitRadius
    const x = Math.cos(-angle) * ORBIT_RADIUS
    const z = Math.sin(-angle) * ORBIT_RADIUS
    const y = active.config.yOffset !== undefined ? active.config.yOffset : 0;
    active.model.position.set(x, y, z)

    // Constant rotation around its own Y axis
    if (active.model.userData._init === undefined) {
      const initial = active.config.initialRotation || { x: 0, y: 0, z: 0 };
      active.model.rotation.x = initial.x;
      active.model.rotation.z = initial.z;
      active.model.userData._init = true;
    }

    const spinRate = (active.config.rotateRate !== undefined ? active.config.rotateRate : 1) * 0.01;
    active.model.rotation.y += spinRate;

    // Dynamic scale: largest at center (x=0, z=orbitRadius, angle=π/2), smallest behind (x=0, z=-orbitRadius, angle=3π/2)
    const minScale = active.config.scale * FLYBY_MIN_SCALE_MULTIPLIER
    const maxScale = active.config.scale * FLYBY_MAX_SCALE_MULTIPLIER
    const scaleFactor = minScale + (maxScale - minScale) * (1 + Math.sin(angle)) / 2
    active.model.scale.set(scaleFactor, scaleFactor, scaleFactor)

    // Switch to next model when angle wraps from >π to ≤π (i.e., at the back)
    const prevAngle = ((prevTime * 0.001 * FLYBY_ORBIT_SPEED) % duration) / duration * Math.PI * 2
    if (prevAngle > Math.PI && angle <= Math.PI) {
      pickNextFlyby()
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
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })

  if (!container.value) return
  container.value.innerHTML = ''
  container.value.appendChild(renderer.domElement)

  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  renderer.domElement.style.imageRendering = 'pixelated'
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
    // orbitRadius = earthRadius + 0.25;

    // Load all flyby models, then start animation deterministically
    const loadPromises = FLYBY_MODELS.map((config) => {
      return new Promise((resolve) => {
        loader.load(config.name, (gltf2) => {
          const model = gltf2.scene;
          model.visible = false;
          model.scale.set(config.scale, config.scale, config.scale);
          scene.add(model);
          resolve({ model, config });
        });
      });
    });
    Promise.all(loadPromises).then((models) => {
      flybyModels = models as { model: THREE.Group, config: any }[];
      flybyIndex = 0;
      flybyModels.forEach((fm, idx) => {
        fm.model.visible = (idx === flybyIndex);
      });
      animationFrameId = requestAnimationFrame(animate);
    });
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
