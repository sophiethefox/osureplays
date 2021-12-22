import mongoose from "mongoose";

export interface IReplay extends mongoose.Document {
	ID: String;
	password: String;
	public: String;
	path: String;
	beatmap_ID: String;
	beatmap_title: String;
	beatmap_difficulty: String;
	uploader: String;
	upload_date: String;
	play_date: String;
	star: Number;
	duration: Number;
	accuracy: Number;
	_300s: Number;
	_100s: Number;
	_50s: Number;
	fc: Boolean;
	pp: Number;
	custom_pp: Boolean;
	pass: Boolean;
	mods: String[];
	watch_link: String;
	error?: number;
}

const ReplaySchema: mongoose.Schema = new mongoose.Schema({
	ID: {
		type: String,
		required: [true, "Add an ID"],
		unique: true
	},
	password: {
		type: String
	},
	public: {
		type: Boolean,
		required: true
	},
	path: {
		type: String,
		required: true
	},
	beatmap_ID: {
		type: String,
		required: true
	},
	beatmap_title: {
		type: String,
		required: true
	},
	beatmap_difficulty: {
		type: String,
		required: true
	},
	uploader: {
		type: String,
		required: true
	},
	upload_date: {
		type: String,
		required: true
	},
	play_date: {
		type: String,
		required: true
	},
	star: {
		type: Number,
		required: true
	},
	duration: {
		type: Number,
		required: true
	},
	accuracy: {
		type: Number,
		required: true
	},
	_300s: {
		type: Number,
		required: true
	},
	_100s: {
		type: Number,
		required: true
	},
	_50s: {
		type: Number,
		required: true
	},
	fc: {
		type: Boolean,
		required: true
	},
	pp: {
		type: Number,
		required: true
	},
	custom_pp: {
		type: Boolean,
		required: true
	},
	pass: {
		type: Boolean,
		required: true
	},
	mods: [
		{
			type: String,
			required: false
		}
	],
	watch_link: {
		type: String
	}
});

export const Replay: mongoose.Model<IReplay> =
	mongoose.models.Replay || mongoose.model("Replay", ReplaySchema, "replays");
