import { state } from "../../state";
import { Router } from "@vaadin/router";

export function initWaitPage() {
	class WaitPage extends HTMLElement {
		shadow: ShadowRoot;
		userOneStart;
		userTwoStart;
		constructor() {
			super();
			this.shadow = this.attachShadow({ mode: "open" });
		}
		connectedCallback() {
			state.subscribe(() => {
				this.userOneStart = state.getState().play.play.userone.start;
				this.userTwoStart = state.getState().play.play.usertwo.start;

				if (this.userOneStart === true && this.userTwoStart === true) {
					Router.go("/juego");
					return false;
				}
			});

			this.render();
		}
		render() {
			let userOneReady = state.getState().play.play.userone.start;
			let userTwoReady = state.getState().play.play.usertwo.start;

			if (userOneReady === true && userTwoReady === true) {
				Router.go("/juego");
				return false;
			}

			let div: any = document.createElement("div");

			div.innerHTML = `
      <div class="container">
          <p>Espera que tu contrincante presione Jugar</p>
            <div class="hands-container">
                <component-piedra></component-piedra>
                <component-papel></component-papel>
                <component-tijera></component-tijera>
            </div>
      </div>
      `;

			/*********************STYLES *************************/

			const style = document.createElement("style");
			style.innerHTML = `
      .container{
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
      }

     .container > *{
        margin: 0 auto;
        text-align: center;
       }

       p{
        font-size: 1.5rem;
       }

    .hands-container{
      position: fixed;
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 1rem;
      bottom: 0;
    }
    
      `;

			this.shadow.appendChild(style);
			this.shadow.appendChild(div);
		}
	}
	customElements.define("wait-page", WaitPage);
}
