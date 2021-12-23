import { getSession } from "next-auth/react";
import Router from "next/router";
import { useEffect, useState } from "react";
import { Button, FormControl, InputGroup, ListGroup, OverlayTrigger, Popover, Table } from "react-bootstrap";
import Layout from "../components/Layout";
import { Replay } from "../models/Replay";
import { User } from "../models/User";
import dbConnect from "../utils/dbConnect";
import { ISession } from "./api/auth/[...nextAuth]";

const popover = (
	<Popover>
		<Popover.Header as="h3">Search Flags</Popover.Header>
		<Popover.Body>
			{"= != < >"}
			<ListGroup>
				<ListGroup.Item>--star</ListGroup.Item>
				<ListGroup.Item>--duration</ListGroup.Item>
				<ListGroup.Item>--accuracy</ListGroup.Item>
				<ListGroup.Item>--FC</ListGroup.Item>
				<ListGroup.Item>--PP</ListGroup.Item>
				<ListGroup.Item>--pass</ListGroup.Item>
			</ListGroup>
		</Popover.Body>
	</Popover>
);

export default function Account({ session, user, replays }): React.ReactElement {
	const [_replays, set_Replays] = useState(replays);
	const [page, setPage] = useState(1); // Starts at 0, 0 already fetched in pre-render.
	const [filter, setFilter] = useState("");

	// TODO: Support title / diff filter.
	// TODO: Table isnt updating. :(.
	useEffect(() => {
		var regex = /--(star|duration|accuracy|fc|pp|pass)(=|!=|<|>)(([+-]?([0-9]+\.?[0-9]*|\.[0-9]+))|true|false)/g;

		var result;
		while ((result = regex.exec(filter.toLowerCase())) !== null) {
			var flag = result[1];
			var operator = result[2];
			var value = result[3];

			switch (operator) {
				case "=":
					set_Replays(_replays.filter((replay) => replay[flag] == value));
					break;
				case "!=":
					set_Replays(_replays.filter((replay) => replay[flag] != value));
					break;
				case "<":
					set_Replays(_replays.filter((replay) => replay[flag] < value));
					break;
				case ">":
					set_Replays(_replays.filter((replay) => replay[flag] > value));
					break;
			}
		}
	}, [filter]);

	// TODO: pagination ,search

	return (
		<Layout>
			<InputGroup className="mb-3">
				<FormControl
					type="search"
					placeholder="Search"
					className="me-2"
					aria-label="Search"
					aria-describedby="description"
					onChange={(e) => setFilter(e.target.value)}
				/>
				<OverlayTrigger trigger="click" placement="right" overlay={popover}>
					<Button id="description">?</Button>
				</OverlayTrigger>
			</InputGroup>

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
					{_replays.map((replay) => {
						return (
							<tr>
								<td
									onClick={() => Router.push("/replay/" + replay.ID)}
									style={{ textDecorationLine: "underline" }}
								>
									{replay.beatmap_title} [{replay.beatmap_difficulty}]
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
