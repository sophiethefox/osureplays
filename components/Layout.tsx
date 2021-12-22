import Head from "next/head";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { CSSProperties } from "react";

const footerStyle: CSSProperties = {
	marginTop: "auto",
	minHeight: "50px",
	fontSize: "large"
};

export default function Layout({ children }) {
	const { data: session } = useSession();

	return (
		<>
			<Head>
				<title>osu! Replays</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<body>
				<Container>
					<Navbar>
						<Nav>
							<Nav.Link href="/"> Home </Nav.Link>
							{session && <Nav.Link href="/upload"> Upload </Nav.Link>}
						</Nav>

						{session ? (
							<Navbar.Collapse className="justify-content-end">
								<Navbar.Text>
									<Nav.Link href="/account">{session.user.name}</Nav.Link>
								</Navbar.Text>
							</Navbar.Collapse>
						) : (
							<Navbar.Collapse className="justify-content-end">
								<Navbar.Text>
									<Nav.Link onClick={() => signIn()}>Sign In</Nav.Link>
								</Navbar.Text>
							</Navbar.Collapse>
						)}
					</Navbar>
				</Container>

				<Container>{children}</Container>

				<footer style={footerStyle}>
					<Link href="/about">About</Link>
				</footer>
			</body>
		</>
	);
}
