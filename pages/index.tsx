import Router from "next/router";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Alert, Button, Container, Form, Modal, Spinner } from "react-bootstrap";

import Layout from "../components/Layout";
import { IReplay } from "../models/Replay";

export default function Home({ session }): React.ReactElement {
	const [code, setCode] = useState("");
	const [replayFound, setReplayFound] = useState(false);
	const [showNoReplayAlert, setShowNoReplayAlert] = useState(false);
	const [showPrivateReplayAlert, setShowPrivateReplayAlert] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [replayPassword, setReplayPassword] = useState("");

	function handleReplayKeyPress(event) {
		if (event.key === "Enter") {
			if (code.length == 0) return;

			if (!/^[0-9]+$/.test(code)) return;

			setReplayFound(true);

			fetch(`https://osureplays.net/api/replays/${code}`)
				.then((res) => res.json())
				.then((replay: IReplay) => {
					if (replay.error && replay.error == 404) {
						setReplayFound(false);
						setShowNoReplayAlert(true);
						return;
					}

					if (replay.error && replay.error == 403) {
						setShowModal(true);
						return;
					}

					if (!replay.public && !session) {
						setShowPrivateReplayAlert(true);
						return;
					}

					Router.push("/replay/" + code);
				});
		}
	}

	function handlePasswordKeyPress(event) {
		if (event.key === "Enter") {
			handlePassword();
		}
	}

	function handlePassword() {
		if (replayPassword.length == 0) return;
		Router.push({
			pathname: "/replay/" + code,
			query: { password: replayPassword }
		});
	}

	useEffect(() => {
		if (showNoReplayAlert) {
			window.setTimeout(() => {
				setShowNoReplayAlert(false);
			}, 3000);
		}
	}, [showNoReplayAlert]);

	useEffect(() => {
		if (showPrivateReplayAlert) {
			window.setTimeout(() => {
				setShowPrivateReplayAlert(false);
			}, 3000);
		}
	}, [showPrivateReplayAlert]);

	useEffect(() => {
		if (!showModal) setReplayFound(false);
	}, [showModal]);

	return (
		<Layout>
			{!showModal && replayFound && (
				<Container
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						position: "fixed",
						width: "100%",
						height: "100%"
					}}
				>
					<Spinner animation="border" />
				</Container>
			)}

			{showModal && (
				<Modal.Dialog centered>
					<Modal.Header>
						<Modal.Title>This replay requires a password</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<Form.Control
							autoFocus
							size="sm"
							type="password"
							placeholder="Password"
							onChange={(e) => setReplayPassword(e.target.value)}
							onKeyPress={handlePasswordKeyPress}
						/>
					</Modal.Body>

					<Modal.Footer>
						<Button variant="secondary" onClick={() => setShowModal(false)}>
							Close
						</Button>
						<Button variant="success" onClick={() => handlePassword()}>
							Confirm
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			)}

			<Alert variant="danger" show={showNoReplayAlert}>
				Replay not found!
			</Alert>

			<Alert variant="danger" show={showPrivateReplayAlert}>
				This replay is private. Please sign in to view.
			</Alert>

			<div>
				<Form.Control
					size="lg"
					type="text"
					placeholder="Replay Code"
					disabled={replayFound}
					onChange={(e) => setCode(e.target.value)}
					onKeyPress={handleReplayKeyPress}
				/>
			</div>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	return { props: { session: await getSession(context) } };
}
