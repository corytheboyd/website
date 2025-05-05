import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface ModelConfig {
  name: string;
  scale: number;
  enabled?: boolean;
  rotateRate?: number;
  initialRotation?: { x: number; y: number; z: number };
  scene?: THREE.Group;
}

interface Size {
  w: number;
  h: number;
}

export class SatelliteFlyby extends HTMLElement {
  private container: HTMLDivElement;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private models: ModelConfig[];
  private enabledModels: ModelConfig[];
  private modelIndex: number;
  private activeModel?: THREE.Group;
  private _animationFrameId?: number;
  private _prevT: number;
  private flybyStartTime?: number;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `:host { display: block; width: 100%; height: 100%; pointer-events: none; }`;
    this.shadowRoot!.appendChild(style);
    this.container = document.createElement("div");
    this.container.style.width = "100%";
    this.container.style.height = "100%";
    this.container.style.position = "relative";
    this.shadowRoot!.appendChild(this.container);
    this.models = [
      {
        name: "satellite_1.glb",
        scale: 0.05,
        enabled: true,
      },
      {
        name: "shiba_inu.glb",
        scale: 0.3,
        enabled: true,
        rotateRate: 1.25,
      },
      {
        name: "red_car.glb",
        scale: 1.3,
        enabled: true,
        rotateRate: 0.25,
      },
      {
        name: "ifruit_computer.glb",
        scale: 3,
        rotateRate: 1.25,
        enabled: true,
      },
      {
        name: "pizza.glb",
        scale: 2.75,
        enabled: true,
        rotateRate: 1.25,
        initialRotation: { x: 1, y: 1, z: 0 },
      },
    ];
    this.modelIndex = 0;
    this._prevT = 0;
    this.enabledModels = [];
  }

  connectedCallback(): void {
    this.initThree();
    window.addEventListener("resize", this.handleResize);
  }

  disconnectedCallback(): void {
    window.removeEventListener("resize", this.handleResize);
    if (this._animationFrameId) cancelAnimationFrame(this._animationFrameId);
  }

  private getRectSize = (): Size => {
    return { w: this.offsetWidth, h: this.offsetHeight };
  };

  private handleResize = (): void => {
    const { w, h } = this.getRectSize();
    if (this.renderer) this.renderer.setSize(w, h, false);
    if (this.camera) {
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
  };

  private initThree(): void {
    this.scene = new THREE.Scene();
    // Add ambient light for general illumination
    const ambient = new THREE.AmbientLight(0xffffff, 0.7); // Soft white light
    this.scene.add(ambient);
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
    });
    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.handleResize();
    this.renderer.domElement.style.imageRendering = "pixelated";
    this.renderer.setClearColor(0x000000, 0); // transparent background
    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 3.5); // Brighter
    light.position.set(0, 0, 10);
    this.scene.add(light);
    // Preload all models
    const loader = new GLTFLoader();
    let loadedCount = 0;
    // Only load and use enabled models
    this.enabledModels = this.models.filter((m) => m.enabled !== false);
    this.enabledModels.forEach((model) => {
      loader.load(model.name, (gltf: GLTF) => {
        const scene = gltf.scene;
        scene.visible = false;
        scene.scale.set(model.scale, model.scale, model.scale);
        model.scene = scene;
        this.scene.add(scene);
        loadedCount++;
        if (loadedCount === this.enabledModels.length) {
          // Start animation after all models are loaded
          this.pickNextModel();
          this.animateFlyby(performance.now());
        }
      });
    });
    this.modelIndex = 0;
  }

  private pickNextModel(): void {
    // Hide all models
    this.enabledModels.forEach((model) => {
      if (model.scene) model.scene.visible = false;
    });
    // Pick the next model in order
    const model = this.enabledModels[this.modelIndex];
    this.activeModel = model.scene;
    if (this.activeModel) this.activeModel.visible = true;
    this.modelIndex = (this.modelIndex + 1) % this.enabledModels.length;
    // Store the start time for this flyby
    this.flybyStartTime = performance.now();
  }

  private animateFlyby = (time: number): void => {
    if (this.activeModel) {
      // Flyby: move from left to right, reset after offscreen
      const duration = 20; // seconds for a full flyby
      const { w, h } = this.getRectSize();
      // Map t from left to right edge in world units
      // We'll use the camera's frustum at z=0 for width
      const aspect = w / h;
      const vFOV = (this.camera.fov * Math.PI) / 180;
      const viewHeight = 2 * Math.tan(vFOV / 2) * this.camera.position.z;
      const viewWidth = viewHeight * aspect;
      const margin = 2.0; // more time for the object to fly off the right side
      const t = ((time * 0.001) % duration) / duration;
      const x = -viewWidth / 2 - margin + t * (viewWidth + 2 * margin);
      // Get the current model for all properties
      const currentModelIndex =
        (this.modelIndex - 1 + this.enabledModels.length) %
        this.enabledModels.length;
      const model = this.enabledModels[currentModelIndex];
      // Use a fixed arc for all models
      const amplitude = -1.5;
      const offset = 0.5;
      const y = offset + Math.sin(t * Math.PI) * amplitude;
      this.activeModel.position.set(x, y, 0);
      // Calculate elapsed time since flyby started
      const elapsed = (time - (this.flybyStartTime || 0)) * 0.001;
      // Set initial rotation or default
      const initial = model.initialRotation || {
        x: 0,
        y: Math.PI / 2,
        z: 0,
      };
      this.activeModel.rotation.x = initial.x;
      this.activeModel.rotation.y = initial.y;
      this.activeModel.rotation.z = initial.z;
      // Apply continuous rotation
      const rate = model.rotateRate !== undefined ? model.rotateRate : 0;
      this.activeModel.rotation.y += rate * elapsed;
      this.activeModel.rotation.z += Math.sin(time * 0.001) * 0.2;
      // On new pass, pick the next model in order
      if (t < this._prevT) {
        this.pickNextModel();
      }
      this._prevT = t;
    }
    this.renderer.render(this.scene, this.camera);
    this._animationFrameId = requestAnimationFrame(this.animateFlyby);
  };
}

customElements.define("satellite-flyby", SatelliteFlyby);
