import { state } from "../state";
import { Router } from "@vaadin/router";

export function initLogInForm() {
	class LogInFormElement extends HTMLElement {
		constructor() {
			super();
		}
		connectedCallback() {
			this.render();
		}
		render() {
			let shadow = this.attachShadow({ mode: "open" });

			let div: any = document.createElement("div");

			div.innerHTML = `
      <form>
          <input type="email" placeholder="Email" name="email" />
          <input type="submit" value="Iniciar Sesion"  />
      </form>
      `;

			/* STYLES */

			let styles = document.createElement("style");
			styles.innerHTML = `
        form{
          display: flex;
          justify-content:center;
          align-items: center;
          flex-direction: column;
          width: 100%;
          gap: 0.5rem;
        }

        input{
          width: 100%;
          height: 2rem;
          border-radius: 10px;
          padding: 0.3rem;
        }

        input[type="submit"]{
          background-color: #006CFC;
          color: #fff;
          border: thin solid #fff;
          font-family: "Open Sans", sans-serif;
          font-weight: bold;
          padding: 0.5rem;
          height: 2.5rem;
        }
      `;

			shadow.appendChild(styles);
			shadow.appendChild(div);

			/********************FUNCTIONS *************************/

			const processForm = () => {
				const $form = div.querySelector("form");

				$form.addEventListener("submit", async (e) => {
					await e.preventDefault();
					let email = await e.target.email.value;

					if (email.length === 0) return false;

					await state.logIn(email);
					await Router.go("/iniciar-room");
				});
			};

			processForm();
		}
	}
	customElements.define("component-login-form", LogInFormElement);
}
