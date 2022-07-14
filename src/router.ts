import { Router } from "@vaadin/router";

const router = new Router(document.getElementById("root"));
router.setRoutes([
	{ path: "/", component: "welcome-page" },
	{ path: "/registro", component: "signin-page" },
	{ path: "/iniciar-sesion", component: "login-page" },
	{ path: "/iniciar-room", component: "select-room-page" },
	{ path: "/room-codigo", component: "share-code-page" },
	{ path: "/reglas", component: "rules-page" },
	{ path: "/espera", component: "wait-page" },
	{ path: "/juego", component: "play-page" },
	{ path: "/resultado", component: "result-page" },
]);
