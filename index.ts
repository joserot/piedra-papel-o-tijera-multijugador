import * as express from "express";
import { rtdb, firestore } from "./db";
import { v4 as uuidv4 } from "uuid";
import * as cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use(express.static("dist"));
app.get("*", (req, res) => {
	res.sendFile(__dirname + "/dist/index.html");
});

const dev = process.env.NODE_ENV == "development";
const port = process.env.PORT || 4500;

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

app.get("/env", (req, res) => {
	res.json({
		environment: process.env.NODE_ENV,
	});
});

const userCollection = firestore.collection("users");
const roomCollection = firestore.collection("rooms");

// Crear Usuario
app.post("/signup", async (req, res) => {
	const { email, name } = req.body;

	const searchResponse = await userCollection.where("email", "==", email).get();

	if (searchResponse.empty) {
		const newUserRef = await userCollection.add({
			email,
			name,
		});

		let id = await newUserRef.id;
		const snap = await userCollection.doc(id).get();
		const data = await snap.data();

		await res.json({
			id: id,
			name: data.name,
			email: data.email,
			new: true,
		});
	} else {
		await res.status(400).json({
			message: "user already exist",
		});
	}
});

// Iniciar sesión
app.post("/auth", async (req, res) => {
	const { email } = req.body;

	const searchResponse = await userCollection.where("email", "==", email).get();

	if (searchResponse.empty) {
		await res.status(404).json({
			message: "not found",
		});
	} else {
		let id = await searchResponse.docs[0].id;
		const snap = await userCollection.doc(id).get();
		const data = await snap.data();

		await res.json({
			id: searchResponse.docs[0].id,
			name: data.name,
			email: data.email,
		});
	}
});

// Crear room
app.post("/rooms", async (req, res) => {
	const { userId } = req.body;
	const doc = await userCollection.doc(userId.toString()).get();
	if (doc.exists) {
		const roomRef = await rtdb.ref("rooms/" + uuidv4());

		await roomRef.set({
			play: {
				userone: {
					choice: "null",
					name: "",
					online: false,
					start: false,
				},
				usertwo: {
					choice: "null",
					name: "",
					online: false,
					start: false,
				},
			},
			owner: userId,
		});
		const roomLongId = await roomRef.key;
		const roomId = (await 1000) + Math.floor(Math.random() * 9999);
		await roomCollection.doc(roomId.toString()).set({
			rtdbRoomId: roomLongId,
			participants: 0,
			history: {
				userOne: 0,
				userTwo: 0,
			},
		});
		await res.json({
			id: roomId.toString(),
		});
	} else {
		await res.status(401).json({
			message: "user not exist",
		});
	}
});

// Conectarse a room (limite de dos personas)
app.post("/connect", async (req, res) => {
	const { userId, roomId } = req.body;

	const doc = await userCollection.doc(userId.toString()).get();

	if (doc.exists) {
		const snap = await roomCollection.doc(roomId).get();
		const data = await snap.data();
		if (data.participants < 2) {
			if (data.participants === 0) {
				await roomCollection.doc(roomId.toString()).update({
					participants: data.participants + 1,
					userOne: userId,
				});
				const snapUpadte = await roomCollection.doc(roomId).get();
				const dataUpdate = await snapUpadte.data();
				await res.json(dataUpdate);
			}
			if (data.participants === 1) {
				await roomCollection.doc(roomId.toString()).update({
					participants: data.participants + 1,
					userTwo: userId,
				});
				const snapUpadte = await roomCollection.doc(roomId).get();
				const dataUpdate = await snapUpadte.data();
				await res.json(dataUpdate);
			}
			return false;
		} else if (data.userOne === userId || data.userTwo === userId) {
			const snapUpadte = await roomCollection.doc(roomId).get();
			const dataUpdate = await snapUpadte.data();
			await res.json(dataUpdate);
		} else {
			await res.json({
				message: "room full",
			});
		}
	} else {
		await res.status(401).json({
			message: "user not exist",
		});
	}
});

// Informar estado de usuarios (online y listo)
app.post("/state", async (req, res) => {
	const { name, online, start, rtdbId, roomId, userId } = req.body;

	const snap = await roomCollection.doc(roomId).get();
	const data = await snap.data();

	if (data.userOne === userId) {
		const roomUserRef = await rtdb.ref("rooms/" + rtdbId + "/play/userone");
		await roomUserRef.update({
			name: name,
			online: online,
			start: start,
		});
		await res.json({
			message: "State updated",
		});
	} else if (data.userTwo === userId) {
		const roomUserRef = await rtdb.ref("rooms/" + rtdbId + "/play/usertwo");
		await roomUserRef.update({
			name: name,
			online: online,
			start: start,
		});
		await res.json({
			message: "State updated",
		});
	} else {
		await res.json({
			message: "Error, userId no valido",
		});
	}
});

// Informar juagada de usuarios
app.post("/play", async (req, res) => {
	const { choice, rtdbId, roomId, userId } = req.body;

	const snap = await roomCollection.doc(roomId).get();
	const data = await snap.data();

	if (data.userOne === userId) {
		const roomUserRef = await rtdb.ref("rooms/" + rtdbId + "/play/userone");
		await roomUserRef.update({
			choice,
		});
		await res.json({
			message: "Play updated",
		});
	} else if (data.userTwo === userId) {
		const roomUserRef = await rtdb.ref("rooms/" + rtdbId + "/play/usertwo");
		await roomUserRef.update({
			choice,
		});
		await res.json({
			message: "Play updated",
		});
	} else {
		await res.json({
			message: "Error, userId no valido",
		});
	}
});

// Agregar historial de la Room
app.post("/history", async (req, res) => {
	const { result, roomId } = req.body;

	const snap = await roomCollection.doc(roomId).get();
	const data = await snap.data();
	let dataUpdate;

	if (result === "userOneWin") {
		await roomCollection.doc(roomId.toString()).update({
			history: {
				userOne: data.history.userOne + 1,
				userTwo: data.history.userTwo,
			},
		});
		const snapUpadte = await roomCollection.doc(roomId).get();
		const dataUpdate = await snapUpadte.data();
		await res.json(dataUpdate);
	} else if (result === "userTwoWin") {
		await roomCollection.doc(roomId.toString()).update({
			history: {
				userOne: data.history.userOne,
				userTwo: data.history.userTwo + 1,
			},
		});
		const snapUpadte = await roomCollection.doc(roomId).get();
		const dataUpdate = await snapUpadte.data();
		await res.json(dataUpdate);
	} else if (result === "tie") {
		await roomCollection.doc(roomId.toString()).update({
			history: {
				userOne: data.history.userOne,
				userTwo: data.history.userTwo,
			},
		});
		const snapUpadte = await roomCollection.doc(roomId).get();
		const dataUpdate = await snapUpadte.data();
		await res.json(dataUpdate);
	} else {
		await res.json({
			message: "Result o RoomId no valido",
		});
	}
});
