import "bootstrap/dist/css/bootstrap.min.css";
import { SSRProvider } from "react-bootstrap";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }) {
	return (
		<SSRProvider>
			<SessionProvider session={pageProps.session}>
				<Component {...pageProps} />
			</SessionProvider>
		</SSRProvider>
	);
}

export default MyApp;
