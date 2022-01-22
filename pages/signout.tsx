import { getSession, signOut } from "next-auth/react";

export default function SignOut({ session }): React.ReactElement {
	return <button onClick={() => signOut()}>Click to sign out (please click if you were redirected here)</button>;
}
export async function getServerSideProps(context) {
	const session = await getSession(context);

	if (!session) {
		return {
			redirect: {
				destination: "/",
				permanent: false
			}
		};
	}

	return {
		props: { session }
	};
}
