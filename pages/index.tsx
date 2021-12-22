import { CSSProperties, useEffect, useState } from "react";
import Router from "next/router";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { IReplay } from "../models/Replay";
import Layout from "../components/Layout";

export default function Home(): React.ReactElement {
	const [code, setCode] = useState("");
	const [replayFound, setReplayFound] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [replayPassword, setReplayPassword] = useState("");

	function handleReplayKeyPress(event) {
		if (event.key === "Enter") {
			if (code.length == 0) return;

			setReplayFound(true);

			fetch(`http://localhost:3000/api/replays/${code}`)
				.then((res) => res.json())
				.then((replay: IReplay) => {
					if (replay.error && replay.error != 200 && replay.error != 403) {
						setReplayFound(false);
						setShowAlert(true);
						return;
					}

					if (replay.error && replay.error == 403) {
						setShowModal(true);
						return;
					}

					// TODO: Handle public check

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
		if (showAlert) {
			window.setTimeout(() => {
				setShowAlert(false);
			}, 2000);
		}
	}, [showAlert]);

	useEffect(() => {
		if (!showModal) setReplayFound(false);
	}, [showModal]);

	return (
		<Layout>
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

			<Alert variant="danger" show={showAlert}>
				Replay not found!
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
