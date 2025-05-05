export class Win98Icon extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
      :host { 
        display: inline-block;
        width: 32px;
        height: 32px;
        cursor: pointer;
      }
      img {
        width: 100%;
        height: 100%;
        image-rendering: pixelated;
      }
    `;
    this.shadowRoot.appendChild(style);
    this.container = document.createElement("div");
    this.shadowRoot.appendChild(this.container);
  }

  static get observedAttributes() {
    return ["icon"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "icon" && oldValue !== newValue) {
      this.updateIcon();
    }
  }

  updateIcon() {
    const iconName = this.getAttribute("icon");
    if (iconName) {
      const img = document.createElement("img");
      img.src = `/win98icon/${iconName}.png`;
      img.alt = iconName;
      this.container.innerHTML = "";
      this.container.appendChild(img);
    }
  }

  connectedCallback() {
    this.updateIcon();
  }
}

customElements.define("win98-icon", Win98Icon);
