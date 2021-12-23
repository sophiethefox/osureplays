import { ListGroup, Row } from "react-bootstrap";
import Layout from "../components/Layout";

export default function About(): React.ReactElement {
	return (
		<Layout>
			<div
				style={{
					textAlign: "center"
				}}
			>
				<h1>osu! Replays</h1>
				<br />
				<h2>
					Developed by <a href="https://twitter.com/chrkkz">chrkkz</a>
				</h2>
				<p>Started development on 2021-12-19 23:00 GMT+11</p>
				<br />
				<br />

				<h3 style={{ textDecorationLine: "underline" }}>Made Using</h3>
				<ListGroup variant="flush">
					<ListGroup.Item>
						<a href="https://www.typescriptlang.org/">Typescript</a>
					</ListGroup.Item>
					<ListGroup.Item>
						<a href="https://nextjs.org/">NextJS</a>
					</ListGroup.Item>
					<ListGroup.Item>
						<a href="https://next-auth.js.org/">NextAuth.js</a>
					</ListGroup.Item>
					<ListGroup.Item>
						<a href="https://www.mongodb.com/">MongoDB</a>
					</ListGroup.Item>
					<ListGroup.Item>
						<a href="https://mongoosejs.com">Mongoose</a>
					</ListGroup.Item>
					<ListGroup.Item>
						<a href="https://react-bootstrap.github.io/">React Bootstrap</a>
					</ListGroup.Item>
				</ListGroup>
				<br />
				<br />
				<h3>Closed source, may eventually be public.</h3>
			</div>
		</Layout>
	);
}
