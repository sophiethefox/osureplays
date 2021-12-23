import Head from "next/head";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { CSSProperties } from "react";

const footerStyle: CSSProperties = {
	position: "fixed",
	bottom: "0",
	textAlign: "center",
	borderTop: "1px solid #E7E7E7",
	width: "100%"
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
				<Container style={{ borderBottom: "1px solid #E7E7E7" }}>
					<Navbar>
						<Container fluid>
							<Nav>
								<Nav.Link href="/"> Home </Nav.Link>
								{session && <Nav.Link href="/upload"> Upload </Nav.Link>}
							</Nav>

							{session ? (
								<NavDropdown title={session.user.name} className="d-flex">
									<NavDropdown.Item href="/account">Account</NavDropdown.Item>
									<NavDropdown.Item href="/replays">Replays</NavDropdown.Item>
									<NavDropdown.Divider />
									<NavDropdown.Item onClick={() => signOut()} style={{ color: "red" }}>
										Sign Out
									</NavDropdown.Item>
								</NavDropdown>
							) : (
								<Navbar.Collapse className="justify-content-end">
									<Navbar.Text>
										<Nav.Link onClick={() => signIn()}>Sign In</Nav.Link>
									</Navbar.Text>
								</Navbar.Collapse>
							)}
						</Container>
					</Navbar>
				</Container>

				<br />

				<Container>{children}</Container>

				<footer style={footerStyle}>
					<Link href="/about">About</Link>
				</footer>
			</body>
		</>
	);
}
