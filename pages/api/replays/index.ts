import { getSession } from "next-auth/react";
import { NextApiResponse, NextApiRequest } from "next";

import { Replay } from "../../../models/Replay";
import { ISession } from "../auth/[...nextauth]";
// /api/replays/

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session: ISession | null = await getSession({ req });
	if (!session) {
		res.status(401).json({ error: 401 });

		return;
	}

	var page = parseInt(req.query.page as string) || 0;
	var limit = parseInt(req.query.limit as string) || 10;

	// https://stackoverflow.com/questions/18133635/remove-property-for-all-objects-in-array
	// .select("-password") is not working so lol
	var replays = JSON.parse(
		JSON.stringify(
			await Replay.find({ uploader: session.user.id })
				.skip(page * limit)
				.limit(limit)
				.exec()
		)
	).map(({ password, ...keep }) => keep);

	res.status(200).json(replays);
};
