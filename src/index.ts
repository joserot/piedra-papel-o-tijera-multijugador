import "./router";
import { state } from "./state";
//Components
import { initButton } from "./components/Button";
import { initText } from "./components/Text";
import { initPiedra } from "./components/Piedra";
import { initPapel } from "./components/Papel";
import { initTijera } from "./components/Tijera";
import { initCounter } from "./components/Counter";
import { initSignInForm } from "./components/SignInForm";
import { initLogInForm } from "./components/LogInForm";
import { initSelectRoomForm } from "./components/SelectRoomForm";
//Pages
import { initWelcomePage } from "./pages/welcome/welcomePage";
import { initRulesPage } from "./pages/rules/rulesPage";
import { initSignInPage } from "./pages/signIn/signInPage";
import { initLogInPage } from "./pages/LogIn/LogInPage";
import { initSelectRoomPage } from "./pages/select-room/selectRoomPage";
import { initShareCodePage } from "./pages/share-code/shareCodePage";
import { initWaitPage } from "./pages/wait/waitPage";
import { initPlayPage } from "./pages/play/playPage";
import { initResultPage } from "./pages/result/resultPage";
import { initLoader } from "./components/Loader";

const initApp = (params: Element | null) => {
	//State
	state.initState();
	// Pages
	initWelcomePage();
	initRulesPage();
	initSignInPage();
	initLogInPage();
	initSelectRoomPage();
	initShareCodePage();
	initWaitPage();
	initPlayPage();
	initResultPage();
	// Components
	initButton();
	initText();
	initPiedra();
	initPapel();
	initTijera();
	initCounter();
	initSignInForm();
	initLogInForm();
	initSelectRoomForm();
	initLoader();
};

(function () {
	const root = document.getElementById("root");
	initApp(root);
})();
