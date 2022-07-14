import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
	apiKey: "AIzaSyAbm1c9oFjCsbNMgHF56KHttdnLTtQeKD0",
	authDomain: "piedra-papel-o-tijera-7e9b3.firebaseapp.com",
	databaseURL:
		"https://piedra-papel-o-tijera-7e9b3-default-rtdb.firebaseio.com",
	projectId: "piedra-papel-o-tijera-7e9b3",
	storageBucket: "piedra-papel-o-tijera-7e9b3.appspot.com",
	messagingSenderId: "670420496637",
	appId: "1:670420496637:web:2c50e278d8f0735581ce94",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
