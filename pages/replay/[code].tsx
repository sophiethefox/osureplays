import { Button, Row } from "react-bootstrap";
import { getSession } from "next-auth/react";

import Layout from "../../components/Layout";
import { IReplay, Replay } from "../../models/Replay";
import { ISession } from "../api/auth/[...nextauth]";
import { IUser, User } from "../../models/User";
import { userInfo } from "os";
import dbConnect from "../../utils/dbConnect";
import hash from "../../utils/Hash";

export default function Code({
	replay,
	session,
	uploader
}: {
	replay: IReplay;
	session: ISession;
	uploader: string;
}): React.ReactElement {
	return (
		<>
			{replay.error == 403 || replay.error == 404 ? (
				<h1>Replay does not exist or incorrect password</h1>
			) : (
				<Layout>
					<Row>
						<h4>
							Beatmap:{" "}
							<span style={{ color: "gray" }}>
								{replay.beatmap_title} [{replay.beatmap_difficulty}]
							</span>
						</h4>
					</Row>
					<Row>
						<h4>
							Uploaded by:{" "}
							<span style={{ color: "gray" }}>
								<a href={"https://osu.ppy.sh/users/" + replay.uploader}>
									{uploader || replay.uploader}
								</a>
							</span>
						</h4>
					</Row>
					<Row>
						<h4>
							Star: <span style={{ color: "gray" }}>{replay.star}</span>
						</h4>
					</Row>
					<Row>
						<h4>
							Accuracy:{" "}
							<span style={{ color: "gray" }}>
								{replay.accuracy}% | {replay._300s} {replay._100s} {replay._50s} {replay.misses}x
							</span>
						</h4>
					</Row>
					<Row>
						<h4>
							PP: <span style={{ color: "gray" }}>{replay.pp}</span>
						</h4>
					</Row>
					<Row>
						<h4>
							Duration: <span style={{ color: "gray" }}>{replay.duration}</span>
						</h4>
					</Row>
					{replay.watch_link?.length > 0 && (
						<Row>
							<h4>
								Watch: <span style={{ color: "gray" }}>{replay.watch_link}</span>
							</h4>
						</Row>
					)}

					<Button size="lg">Download</Button>
				</Layout>
			)}
		</>
	);
}

export async function getServerSideProps(context) {
	await dbConnect();
	const session: ISession | null = await getSession(context);

	const { code, password } = context.query;

	var replay = await Replay.findOne({ ID: code });

	if (!replay) return { props: { replay: { error: 404 }, session: session, uploader: null } };

	replay = JSON.parse(JSON.stringify(replay));
	// JSON cant be serealised, delete _id not working??

	var uploader: IUser | null = await User.findOne({ ID: replay.uploader });

	// TODO: Check public...
	if (session) {
		if (session.user.id == replay.uploader)
			return { props: { replay: replay, session: session, uploader: uploader.osu_username } };
	}

	if (replay.password.length > 0) {
		if (!password || hash(password) !== replay.password) {
			return { props: { replay: { error: 403 }, session: session, uploader: null } };
		}
	}

	return { props: { replay: replay, session: session, uploader: uploader.osu_username } };
}
