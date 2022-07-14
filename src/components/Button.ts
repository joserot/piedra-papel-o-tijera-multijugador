export function initButton() {
	class ButtonElement extends HTMLElement {
		constructor() {
			super();
		}
		connectedCallback() {
			this.render();
		}
		render() {
			const content = this.textContent;

			let shadow = this.attachShadow({ mode: "open" });

			let button: any = document.createElement("button");
			button.classList.add("btn");
			button.innerText = content;

			/* STYLES */

			let styles = document.createElement("style");
			styles.innerHTML = `
     .btn{
        background-color: #006CFC;
        border: thin solid #fff;
        font-size: 3rem;
        font-family: "Open Sans", sans-serif;
        color: #fff;
        border-radius: 10px;
        padding: 1rem;
      }
      `;

			shadow.appendChild(styles);
			shadow.appendChild(button);
		}
	}
	customElements.define("component-button", ButtonElement);
}
