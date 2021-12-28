import { ISession } from "./../../auth/[...nextauth]";
import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

import { Replay } from "../../../../models/Replay";
import dbConnect from "../../../../utils/dbConnect";
import { getSession } from "next-auth/react";

// TODO: improve idk
// TODO: shud probs salt
export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session: ISession | null = await getSession({ req }); // ah this is being fetched without setting cookies and stuff

	const { id } = req.query;
	await dbConnect();

	const replay = await Replay.findOne({ ID: id });

	if (!replay) {
		res.status(404).json({ error: 404 });
		return;
	}

	const replayPassword = replay.password;
	replay.password = "";

	if (session) {
		if (replay.uploader === session.user.id) {
			res.status(200).json(replay);
			return;
		}
	}

	if (!replay.public) {
		// TODO: Check if user signed in
		console.log("Not public");
	}

	// This api route is only ever accessed from the home page where all it needs to do is *check* if there is a password.
	if (replayPassword.length > 0) {
		res.status(403).json({ error: 403 });
		return;
	}

	res.status(200).json(replay);
};
