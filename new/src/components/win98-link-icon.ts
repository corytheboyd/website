export class Win98LinkIcon extends HTMLElement {
  private link: HTMLAnchorElement;
  private iconElem: HTMLElement;
  private labelElem: HTMLDivElement;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: inline-block;
        width: 64px;
        text-align: center;
        font-family: 'Tahoma', 'Geneva', sans-serif;
        font-size: 13px;
        color: white;
        text-shadow: 1px 1px 0 #000, 0 0 2px #000;
        user-select: none;
      }
      a {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-decoration: none;
        color: inherit;
        cursor: pointer;
      }
      .label {
        margin-top: 4px;
        word-break: break-word;
        border: 1px dotted transparent;
        border-radius: 0;
        padding: 2px 4px;
        box-sizing: border-box;
      }
      a:hover .label {
        border-color: #fff;
      }
    `;
    this.shadowRoot!.appendChild(style);
    this.link = document.createElement("a");
    this.link.setAttribute("tabindex", "0");
    this.iconElem = document.createElement("win98-icon");
    this.labelElem = document.createElement("div");
    this.labelElem.className = "label";
    this.link.appendChild(this.iconElem);
    this.link.appendChild(this.labelElem);
    this.shadowRoot!.appendChild(this.link);
  }

  static get observedAttributes(): string[] {
    return ["icon", "label", "href", "target"];
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (name === "icon") {
      this.iconElem.setAttribute("icon", newValue || "");
    } else if (name === "label") {
      this.labelElem.textContent = newValue || "";
    } else if (name === "href") {
      this.link.setAttribute("href", newValue || "");
    } else if (name === "target") {
      if (newValue) {
        this.link.setAttribute("target", newValue);
      } else {
        this.link.removeAttribute("target");
      }
    }
  }

  connectedCallback(): void {
    if (this.hasAttribute("icon")) {
      this.iconElem.setAttribute("icon", this.getAttribute("icon") || "");
    }
    if (this.hasAttribute("label")) {
      this.labelElem.textContent = this.getAttribute("label") || "";
    }
    if (this.hasAttribute("href")) {
      this.link.setAttribute("href", this.getAttribute("href") || "");
    }
    if (this.hasAttribute("target")) {
      this.link.setAttribute("target", this.getAttribute("target") || "");
    } else {
      this.link.removeAttribute("target");
    }
  }
}

customElements.define("win98-link-icon", Win98LinkIcon);
