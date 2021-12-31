import { ISession } from "./../../auth/[...nextauth]";
import { Replay } from "../../../../models/Replay";

import type { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "../../../../utils/dbConnect";
import { getSession } from "next-auth/react";

import fs from "fs";
import path from "path";
import hash from "../../../../utils/Hash";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session: ISession | null = await getSession({ req });
	await dbConnect();

	const { id } = req.query;

	const replay = await Replay.findOne({ ID: id });

	if (!replay) {
		res.status(404).json({ error: 404 });
		return;
	}

	const replayPassword = replay.password || "";
	replay.password = null;

	if (session) {
		if (replay.uploader === session.user.id) {
			const filePath = path.resolve(".", "replays/" + id + ".osr");
			const fileBuffer = fs.readFileSync(filePath);
			res.setHeader("Content-Type", "x-osu-replay");
			res.setHeader("Content-disposition", `attachment; filename=${id}.osr`);
			res.send(fileBuffer);

			return;
		}
	}

	if (!replay.public) {
		if (!session) {
			res.status(403).json({ error: 403, message: "Replay not public. Please sign in." });
			return;
		}
	}

	var password: string = "";
	try {
		password = req.query.password as string;
	} catch (e) {
		res.status(400).json({ error: 400 });
		return;
	}
	if (replayPassword.length > 0) {
		if (!password || password.length == 0) {
			res.status(403).json({ error: 403 });
			return;
		}

		if (hash(password) !== replayPassword) {
			res.status(403).json({ error: 403 });
			return;
		}
	}

	const filePath = path.resolve(".", "replays/" + id + ".osr");
	const fileBuffer = fs.readFileSync(filePath);
	res.setHeader("Content-Type", "x-osu-replay");
	res.setHeader("Content-disposition", `attachment; filename=${id}.osr`);
	res.send(fileBuffer);
};
