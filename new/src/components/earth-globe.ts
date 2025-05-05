import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class EarthGlobe extends HTMLElement {
  private container: HTMLDivElement;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model?: THREE.Group;
  private _animationFrameId?: number;
  private fitCameraToEarth?: () => void;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `:host { display: block; width: 100%; height: 100%; }`;
    this.shadowRoot!.appendChild(style);
    this.container = document.createElement("div");
    this.container.style.width = "100%";
    this.container.style.height = "100%";
    this.container.style.position = "relative";
    this.shadowRoot!.appendChild(this.container);
  }

  connectedCallback(): void {
    this.initThree();
    window.addEventListener("resize", this.handleResize);
  }

  disconnectedCallback(): void {
    window.removeEventListener("resize", this.handleResize);
    if (this._animationFrameId) cancelAnimationFrame(this._animationFrameId);
  }

  private getSquareSize = (): number => {
    return Math.min(this.offsetWidth, this.offsetHeight);
  };

  private handleResize = (): void => {
    const size = this.getSquareSize();
    if (this.renderer) this.renderer.setSize(size, size, false);
    if (this.camera) {
      this.camera.aspect = 1;
      this.camera.updateProjectionMatrix();
    }
    if (this.fitCameraToEarth) this.fitCameraToEarth();
  };

  private initThree(): void {
    const EARTH_ROTATION_SPEED = 0.3;
    let previousTime = 0;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(48.5, 1, 0.1, 2000);
    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 5.5);
    light.position.set(0, 0, 100);
    light.target.position.set(0, 0, 0);
    this.scene.add(light);
    this.scene.add(light.target);
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
    });
    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.handleResize();
    // Style the canvas for pixelation
    this.renderer.domElement.style.imageRendering = "pixelated";

    // Load Earth model
    const loader = new GLTFLoader();
    loader.load("/earth_low_poly.glb", (gltf: GLTF) => {
      this.model = gltf.scene;
      this.scene.add(this.model);
      this.fitCameraToEarth = () => {
        const fov = (this.camera.fov * Math.PI) / 180;
        this.camera.position.set(0, 0, 1.7); // Adjust if needed for better framing
        this.camera.lookAt(0, 0, 0);
        this.camera.updateProjectionMatrix();
      };
      this.handleResize();
      // Animation loop
      const animate = (time: number) => {
        if (this.model) {
          const deltaTime = (time - previousTime) / 1000;
          this.model.rotation.y += deltaTime * EARTH_ROTATION_SPEED;
          previousTime = time;
        }
        this.renderer.render(this.scene, this.camera);
        this._animationFrameId = requestAnimationFrame(animate);
      };
      this._animationFrameId = requestAnimationFrame(animate);
    });
    this.handleResize();
  }
}

customElements.define("earth-globe", EarthGlobe);
