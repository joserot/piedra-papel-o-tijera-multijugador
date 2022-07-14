import { state } from "../../state";
import { Router } from "@vaadin/router";

export function initResultPage() {
	class ResultPage extends HTMLElement {
		shadow: ShadowRoot;
		history;
		historyOne;
		historyTwo;
		constructor() {
			super();
			this.shadow = this.attachShadow({ mode: "open" });
			this.history = state.getState().history;
			this.historyOne = this.history.userOne;
			this.historyTwo = this.history.userTwo;
		}
		connectedCallback() {
			state.subscribe(() => {
				this.history = state.getState().history;
				this.historyOne = this.history.userOne;
				this.historyTwo = this.history.userTwo;
				this.render();
			});
			this.render();
		}
		render() {
			let result = state.getState().lastWin;
			let owner = state.getState().play.owner;
			let userId = state.getState().userId;
			let nameUserOne = state.getState().play.play.userone.name;
			let nameUserTwo = state.getState().play.play.usertwo.name;
			let resultText;

			const showResult = () => {
				if (result === "tie") {
					resultText = "Empate";
				}

				if (userId === owner) {
					if (result === "userOneWin") {
						resultText = "Ganaste";
					}

					if (result === "userTwoWin") {
						resultText = "Perdiste";
					}
				} else {
					if (result === "userOneWin") {
						resultText = "Perdiste";
					}

					if (result === "userTwoWin") {
						resultText = "Ganaste";
					}
				}
			};

			showResult();

			const addClassResult = () => {
				const h2 = div.querySelector("h2");

				if (h2.textContent === "Empate") {
					h2.classList.add("empate");
				} else if (h2.textContent === "Ganaste") {
					h2.classList.add("ganaste");
				} else if (h2.textContent === "Perdiste") {
					h2.classList.add("perdiste");
				}
			};

			let div: any = document.createElement("div");
			div.innerHTML = `
			  <div class="container">
			      <h2>${resultText}</h2>
			      <div class="score-container">
			        <h3>Score</h3>
			        <p>${nameUserOne}: ${this.historyOne}</p>
			        <p>${nameUserTwo}: ${this.historyTwo}</p>
			      </div>
			      <component-button>Volver a Jugar</component-button>
			  </div>
			  `;

			addClassResult();

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

  h2{
    font-size: 4.5rem;
    font-family: "Open Sans", sans-serif;
    margin: 0;
  }

  .ganaste{
    color: #6CB46C;
  }

  .perdiste{
    color: #DC5B49;
  }

  .empate{
    color: #006CFC;
  }

  .score-container{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 1rem;
    border: 0.4rem solid #000;
    border-radius: 10px;
    width: 50%;
    margin: 2rem auto;
    padding: 1.5rem;
  }

  h3{
    font-size: 2.5rem;
    font-family: "Open Sans", sans-serif;
    margin: 0;
  }

  p{
    font-size: 1.5rem;
    font-family: "Open Sans", sans-serif;
    margin: 0;
  }
  `;

			this.shadow.appendChild(style);
			this.shadow.appendChild(div);

			/*********************Functions*************************/

			const playAgain = () => {
				const btn = div.querySelector("component-button");

				btn.addEventListener("click", async (e) => {
					await state.updateStatePlay(false, false);
					await Router.go("/reglas");
				});
			};

			playAgain();
		}
	}
	customElements.define("result-page", ResultPage);
}
