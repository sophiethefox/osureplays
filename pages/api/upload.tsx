import { getSession } from "next-auth/react";
import { NextApiResponse, NextApiRequest } from "next";
import formidable from "formidable";

import fs from "fs";
import osr from "node-osr";

import { Replay } from "../../models/Replay";
import { ISession } from "./auth/[...nextauth]";
import dbConnect from "../../utils/dbConnect";
import { storageConnect, getClient } from "../../utils/storageConnect";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect();
	await storageConnect();
	const client = await getClient();

	const session: ISession | null = await getSession({ req });
	if (!session || !session.accessToken) {
		res.status(401).json({ error: 401 });
		return;
	}

	if (req.method === "POST") {
		const time = Date.now();

		const form = formidable({
			uploadDir: "./replays/",
			filename: (name, ext, { originalFilename, mimetype }, form) => {
				return session.user.id + time;
			},
			keepExtensions: true,
			maxFileSize: 2 * 1024 * 1024,
			allowEmptyFiles: false
		});

		// TODO: Check if there are no files
		form.parse(req, async (err, fields, files) => {
			if (!files || !files["file"]) {
				res.status(400).json({ error: 400, message: "Missing replay file" });
				return;
			}

			const file = files["file"];

			const replay = osr.readSync((file as any).filepath);

			const playerName = replay.playerName;

			if (playerName !== session.user.name) {
				res.status(403).json({ error: 403, message: "Replay not created by you (username does not match)." });
				return;
			}

			if (replay.gameMode !== 0) {
				res.status(400).json({ error: 400, message: "Only osu!std is supported." });
				return;
			}

			if (!replay.beatmapMD5) return res.status(400).json({ error: 400 });

			var beatmap = await (
				await fetch(`https://osu.ppy.sh/api/v2/beatmaps/lookup?checksum=${replay.beatmapMD5}`, {
					headers: {
						"Authorization": `Bearer ${session.accessToken}`,
						"Content-Type": "application/json",
						"Accept": "application/json"
					}
				})
			).json();

			// TODO: user input for password public and custom pp and watch link

			console.log(beatmap);

			if (replay.authentication && replay.authentication == "basic") {
				// Something went wrong with authentication.
				res.status(401);
				res.redirect("/signout");
				return;
			}

			const replayObject = {
				ID: session.user.id + beatmap.id + time,
				password: null,
				public: true,
				path: `${session.user.id}/${beatmap.id}/${time}`,
				beatmap_ID: beatmap.id,
				beatmap_title: beatmap.beatmapset.title,
				beatmap_difficulty: beatmap.version,
				uploader: session.user.id,
				upload_date: "" + time,
				play_date: "" + new Date(replay.timestamp).getTime(),
				star: beatmap.difficulty_rating,
				duration: beatmap.total_length,
				accuracy:
					((replay.number_300s * 300 + replay.number_100s * 100 + replay.number_50s * 50) /
						((replay.number_300s + replay.number_100s + replay.number_50s + replay.misses) * 300)) *
					100,
				_300s: replay.number_300s,
				_100s: replay.number_100s,
				_50s: replay.number_50s,
				misses: replay.misses,
				fc: replay.perfect_combo === 1,
				pp: 0,
				custom_pp: false,
				pass: replay.life_bar.endsWith("|0,"),
				mods: replay.mods,
				watch_link: null
			};

			Replay.create(replayObject);

			if (!client) {
				console.log("CLIENT IS NULL");
				return;
			}
			client.put((file as any).filepath, `./replays/${session.user.id}${beatmap.id}${time}.osr`).then(() => {
				fs.unlinkSync((file as any).filepath);
				res.status(200).json(replayObject);
			});
		});
	} else {
		res.status(405).json({ error: 405 });
	}
};

export const config = {
	api: {
		bodyParser: false
	}
};
