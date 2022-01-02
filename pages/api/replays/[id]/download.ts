import { ISession } from "./../../auth/[...nextauth]";
import { Replay } from "../../../../models/Replay";

import type { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "../../../../utils/dbConnect";
import { getSession } from "next-auth/react";

import hash from "../../../../utils/Hash";
import { getClient, storageConnect } from "../../../../utils/storageConnect";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session: ISession | null = await getSession({ req });
	await dbConnect();
	await storageConnect();
	const client = await getClient();

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
			const fileBuffer = await client.get(`./replays/${id}.osr`);
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

	const fileBuffer = await client.get(`./replays/${id}.osr`);
	res.setHeader("Content-Type", "x-osu-replay");
	res.setHeader("Content-disposition", `attachment; filename=${id}.osr`);
	res.send(fileBuffer);
};
