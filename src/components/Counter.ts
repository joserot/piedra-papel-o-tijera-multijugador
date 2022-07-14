let counterNumber;

export function initCounter() {
	class CounterElement extends HTMLElement {
		constructor() {
			super();
		}
		connectedCallback() {
			this.render();
		}
		render() {
			let shadow = this.attachShadow({ mode: "open" });

			let number = 3;
			let countDown = setInterval(() => {
				number == 0 ? clearInterval(countDown) : (number = number - 1);

				div.querySelector(".counter-number").textContent = number;
			}, 2000);

			let div: any = document.createElement("div");
			div.innerHTML = `
      <div class="counter-container">
        <div class="counter-circle">
        <div class="counter-number">3</div>
      </div>
      </div>
      `;

			/* STYLES */

			let styles = document.createElement("style");
			styles.innerHTML = `
      .counter-container{
        margin: 0 auto;
        width: 10rem;
        height: 10rem;
      }

      .counter-circle{
        width: 100%;
        height: 100%;
        border: 1rem solid #000;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .counter-number{
        font-size: 5rem;
        font-family: "Open Sans", sans-serif; 
      }
      `;

			shadow.appendChild(styles);
			shadow.appendChild(div);
		}
	}
	customElements.define("component-counter", CounterElement);
}
