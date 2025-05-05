export class StarBg extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
      :host { display: block; width: 100%; height: 100%; position: absolute; inset: 0; z-index: 0; }
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
    `;
    this.shadowRoot.appendChild(style);
    this.canvas = document.createElement("canvas");
    this.canvas.className = "star-canvas";
    this.shadowRoot.appendChild(this.canvas);
  }
  connectedCallback() {
    this.ctx = this.canvas.getContext("2d");
    this.STAR_COUNT = 80;
    this.stars = [];
    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);
    window.addEventListener("resize", this.resize);
    setTimeout(() => {
      this.resize();
      this.animate();
    }, 100);
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this.resize);
    if (this._animationFrameId) cancelAnimationFrame(this._animationFrameId);
  }
  resize() {
    const parent = this.parentElement;
    if (!parent) return;
    this.width = parent.offsetWidth;
    this.height = parent.offsetHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    // Regenerate stars for new size
    this.stars = [];
    for (let i = 0; i < this.STAR_COUNT; ++i) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        z: Math.random() * 1 + 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }
  animate() {
    this.draw();
    this._animationFrameId = requestAnimationFrame(this.animate);
  }
  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    const now = performance.now() * 0.002;
    for (const star of this.stars) {
      const twinkle = 0.6 + 0.4 * Math.sin(now * star.z + star.phase);
      ctx.globalAlpha = twinkle;
      if (Math.random() < 0.03) ctx.fillStyle = "#88f";
      else if (Math.random() < 0.03) ctx.fillStyle = "#ff8";
      else ctx.fillStyle = "#fff";
      const size = star.z > 1.2 ? 2 : 1;
      ctx.fillRect(Math.round(star.x), Math.round(star.y), size, size);
    }
    ctx.globalAlpha = 1;
  }
}

customElements.define("star-bg", StarBg);
