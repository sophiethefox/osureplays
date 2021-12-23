import { getSession } from "next-auth/react";
import { User } from "../models/User";
import dbConnect from "../utils/dbConnect";
import { ISession } from "./api/auth/[...nextAuth]";

export default function Account({ session, user }): React.ReactElement {
	return <></>;
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
