import Router from "next/router";
import { getSession, signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Button, FormControl, InputGroup, ListGroup, OverlayTrigger, Popover, Table } from "react-bootstrap";

import { User } from "../models/User";
import Layout from "../components/Layout";
import { Replay } from "../models/Replay";
import dbConnect from "../utils/dbConnect";
import { ISession } from "./api/auth/[...nextauth]";
import Pagination from "react-bootstrap/Pagination";

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

export default function Replays({ session, user, replays }): React.ReactElement {
	const [_replays, set_Replays] = useState(replays);
	const [page, setPage] = useState(1);
	const [filterInput, setFilterInput] = useState("");

	// TODO: Support title / diff filter.
	// TODO: Ah wait this only filters loaded results.
	useEffect(() => {
		var regex = /--(star|duration|accuracy|fc|pp|pass)(=|!=|<|>)(([+-]?([0-9]+\.?[0-9]*|\.[0-9]+))|true|false)/g;

		var result;
		while ((result = regex.exec(filterInput.toLowerCase())) !== null) {
			var flag = result[1];
			var operator = result[2];
			var value = result[3];

			switch (operator) {
				case "=":
					set_Replays(replays.filter((replay) => replay[flag] == value));
					break;
				case "!=":
					set_Replays(replays.filter((replay) => replay[flag] != value));
					break;
				case "<":
					set_Replays(replays.filter((replay) => replay[flag] < value));
					break;
				case ">":
					set_Replays(replays.filter((replay) => replay[flag] > value));
					break;
			}
		}
	}, [filterInput]);

	// TODO: pagination

	return (
		<Layout>
			<InputGroup className="mb-3">
				<FormControl
					type="search"
					placeholder="Search"
					className="me-2"
					aria-label="Search"
					aria-describedby="description"
					onChange={(e) => setFilterInput(e.target.value)}
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
					{_replays.slice((page - 1) * 10, page * 10).map((replay) => {
						return (
							<tr key={replay.ID}>
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

			<Pagination>
				<Pagination.First disabled={page <= 2} onClick={() => setPage(1)} />

				<Pagination.Prev disabled={page <= 1} onClick={() => setPage(page - 1)} />

				{page > 1 && <Pagination.Item onClick={() => setPage(page - 1)}>{page - 1}</Pagination.Item>}
				<Pagination.Item>{page}</Pagination.Item>
				{_replays.length > page * 10 && (
					<Pagination.Item onClick={() => setPage(page + 1)}>{page + 1}</Pagination.Item>
				)}

				<Pagination.Next disabled={_replays.length < page * 10 + 1} onClick={() => setPage(page + 1)} />
				<Pagination.Last
					disabled={_replays.length < (page + 1) * 10 + 1}
					onClick={() => setPage(Math.ceil(_replays / 10))}
				/>
			</Pagination>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	await dbConnect();

	const session: ISession | null = await getSession(context);

	var user: any = {};
	var replays: any = {};

	if (session) {
		user = (await User.findOne({ ID: session.user.id })).toJSON();
		delete user._id;
		replays = JSON.parse(JSON.stringify(await Replay.find({ uploader: session.user.id }))).map(
			({ password, ...keep }) => keep
		);
	}

	// https://stackoverflow.com/questions/18133635/remove-property-for-all-objects-in-array
	// .select("-password") is not working so lol

	return { props: { session: session, user: user, replays: replays } };
}

Replays.auth = true;
