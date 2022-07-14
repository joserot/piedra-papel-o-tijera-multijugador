import { state } from "../state";
import { Router } from "@vaadin/router";

export function initSelectRoomForm() {
	class SelectRoomElement extends HTMLElement {
		shadow: ShadowRoot;
		//loading;
		constructor() {
			super();
			this.shadow = this.attachShadow({ mode: "open" });
			//this.loading = state.getState().isLoading;
		}
		connectedCallback() {
			state.subscribe(() => {});
			this.render();
		}
		render() {
			let div: any = document.createElement("div");

			div.innerHTML = `
      <form>
           <select name="room">
           <option value="new">Nueva Room</option>
           <option value="existing">Room Existente</option>
        </select>
        <input class="hidden" type="text" name="roomName" placeholder="Nombre de la room" />
        <input type="submit" value="Siguiente" />
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

        input {
          width: 100%;
          height: 2rem;
          border-radius: 10px;
          padding: 0.3rem;
        }

        select{
          width: 100%;
          height: 3rem;
          border-radius: 10px;
          padding: 1rem;
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

       .hidden{
        display: none;
        }
      `;

			this.shadow.appendChild(styles);
			this.shadow.appendChild(div);

			/********************FUNCTIONS *************************/
			const $form = div.querySelector("form");

			const changeSelect = () => {
				const $select = $form.room;
				const $inputRoomName = $form.roomName;

				$select.addEventListener("change", (e) => {
					if (e.target.value === "existing") {
						$inputRoomName.classList.remove("hidden");
						$inputRoomName.value = "";
					} else if (e.target.value === "new") {
						$inputRoomName.classList.add("hidden");
						$inputRoomName.value = "";
					}
				});
			};

			const processForm = () => {
				$form.addEventListener("submit", async (e) => {
					await e.preventDefault();
					const roomSelect = await e.target.room.value;
					const room = await e.target.roomName.value;
					if (roomSelect === "existing" && room === "") return false;

					await state.handleRoom(room);

					if (roomSelect === "new") {
						await Router.go("/room-codigo");
					} else if (
						roomSelect === "existing" &&
						state.getState().roomId !== ""
					) {
						await Router.go("/reglas");
					}
				});
			};

			changeSelect();
			processForm();
		}
	}
	customElements.define("component-select-room-form", SelectRoomElement);
}
