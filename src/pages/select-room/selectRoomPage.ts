import { state } from "../../state";

export function initSelectRoomPage() {
	class SelectRoomPage extends HTMLElement {
		shadow: ShadowRoot;
		constructor() {
			super();
			this.shadow = this.attachShadow({ mode: "open" });
		}
		connectedCallback() {
			this.render();
		}
		render() {
			let div: any = document.createElement("div");
			let name = state.getState().name;

			div.innerHTML = `
      <div class="container">
          <h2>Hola! ${name}</h2>
          <component-select-room-form></component-select-room-form>
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
        gap: 5rem;
      }

     .container > *{
        margin: 0 auto;
        text-align: center;
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
	customElements.define("select-room-page", SelectRoomPage);
}
