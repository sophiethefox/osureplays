import { getSession } from "next-auth/react";
import Router from "next/router";
import { useState } from "react";
import { Table } from "react-bootstrap";
import Layout from "../components/Layout";
import { Replay } from "../models/Replay";
import { User } from "../models/User";
import dbConnect from "../utils/dbConnect";
import { ISession } from "./api/auth/[...nextAuth]";

export default function Account({ session, user, replays }): React.ReactElement {
	const [fReplays, setFReplays] = useState([]);
	const [page, setPage] = useState(1); // Starts at 0, 0 already fetched in pre-render.

	// TODO: pagination ,search

	return (
		<Layout>
			<Table striped hover>
				<thead>
					<tr>
						<th>Title</th>
						<th>Star</th>
						<th>Accuracy</th>
						<th>FC</th>
						<th>PP</th>
						<th>Duration</th>
					</tr>
				</thead>
				<tbody>
					{replays.map((replay) => {
						return (
							<tr>
								<td
									onClick={() => Router.push("/replay/" + replay.ID)}
									style={{ textDecorationLine: "underline" }}
								>
									{replay.beatmap_title} [{replay.beatmap_difficulty}
								</td>
								<td>{replay.star}*</td>
								<td>{replay.accuracy}%</td>
								<td>{replay.fc ? "/" : "X"}</td>
								<td>{replay.pp}</td>
								<td>{replay.duration}s</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	dbConnect(); // TODO: does this reconnect each time? idk

	const session = await getSession(context);
	var user;

	if (session) {
		user = (await User.findOne({ ID: (session as ISession).user.id })).toJSON();
	}

	delete user._id;

	// https://stackoverflow.com/questions/18133635/remove-property-for-all-objects-in-array
	// .select("-password") is not working so lol

	var replays = JSON.parse(
		JSON.stringify(
			await Replay.find({ uploader: (session as ISession).user.id })
				.skip(0)
				.limit(10)
				.exec()
		)
	).map(({ password, ...keep }) => keep);

	return { props: { session: session, user: user, replays: replays } };
}
