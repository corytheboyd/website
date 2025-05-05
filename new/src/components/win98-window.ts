export class Win98Window extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const windowDiv = document.createElement("div");
    windowDiv.className = "window";
    // Title bar
    const titleBar = document.createElement("div");
    titleBar.className = "title-bar";
    // Optional icon
    const icon = document.createElement("img");
    icon.className = "icon";
    icon.src = "/win98icon/app_win-0.png";
    icon.alt = "";
    titleBar.appendChild(icon);
    // Title text
    const title = document.createElement("span");
    title.className = "title";
    title.textContent = this.getAttribute("title") || "Window";
    titleBar.appendChild(title);
    // Window controls
    const controls = document.createElement("span");
    controls.className = "window-controls";
    controls.innerHTML = `
      <button class="title-bar-button" title="Minimize">_</button>
      <button class="title-bar-button" title="Maximize">□</button>
      <button class="title-bar-button" title="Close">×</button>
    `;
    titleBar.appendChild(controls);
    windowDiv.appendChild(titleBar);
    // Content
    const content = document.createElement("div");
    content.className = "window-body";
    // Slot for children
    const slot = document.createElement("slot");
    content.appendChild(slot);
    windowDiv.appendChild(content);
    this.shadowRoot!.appendChild(windowDiv);
  }
}

customElements.define("win98-window", Win98Window);
