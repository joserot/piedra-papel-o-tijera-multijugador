import { db } from "./rtdb";
import { ref, onValue } from "firebase/database";
import { connect } from "http2";

// const API_BASE_URL = "http://localhost:4500";
const API_BASE_URL = "https://piedra-papel-o-tijera-online.herokuapp.com";

type Jugado = "piedra" | "papel" | "tijera" | "null";
type Result = "userOneWin" | "userTwoWin" | "tie";

export const state = {
	data: {
		email: "",
		name: "",
		userId: "",
		roomId: "",
		rtdbRoomId: "",
		lastWin: "",
		isLoading: false,
		play: [],
		history: [],
	},
	listeners: [],
	getState() {
		return this.data;
	},
	setState(newState) {
		this.data = newState;
		for (const cb of this.listeners) {
			cb();
		}
		console.log(this.getState());
	},
	initState() {
		const cs = this.getState();
	},
	subscribe(callback) {
		this.listeners.push(callback);
	},
	async listenRoom() {
		const cs = await this.getState();
		const roomRef = await ref(db, "rooms/" + cs.rtdbRoomId);

		await onValue(roomRef, (snap) => {
			const data = snap.val();
			cs.play = data;
			this.setState(cs);
		});
	},
	async signIn(name, email) {
		const cs = await this.getState();

		let res = await fetch(API_BASE_URL + "/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email,
				name,
			}),
		});

		let data = await res.json();

		cs.userId = await data.id;
		cs.name = await data.name;
		cs.email = await data.email;

		await this.setState(cs);
	},
	async logIn(email) {
		const cs = await this.getState();

		let res = await fetch(API_BASE_URL + "/auth", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email,
			}),
		});

		let data = await res.json();

		cs.userId = await data.id;
		cs.name = await data.name;
		cs.email = await data.email;

		await this.setState(cs);
	},
	async handleRoom(room) {
		if (room.length === 0) {
			await this.createRoom();
			return false;
		}

		await this.connectRoom(room);
	},
	async createRoom() {
		const cs = this.getState();

		let res = await fetch(API_BASE_URL + "/rooms", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				userId: cs.userId,
			}),
		});

		let data = await res.json();
		cs.roomId = await data.id;
		await this.setState(cs);

		await this.connectRoom(data.id);
	},
	async connectRoom(room) {
		const cs = await this.getState();

		let res = await fetch(
			API_BASE_URL + "/rooms/" + room + "?userId=" + cs.userId,
			{},
		);

		let data = await res.json();

		if (data.message === "room full") {
			alert(`La Room ${room} está llena`);
			return false;
		}

		cs.roomId = await room;
		(await data.history) ? (cs.history = data.history) : null;
		(await data.rtdbRoomId) ? (cs.rtdbRoomId = data.rtdbRoomId) : null;

		await this.setState(cs);
		await this.listenRoom();
	},
	async updateStatePlay(online: boolean, start: boolean) {
		const cs = this.getState();

		let res = await fetch(API_BASE_URL + "/state", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: cs.name,
				online: online,
				start: start,
				rtdbId: cs.rtdbRoomId,
				roomId: cs.roomId,
				userId: cs.userId,
			}),
		});

		let data = await res.json();
	},
	async updatePlay(choice: Jugado) {
		const cs = this.getState();

		let res = await fetch(API_BASE_URL + "/play", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				choice: choice,
				rtdbId: cs.rtdbRoomId,
				roomId: cs.roomId,
				userId: cs.userId,
			}),
		});

		let data = await res.json();
	},
	whoWin(userOnePlay: Jugado, userTwoPlay: Jugado) {
		let result: Result = "tie";
		const cs = this.getState();

		if (userOnePlay === userTwoPlay) {
			result = "tie";
		} else if (userOnePlay === "null" && userTwoPlay !== "null") {
			result = "userTwoWin";
		} else if (userTwoPlay === "null" && userOnePlay !== "null") {
			result = "userOneWin";
		} else if (userOnePlay === "piedra" && userTwoPlay === "papel") {
			result = "userTwoWin";
		} else if (userOnePlay === "piedra" && userTwoPlay === "tijera") {
			result = "userOneWin";
		} else if (userOnePlay === "papel" && userTwoPlay === "piedra") {
			result = "userOneWin";
		} else if (userOnePlay === "papel" && userTwoPlay === "tijera") {
			result = "userTwoWin";
		} else if (userOnePlay === "tijera" && userTwoPlay === "piedra") {
			result = "userTwoWin";
		} else if (userOnePlay === "tijera" && userTwoPlay === "papel") {
			result = "userOneWin";
		}

		cs.lastWin = result;
		this.setState(cs);

		this.updateHistory(result);
	},
	async updateHistory(result) {
		const cs = this.getState();

		let res = await fetch(API_BASE_URL + "/history", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				result: result,
				roomId: cs.roomId,
			}),
		});

		let data = await res.json();

		console.log("data:", data.history);

		cs.history = await data.history;
		await this.setState(cs);
	},
	setLoading(value: boolean) {
		const cs = this.getState();

		if (value === true) {
			cs.isLoading = true;
		} else {
			cs.isLoading = false;
		}
		this.setState(cs);
	},
};
