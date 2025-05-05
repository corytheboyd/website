import * as THREE from "three";

export class PictureFrame extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.container = document.createElement("div");
    this.container.style.width = "100%";
    this.shadowRoot.appendChild(this.container);
  }
  connectedCallback() {
    this.initThree();
    window.addEventListener("resize", this.handleResize);
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this.handleResize);
    if (this._animationFrameId) cancelAnimationFrame(this._animationFrameId);
  }
  getSquareSize = () => {
    return Math.min(this.offsetWidth, this.offsetHeight);
  };
  handleResize = () => {
    const size = this.getSquareSize();
    if (this.renderer) {
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(size, size, false);
    }
    if (this.camera) {
      this.camera.aspect = 1;
      this.camera.updateProjectionMatrix();
    }
  };
  initThree() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(31, 1, 0.1, 10);
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
    });
    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.handleResize();
    // Add picture frame with me_dither.png
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/me_dither.png", (texture) => {
      const frameWidth = 0.7;
      const frameHeight = 0.7;
      // Picture frame border
      const frameGeometry = new THREE.PlaneGeometry(
        frameWidth + 0.06,
        frameHeight + 0.06
      );
      const frameMaterial = new THREE.MeshBasicMaterial({
        color: 0x222200,
      });
      const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
      frameMesh.position.set(0, 0, 0);
      this.scene.add(frameMesh);
      // Picture itself
      const picGeometry = new THREE.PlaneGeometry(frameWidth, frameHeight);
      const picMaterial = new THREE.MeshBasicMaterial({ map: texture });
      const picMesh = new THREE.Mesh(picGeometry, picMaterial);
      // Increase z-separation to avoid z-fighting
      picMesh.position.set(0, 0, 0.05); // Increased from 0.01 to 0.05
      this.scene.add(picMesh);
      // Camera: angled for 3D effect
      this.camera.position.set(0.3, 0.2, 1.5);
      this.camera.lookAt(0, 0, 0);
      this.camera.updateProjectionMatrix();
      // Animation loop with sin-based movement
      const animate = (time = 0) => {
        const t = time * 0.001;
        // Subtle rotation and position animation
        frameMesh.rotation.y = Math.sin(t) * 0.15;
        frameMesh.rotation.x = Math.sin(t * 0.7) * 0.08;
        picMesh.rotation.y = frameMesh.rotation.y;
        picMesh.rotation.x = frameMesh.rotation.x;
        frameMesh.position.z = Math.sin(t * 0.5) * 0.04;
        // Keep the image always in front of the frame
        picMesh.position.z = 0.05 + frameMesh.position.z;
        this.renderer.render(this.scene, this.camera);
        this._animationFrameId = requestAnimationFrame(animate);
      };
      this._animationFrameId = requestAnimationFrame(animate);
    });
    this.handleResize();
  }
}

customElements.define("picture-frame", PictureFrame);
