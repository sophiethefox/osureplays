import { getSession } from "next-auth/react";
import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";

import { User } from "../models/User";
import Layout from "../components/Layout";
import dbConnect from "../utils/dbConnect";
import { ISession } from "./api/auth/[...nextauth]";

// what is user lol i forgot my own code that fast
export default function Account({ session, user }: { session: ISession; user: any }): React.ReactElement {
	const [displayName, setDisplayName] = useState(session.user.name);

	return (
		<Layout>
			<Form>
				<Form.Group as={Row} className="mb-3" controlId="displayName">
					<Form.Label column sm="2">
						Display Name:
					</Form.Label>
					<Col sm="10">
						<Form.Control
							type="text"
							value={displayName || user.display_name}
							onChange={(e) => setDisplayName(e.target.value)}
						/>
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="mb-3" controlId="osuProfile">
					<Form.Label column sm="2">
						osu! Profile:
					</Form.Label>
					<Col>
						<a href={"https://osu.ppy.sh/users/" + session.user.id}>{session.user.name}</a>
					</Col>
				</Form.Group>
			</Form>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	await dbConnect(); // TODO: does this reconnect each time? idk

	const session: ISession | null = await getSession(context);
	var user: any = {};

	if (session) {
		user = (await User.findOne({ ID: session.user.id })).toJSON();
		delete user._id;
	}

	return { props: { session: session, user: user } };
}

Account.auth = true;
