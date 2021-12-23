import { getSession } from "next-auth/react";
import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";

import { User } from "../models/User";
import Layout from "../components/Layout";
import dbConnect from "../utils/dbConnect";
import { ISession } from "./api/auth/[...nextauth]";

export default function Account({ session, user }): React.ReactElement {
	const [displayName, setDisplayName] = useState((session as ISession).user.name);

	if (!session) {
		return (
			<Layout>
				<h1>Not signed in!</h1>
			</Layout>
		);
	}

	return (
		<Layout>
			<Form>
				<Form.Group as={Row} className="mb-3" controlId="displayName">
					<Form.Label column sm="2">
						Display Name
					</Form.Label>
					<Col sm="10">
						<Form.Control
							type="text"
							value={displayName || user.display_name}
							onChange={(e) => setDisplayName(e.target.value)}
						/>
					</Col>
				</Form.Group>
			</Form>
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

	return { props: { session: session, user: user } };
}
