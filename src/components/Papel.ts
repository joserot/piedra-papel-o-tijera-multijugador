const url = require("url:../img/papel.png");

export function initPapel() {
	class PapelElement extends HTMLElement {
		constructor() {
			super();
		}
		connectedCallback() {
			this.render();
		}
		render() {
			let shadow = this.attachShadow({ mode: "open" });

			let papel: any = document.createElement("img");
			papel.src = url;

			/* STYLES */

			let styles = document.createElement("style");
			styles.innerHTML = `
     img{
     width: 7rem;
      }
      `;

			shadow.appendChild(styles);
			shadow.appendChild(papel);
		}
	}
	customElements.define("component-papel", PapelElement);
}
