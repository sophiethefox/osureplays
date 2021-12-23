import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error("Define the MONGODB_URI environmental variable");
}

const connection = { isConnected: 0 };

async function dbConnect() {
	if (connection.isConnected == 1 || connection.isConnected == 2) {
		return;
	}

	const db = await mongoose.connect(MONGODB_URI);

	connection.isConnected = db.connections[0].readyState;
	console.log(connection.isConnected);
}

export default dbConnect;
