import { Button, Row } from "react-bootstrap";
import { getSession, signIn } from "next-auth/react";

import Layout from "../../components/Layout";
import { IReplay, Replay } from "../../models/Replay";
import { ISession } from "../api/auth/[...nextauth]";
import { IUser, User } from "../../models/User";
import dbConnect from "../../utils/dbConnect";
import hash from "../../utils/Hash";
import { useRouter } from "next/router";

export default function Code({
	replay,
	session,
	uploader,
	password
}: {
	replay: IReplay;
	session: ISession;
	uploader: string;
	password: string | null;
}): React.ReactElement {
	const router = useRouter();

	if (replay.error) {
		if (replay.error == 404) {
			return (
				<Layout>
					<h1>Replay does not exist.</h1>
				</Layout>
			);
		} else if (replay.error == 403) {
			return (
				<Layout>
					<h1>Incorrect password.</h1>
				</Layout>
			);
		} else if (replay.error == 401) {
			return (
				<Layout>
					<h1>This replay is private. Sign in to view.</h1>
					<br></br>
					<Button onClick={() => signIn()}>Click to sign in</Button>
				</Layout>
			);
		}
	}

	return (
		<>
			<head>
				<meta name="description" content={("Replay #" + replay.ID) as string} />
				<meta property="og:description" content={("Replay #" + replay.ID) as string} />
			</head>
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
							<a href={"https://osu.ppy.sh/users/" + replay.uploader}>{uploader || replay.uploader}</a>
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

				<Button
					onClick={() =>
						router.push(
							`/api/replays/${replay.ID}/download${
								password && password.length > 0 ? `?password=${password}` : ""
							}`
						)
					}
					size="lg"
				>
					Download
				</Button>
			</Layout>
		</>
	);
}

export async function getServerSideProps(context) {
	await dbConnect();
	const session: ISession | null = await getSession(context);

	const { code, password } = context.query;

	var replay = await Replay.findOne({ ID: code });

	if (!replay) return { props: { replay: { error: 404 }, session: session, uploader: null } };

	// JSON cant be serealised, delete _id not working??
	replay = JSON.parse(JSON.stringify(replay));

	const replayPassword = replay.password || "";
	replay.password = null;

	var uploader: IUser | null = await User.findOne({ ID: replay.uploader });

	if (session) {
		if (session.user.id == replay.uploader)
			return { props: { replay: replay, session: session, uploader: uploader.osu_username, password: null } };
	}

	if (!replay.public) {
		if (!session) {
			return { props: { replay: { error: 401 }, session: null, uploader: null, password: null } };
		}
	}

	if (replayPassword.length > 0) {
		if (!password || hash(password) !== replayPassword) {
			return { props: { replay: { error: 403 }, session: session, uploader: null, password: null } };
		}
	}

	return { props: { replay: replay, session: session, uploader: uploader.osu_username, password: password || null } };
}
