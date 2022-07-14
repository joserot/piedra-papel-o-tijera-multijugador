const url = require("url:../img/tijeras.png");

export function initTijera() {
	class TijeraElement extends HTMLElement {
		constructor() {
			super();
		}
		connectedCallback() {
			this.render();
		}
		render() {
			let shadow = this.attachShadow({ mode: "open" });

			let tijera: any = document.createElement("img");
			tijera.src = url;

			/* STYLES */

			let styles = document.createElement("style");
			styles.innerHTML = `
     img{
     width: 6rem;
      }
      `;

			shadow.appendChild(styles);
			shadow.appendChild(tijera);
		}
	}
	customElements.define("component-tijera", TijeraElement);
}
