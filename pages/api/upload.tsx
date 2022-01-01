import { getSession } from "next-auth/react";
import { NextApiResponse, NextApiRequest } from "next";
import formidable from "formidable";

import fs from "fs";

import { Replay } from "../../models/Replay";
import { ISession } from "./auth/[...nextauth]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session: ISession | null = await getSession({ req });
	if (!session) {
		res.status(401).json({ error: 401 });
		return;
	}

	if (req.method === "POST") {
		const form = formidable({
			uploadDir: "./uploads/",
			filename: (name, ext, { originalFilename, mimetype }, form) => {
				return session.user.id + Date.now();
			},
			keepExtensions: true,
			maxFiles: 1,
			maxFileSize: 2 * 1024 * 1024
		});

		form.parse(req, (err, fields, files) => {
			const file = files["file"];

			console.log(file);

			res.status(200).json(files);
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
