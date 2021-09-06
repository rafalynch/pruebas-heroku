customElements.define(
  "custom-title",
  class CustomButton extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      shadow.innerHTML = `
        <div class="title">${this.innerHTML}</div>
      `;
      const style = document.createElement("style");
      style.innerHTML = `
        .title {
          font-size: 52px;
          font-weight: 700;
        }
      `;
      shadow.appendChild(style);
    }
  }
);
