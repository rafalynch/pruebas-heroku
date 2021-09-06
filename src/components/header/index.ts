customElements.define(
  "custom-header",
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
        <div class="header"></div>
      `;
      const style = document.createElement("style");
      style.innerHTML = `
        .header {
          background-color: #FF8282;
          display: block;
          height: 60px;
        }
      `;
      shadow.appendChild(style);
    }
  }
);
