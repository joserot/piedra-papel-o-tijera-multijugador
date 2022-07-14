import { state } from "../../state";
import { Router } from "@vaadin/router";

export function initShareCodePage() {
	class ShareCodePage extends HTMLElement {
		shadow: ShadowRoot;
		userTwoOnline;
		constructor() {
			super();
			this.shadow = this.attachShadow({ mode: "open" });
		}
		connectedCallback() {
			state.subscribe(() => {
				this.userTwoOnline = state.getState().play.play.usertwo.online;

				if (this.userTwoOnline === true) {
					Router.go("/reglas");
				}
			});
			this.render();
		}
		render() {
			let div: any = document.createElement("div");
			let roomId = state.getState().roomId;

			div.innerHTML = `
      <div class="container">
          <p>Compartí el codigo:</p>
          <h2>${roomId}</h2>
          <p>Con tu contrincante</p>
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

       h2{
        font-wight: bold;
          font-size: 2.5rem;
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
	customElements.define("share-code-page", ShareCodePage);
}
