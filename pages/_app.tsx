import "bootstrap/dist/css/bootstrap.min.css";
import { SSRProvider } from "react-bootstrap";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import React, { useEffect } from "react";

function MyApp({ Component, pageProps }) {
	return (
		<SSRProvider>
			<SessionProvider session={pageProps.session}>
				{Component.auth ? (
					<Auth>
						<Component {...pageProps} />
					</Auth>
				) : (
					<Component {...pageProps} />
				)}
			</SessionProvider>
		</SSRProvider>
	);
}

function Auth({ children }) {
	const { data: session, status } = useSession();
	const isUser = !!session?.user;
	useEffect(() => {
		if (status === "loading") return;
		if (!isUser) signIn();
	}, [isUser, status]);

	if (isUser) {
		return children;
	}

	return <div>Loading...</div>;
}

export default MyApp;
