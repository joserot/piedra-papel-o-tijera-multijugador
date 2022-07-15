import { Router } from "@vaadin/router";
import { state } from "../../state";

export function initWelcomePage() {
	class WelcomePage extends HTMLElement {
		userId;
		name;
		email;
		shadow: ShadowRoot;

		constructor() {
			super();
			this.shadow = this.attachShadow({ mode: "open" });
			this.userId = state.getState().userId;
			this.name = state.getState().name;
			this.email = state.getState().email;
		}
		connectedCallback() {
			state.subscribe(() => {
				this.userId = state.getState().userId;
				this.name = state.getState().name;
				this.email = state.getState().email;
				this.render();
			});
			this.render();
		}
		render() {
			let div: any = document.createElement("div");

			div.innerHTML = `
      <div class="container">
             <h1>Piedra Papel o Tijera</h1>
             <component-button class="log-in" >Iniciar Sesión</component-button>
              <component-button class="sign-in" >Registrarse</component-button>
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
    
    h1{
      font-size: 3.5rem;
      text-align: center;
      color: green;
    }
      `;

			this.shadow.appendChild(style);
			this.shadow.appendChild(div);

			/********************FUNCTIONS *************************/

			const storageSession = () => {
				if (
					this.userId.length > 0 &&
					this.name.length > 0 &&
					this.email.length > 0
				) {
					let message = confirm(`Iniciar sesión como ${this.name}?`);
					if (message === true) {
						Router.go("/iniciar-room");
					} else {
						this.userId.length = "";
						this.name.length = "";
						this.email.length = "";
					}
				}
			};

			const initSession = () => {
				const $logIn = div.querySelector(".log-in");
				const $signIn = div.querySelector(".sign-in");

				div.addEventListener("click", (e) => {
					if (e.target === $logIn) {
						Router.go("/iniciar-sesion");
					} else if (e.target === $signIn) {
						Router.go("/registro");
					}
				});
			};

			storageSession();
			initSession();
		}
	}
	customElements.define("welcome-page", WelcomePage);
}
