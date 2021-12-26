import mongoose, { model } from "mongoose";

export interface IUser extends mongoose.Document {
	ID: String;
	osu_username: String;
	replays: String[];
}

const UserSchema: mongoose.Schema = new mongoose.Schema({
	ID: {
		type: String,
		required: [true, "Add ID"],
		unique: true
	},
	osu_username: {
		type: String
	},
	replays: [{ type: String }]
});

export const User: mongoose.Model<IUser> = mongoose.models.User || model("User", UserSchema, "users");
