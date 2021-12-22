import dbConnect from "../../../../utils/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../../models/User";
import { Replay } from "../../../../models/Replay";
import { createHash } from "crypto";

import fs from "fs";
import path from "path";
import hash from "../../../../utils/Hash";

dbConnect();

// fetch("http://localhost:3000/api/replays/1564975528313621639918625", {headers:{'Authorization': 'Basic ' +btoa('regex:password')}})
/*
  fetch("http://localhost:3000/api/replays/1564975528313621639918625", {headers:{'Authorization': 'Basic ' +btoa('regex:password'), 'file': 'true'}})
 	.then(res => res.blob())
	.then(blob => {
		var file = window.URL.createObjectURL(blob);
		window.location.assign(file);
	});
*/
export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { id } = req.query;
	const method = req.method;

	if (method === "GET") {
		try {
			// console.log("id " + id);

			const replay = await Replay.findOne({ ID: id });

			if (!replay) {
				res.status(404).json({ error: 404 });
				return;
			}

			if (replay.password.length > 0) {
				// Check authorization against password
				const authorization = req.headers.authorization;

				if (!authorization || authorization.length == 0) {
					res.status(403).json({ error: 403 });
					return;
				}

				const hashedPW = hash(authorization);

				if (hashedPW != replay.password) {
					res.status(403).json({ error: 403 });
					return;
				}
			}

			if (!replay.public) {
				// TODO: Check if user signed in
				console.log("Not public");
			}

			// Remove password from replay before sending
			replay.password = "true";

			const sendFile = req.headers["file"];

			if (sendFile === "true") {
				const filePath = path.resolve(".", "replays/" + id + ".osr");
				const fileBuffer = fs.readFileSync(filePath);
				res.setHeader("Content-Type", "x-osu-replay");
				res.send(fileBuffer);
			} else {
				res.status(200).json(replay);
			}
		} catch (e) {
			console.log(e);
			res.status(400);
		}
	}
};
