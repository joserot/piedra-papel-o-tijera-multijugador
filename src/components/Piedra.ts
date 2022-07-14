const url = require("url:../img/piedra.png");

export function initPiedra() {
	class PiedraElement extends HTMLElement {
		constructor() {
			super();
		}
		connectedCallback() {
			this.render();
		}
		render() {
			let shadow = this.attachShadow({ mode: "open" });

			let piedra: any = document.createElement("img");
			piedra.src = url;

			/* STYLES */

			let styles = document.createElement("style");
			styles.innerHTML = `
     img{
     width: 6rem;
      }
      `;

			shadow.appendChild(styles);
			shadow.appendChild(piedra);
		}
	}
	customElements.define("component-piedra", PiedraElement);
}
