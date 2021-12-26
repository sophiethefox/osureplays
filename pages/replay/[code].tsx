import { Row } from "react-bootstrap";
import { getSession } from "next-auth/react";

import Layout from "../../components/Layout";
import { IReplay } from "../../models/Replay";
import { ISession } from "../api/auth/[...nextauth]";

export default function Code({ replay, session }: { replay: IReplay; session: ISession }): React.ReactElement {
	return (
		<>
			{replay.error == 403 ? (
				<h1>Incorrect Password</h1>
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
							Uploaded by: <span style={{ color: "gray" }}>{replay.uploader}</span>
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
								{replay.accuracy}% | {replay._300s} {replay._100s} {replay._50s} {replay.misses}
							</span>
						</h4>
					</Row>
					<Row>
						<h4>
							PP: <span style={{ color: "gray" }}>{replay.pp}%</span>
						</h4>
					</Row>
					<Row>
						<h4>
							Duration: <span style={{ color: "gray" }}>{replay.duration}%</span>
						</h4>
					</Row>
					{replay.watch_link.length > 0 && (
						<Row>
							<h4>
								Watch: <span style={{ color: "gray" }}>{replay.watch_link}%</span>
							</h4>
						</Row>
					)}
				</Layout>
			)}
		</>
	);
}

// https://nextjs.org/docs/basic-features/data-fetching#:~:text=Note%3A%20You%20should%20not%20use%20fetch()%20to%20call%20an%20API%20route%20in%20getServerSideProps.%20Instead%2C%20directly%20import%20the%20logic%20used%20inside%20your%20API%20route.%20You%20may%20need%20to%20slightly%20refactor%20your%20code%20for%20this%20approach.
// lmao
export async function getServerSideProps(context) {
	const session = await getSession(context);

	const { code, password } = context.query;

	const res = await fetch(`http://localhost:3000/api/replays/${code}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			Authorization: `${password}`
		}
	});

	const data = await res.json();

	if (data.error && data.error == 403) {
		return { props: { replay: { error: 403 }, session: null } };
	}

	return { props: { replay: data, session: session } };
}
