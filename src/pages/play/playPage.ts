import { state } from "../../state";
import { Router } from "@vaadin/router";

export function initPlayPage() {
	class PlayPage extends HTMLElement {
		shadow: ShadowRoot;
		constructor() {
			super();
			this.shadow = this.attachShadow({ mode: "open" });
		}
		connectedCallback() {
			state.subscribe(() => {});
			this.render();
		}
		render() {
			//state.updateStatePlay(false, false);

			let div: any = document.createElement("div");

			div.innerHTML = `
      <div class="container">
      <div class="hands-container-two">
                <component-piedra id="piedra-two" class="hidden"></component-piedra>
                <component-papel id="papel-two" class="hidden"></component-papel>
                <component-tijera id="tijera-two" class="hidden"></component-tijera>
            </div>
          <component-counter></component-counter>
          <div class="hands-container">
                <component-piedra id="piedra"></component-piedra>
                <component-papel id="papel"></component-papel>
                <component-tijera id="tijera"></component-tijera>
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

    .hands-container{
      position: fixed;
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 1rem;
      bottom: 0;
    }

    .hands-container-two{
      position: fixed;
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 1rem;
      top: 0;
      transform: rotate(180deg);
    }

   .hidden{
      display:none;
    }

    .z-index-max{
      position: fixed;
      z-index: 1000;
      width: 100vw;
      height: 100vh;
    }
      `;

			this.shadow.appendChild(style);
			this.shadow.appendChild(div);

			/*********************Functions*************************/

			const choicePlay = () => {
				const piedra = div.querySelector("#piedra");
				const papel = div.querySelector("#papel");
				const tijera = div.querySelector("#tijera");
				const container = div.querySelector(".container");

				piedra.addEventListener("click", (e) => {
					papel.classList.add("hidden");
					tijera.classList.add("hidden");
					const block = document.createElement("div");
					block.classList.add("z-index-max");
					container.appendChild(block);
					state.updatePlay("piedra");
				});

				papel.addEventListener("click", (e) => {
					piedra.classList.add("hidden");
					tijera.classList.add("hidden");
					const block = document.createElement("div");
					block.classList.add("z-index-max");
					container.appendChild(block);
					state.updatePlay("papel");
				});

				tijera.addEventListener("click", (e) => {
					papel.classList.add("hidden");
					piedra.classList.add("hidden");
					const block = document.createElement("div");
					block.classList.add("z-index-max");
					container.appendChild(block);
					state.updatePlay("tijera");
				});
			};

			const showPlays = () => {
				const piedraTwo = div.querySelector("#piedra-two");
				const papelTwo = div.querySelector("#papel-two");
				const tijeraTwo = div.querySelector("#tijera-two");
				const owner = state.getState().play.owner;
				const userId = state.getState().userId;

				if (owner === userId) {
					const playUserTwo = state.getState().play.play.usertwo.choice;

					if (playUserTwo === "piedra") {
						piedraTwo.classList.remove("hidden");
					}

					if (playUserTwo === "papel") {
						papelTwo.classList.remove("hidden");
					}

					if (playUserTwo === "tijera") {
						tijeraTwo.classList.remove("hidden");
					}

					if (playUserTwo === "null") {
						return;
					}
				} else {
					const playUserOne = state.getState().play.play.userone.choice;

					if (playUserOne === "piedra") {
						piedraTwo.classList.remove("hidden");
					}

					if (playUserOne === "papel") {
						papelTwo.classList.remove("hidden");
					}

					if (playUserOne === "tijera") {
						tijeraTwo.classList.remove("hidden");
					}

					if (playUserOne === "null") {
						return;
					}
				}
			};

			const deleteCounter = () => {
				const counter = div.querySelector("component-counter");
				counter.classList.add("hidden");
			};

			const whoWin = () => {
				const playUserOne = state.getState().play.play.userone.choice;
				const playUserTwo = state.getState().play.play.usertwo.choice;

				state.whoWin(playUserOne, playUserTwo);
			};

			const goToResult = () => {
				setTimeout(() => {
					Router.go("/resultado");
				}, 5000);
			};

			const timer = () => {
				let counterInterval = setTimeout(() => {
					deleteCounter();
					showPlays();
					whoWin();
					goToResult();
				}, 6000);
			};

			choicePlay();
			timer();
		}
	}
	customElements.define("play-page", PlayPage);
}
