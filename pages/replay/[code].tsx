import { IReplay } from "../../models/Replay";
import { Row } from "react-bootstrap";
import Layout from "../../components/Layout";
import { getSession } from "next-auth/react";

export default function Code({ replay, session }): React.ReactElement {
	return (
		<>
			{replay.error == 403 ? (
				<h1>Incorrect Password</h1>
			) : (
				<Layout>
					<Row>
						<h4>
							Beatmap:{" "}
							<span style={{ color: "gray" }}>
								{(replay as IReplay).beatmap_title} [{(replay as IReplay).beatmap_difficulty}]
							</span>
						</h4>
					</Row>
					<Row>
						<h4>
							Uploaded by: <span style={{ color: "gray" }}>{(replay as IReplay).uploader}</span>
						</h4>
					</Row>
					<Row>
						<h4>
							Star: <span style={{ color: "gray" }}>{(replay as IReplay).star}</span>
						</h4>
					</Row>
					<Row>
						<h4>
							Accuracy: <span style={{ color: "gray" }}>{(replay as IReplay).accuracy}%</span>
						</h4>
					</Row>
				</Layout>
			)}
		</>
	);
}

// https://nextjs.org/docs/basic-features/data-fetching#:~:text=Note%3A%20You%20should%20not%20use%20fetch()%20to%20call%20an%20API%20route%20in%20getServerSideProps.%20Instead%2C%20directly%20import%20the%20logic%20used%20inside%20your%20API%20route.%20You%20may%20need%20to%20slightly%20refactor%20your%20code%20for%20this%20approach.
// lmao
export async function getServerSideProps(context) {
	const { code, password } = context.query;

	const res = await fetch(`http://localhost:3000/api/replays/${code}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			Authorization: `${password}`
		}
	});

	const data = await res.json();

	if (data.error && data.error == 403) {
		return { props: { replay: { error: 403 } } };
	}

	return { props: { replay: data, session: await getSession(context) } };
}
