import mongoose, { model } from "mongoose";

export interface IUser extends mongoose.Document {
	ID: String;
	display_name: String;
	replays: String[];
}

const UserSchema: mongoose.Schema = new mongoose.Schema({
	ID: {
		type: String,
		required: [true, "Add ID"],
		unique: true
	},
	display_name: {
		type: String
	},
	replays: [{ type: String }]
});

export const User: mongoose.Model<IUser> = mongoose.models.User || model("User", UserSchema, "users");
