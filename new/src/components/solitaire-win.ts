export class SolitaireWin extends HTMLElement {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private readonly CARD_WIDTH = 71;
  private readonly CARD_HEIGHT = 96;
  
  // Images
  private iBg!: HTMLImageElement;
  private iCards!: HTMLImageElement;
  private iSpot!: HTMLImageElement;
  private imagesLoaded = 0;
  
  // Animation state
  private goals: number[] = [3, 1, 2, 0];
  private spot = 0;
  private value = 12;
  private vx = -4;
  private vy = 4;
  private cx = 450;
  private cy = 10;
  private decay = 0.2;
  private speed = 1;
  private decaydecay = 1;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.ctx = this.canvas.getContext("2d")!;

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
      :host {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        pointer-events: none;
      }
      canvas {
        width: 100vw;
        height: 100vh;
        max-width: 100vw;
        max-height: 100vh;
        display: block;
        pointer-events: none;
      }
    `;

    // Add elements to shadow DOM
    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(this.canvas);

    // Load images
    this.loadImages();
  }

  private loadImages() {
    const imgLoad = () => {
      this.imagesLoaded--;
      if (this.imagesLoaded === 0) {
        this.start();
      }
    };

    this.imagesLoaded = 3;

    this.iBg = new Image();
    this.iBg.onload = imgLoad;
    this.iBg.src = 'https://i.imgur.com/fPH6QI7.png';

    this.iCards = new Image();
    this.iCards.onload = imgLoad;
    this.iCards.src = 'https://i.imgur.com/XZlSH3r.png';

    this.iSpot = new Image();
    this.iSpot.onload = imgLoad;
    this.iSpot.src = 'https://i.imgur.com/LP5T0IN.png';
  }

  private shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private reset() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw kings and start
    this.goals = this.shuffle([...this.goals]);
    for (let g = 0; g < 4; g++) {
      this.ctx.drawImage(
        this.iCards,
        12 * 71, // Sprite X
        this.goals[g] * 96, // Sprite Y
        71,
        96,
        450 + (g * 80), // on screen X
        10, // on screen Y
        71,
        96
      );
    }

    this.spot = 0;
    this.value = 12;
    this.vx = -4;
    this.vy = 4;
    this.cx = 450;
    this.cy = 10;
    this.decay = 0.2;
  }

  private draw() {
    this.cx += this.vx * this.speed;
    this.cy += this.vy * this.speed;
    this.vy += this.decay * this.decaydecay;

    // Bounce
    if (this.cy >= 600 - 96) {
      this.cy = 600 - 96;
      this.vy = this.vy * -1 * 0.7 + (1.0 - (Math.random() * 2.0));
      if (this.vy > 0.1) {
        this.vy = -1;
      }
    }

    // Next card
    if (this.cx <= -71 || this.cx >= 800) {
      this.spot++;
      if (this.spot >= 4) {
        this.spot = 0;
        this.value--;
      }
      this.decay = 0.3;
      this.vx = 4 * (1 - (Math.random() * 2));
      if (this.vx > 0) {
        this.vx += 1;
      } else {
        this.vx -= 1;
      }
      this.vy = 4 * Math.random();
      this.cx = 450 + (this.spot * 80);
      this.cy = 10;
    }

    this.ctx.drawImage(
      this.iCards,
      this.value * 71, // Sprite X
      this.goals[this.spot] * 96, // Sprite Y
      71,
      96,
      Math.round(this.cx + 0.5), // on screen X
      Math.round(this.cy + 0.5), // on screen Y
      71,
      96
    );
  }

  private runAnimation = () => {
    if (this.value < 0) {
      this.reset();
    }
    this.animationFrameId = requestAnimationFrame(this.runAnimation);
    this.draw();
  };

  public start() {
    this.reset();
    this.runAnimation();
  }

  public stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  disconnectedCallback() {
    this.stop();
  }
}

customElements.define("solitaire-win", SolitaireWin); 
